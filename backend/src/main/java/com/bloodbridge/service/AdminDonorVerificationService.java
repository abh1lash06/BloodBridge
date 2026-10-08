package com.bloodbridge.service;

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

    public AdminDonorVerificationService(
            DonorProfileRepository donorProfileRepository,
            DonorVerificationAuditRepository auditRepository,
            UserRepository userRepository) {

        this.donorProfileRepository = donorProfileRepository;
        this.auditRepository = auditRepository;
        this.userRepository = userRepository;
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