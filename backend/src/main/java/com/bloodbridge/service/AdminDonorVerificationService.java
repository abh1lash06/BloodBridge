package com.bloodbridge.service;

import com.bloodbridge.dto.donor.DonorSearchResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import com.bloodbridge.entity.DonorProfile;
import com.bloodbridge.entity.DonorVerificationAudit;
import com.bloodbridge.entity.User;
import com.bloodbridge.repository.DonorProfileRepository;
import com.bloodbridge.repository.DonorVerificationAuditRepository;
import com.bloodbridge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminDonorVerificationService {

    private final DonorProfileRepository donorProfileRepository;
    private final DonorVerificationAuditRepository auditRepository;
    private final UserRepository userRepository;
    private final DonorMatchingService donorMatchingService;

    public AdminDonorVerificationService(
            DonorProfileRepository donorProfileRepository,
            DonorVerificationAuditRepository auditRepository,
            UserRepository userRepository,
            DonorMatchingService donorMatchingService) {

        this.donorProfileRepository = donorProfileRepository;
        this.auditRepository = auditRepository;
        this.userRepository = userRepository;
        this.donorMatchingService = donorMatchingService;
    }

    @Transactional(readOnly = true)
    public Page<DonorSearchResponse> listPendingDonors(int page, int size) {
        return donorProfileRepository.findByVerificationStatus(
                DonorProfile.VerificationStatus.PENDING, PageRequest.of(page, size)).map(profile ->
                DonorSearchResponse.builder()
                        .donorProfileId(profile.getId())
                        .userId(profile.getUser().getId())
                        .fullName(profile.getUser().getFullName())
                        .bloodGroup(profile.getBloodGroup().name())
                        .gender(profile.getGender().name())
                        .address(profile.getAddress())
                        .available(profile.getAvailable())
                        .verificationStatus(profile.getVerificationStatus().name())
                        .build());
    }

    @Transactional
    public void verifyDonor(
            Long donorProfileId,
            String authenticatedAdminEmail,
            String reason) {

        updateVerificationStatus(
                donorProfileId,
                authenticatedAdminEmail,
                DonorProfile.VerificationStatus.VERIFIED,
                reason
        );
    }

    @Transactional
    public void rejectDonor(
            Long donorProfileId,
            String authenticatedAdminEmail,
            String reason) {

        updateVerificationStatus(
                donorProfileId,
                authenticatedAdminEmail,
                DonorProfile.VerificationStatus.REJECTED,
                reason
        );
    }

    private void updateVerificationStatus(
            Long donorProfileId,
            String authenticatedAdminEmail,
            DonorProfile.VerificationStatus newStatus,
            String reason) {

        User admin = userRepository
                .findByEmail(authenticatedAdminEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Admin user not found"
                        )
                );

        if (admin.getRole() != User.Role.ADMIN) {
            throw new IllegalArgumentException(
                    "Only administrators can verify donors"
            );
        }

        DonorProfile donorProfile =
                donorProfileRepository.findById(donorProfileId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Donor profile not found"
                                )
                        );

        DonorProfile.VerificationStatus previousStatus =
                donorProfile.getVerificationStatus();

        if (previousStatus !=
                DonorProfile.VerificationStatus.PENDING) {

            throw new IllegalArgumentException(
                    "Only pending donor profiles can be verified or rejected"
            );
        }

        donorProfile.setVerificationStatus(newStatus);

        donorProfileRepository.save(donorProfile);

        DonorVerificationAudit audit =
                DonorVerificationAudit.builder()
                        .donorProfile(donorProfile)
                        .adminUser(admin)
                        .previousStatus(previousStatus)
                        .newStatus(newStatus)
                        .reason(normalizeReason(reason))
                        .build();

        auditRepository.save(audit);
        if (newStatus == DonorProfile.VerificationStatus.VERIFIED) {
            donorMatchingService.matchOpenRequestsForDonor(donorProfile);
        }
    }

    private String normalizeReason(String reason) {

        if (reason == null) {
            return null;
        }

        String trimmed = reason.trim();

        if (trimmed.isEmpty()) {
            return null;
        }

        if (trimmed.length() > 500) {
            throw new IllegalArgumentException(
                    "Reason must not exceed 500 characters"
            );
        }

        return trimmed;
    }
}