package com.bloodbridge.service;

import com.bloodbridge.dto.matching.BloodRequestMatchResponse;
import com.bloodbridge.dto.matching.DonorMatchInboxResponse;
import com.bloodbridge.dto.matching.DonorMatchResponse;
import com.bloodbridge.entity.BloodRequest;
import com.bloodbridge.entity.BloodRequestMatch;
import com.bloodbridge.entity.DonorProfile;
import com.bloodbridge.entity.Notification;
import com.bloodbridge.entity.User;
import com.bloodbridge.repository.BloodRequestMatchRepository;
import com.bloodbridge.repository.BloodRequestRepository;
import com.bloodbridge.repository.DonorProfileRepository;
import com.bloodbridge.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonorMatchingService {

    private final BloodRequestRepository bloodRequestRepository;
    private final DonorProfileRepository donorProfileRepository;
    private final BloodRequestMatchRepository bloodRequestMatchRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public DonorMatchingService(
            BloodRequestRepository bloodRequestRepository,
            DonorProfileRepository donorProfileRepository,
            BloodRequestMatchRepository bloodRequestMatchRepository,
            UserRepository userRepository,
            NotificationService notificationService) {

        this.bloodRequestRepository =
                bloodRequestRepository;

        this.donorProfileRepository =
                donorProfileRepository;

        this.bloodRequestMatchRepository =
                bloodRequestMatchRepository;

        this.userRepository =
                userRepository;

        this.notificationService =
                notificationService;
    }

    // =========================================================
    // PATIENT - VIEW PERSISTED MATCHES
    // =========================================================

    @Transactional(readOnly = true)
    public Page<BloodRequestMatchResponse> getMyMatches(
            String authenticatedEmail,
            Long requestId,
            int page,
            int size) {

        User patient = userRepository
                .findByEmail(authenticatedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        if (patient.getRole() != User.Role.PATIENT) {
            throw new IllegalArgumentException(
                    "Only patients can view blood request matches"
            );
        }

        BloodRequest bloodRequest =
                bloodRequestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Blood request not found"
                                )
                        );

        verifyPatientOwnership(
                bloodRequest,
                patient
        );

        Page<BloodRequestMatch> matches =
                bloodRequestMatchRepository
                        .findByBloodRequestId(
                                requestId,
                                PageRequest.of(page, size)
                        );

        return matches.map(this::toMatchResponse);
    }

    // =========================================================
    // PATIENT - FIND AND PERSIST MATCHING DONORS
    // =========================================================

    @Transactional
    public Page<DonorMatchResponse> findMatchingDonors(
            String authenticatedEmail,
            Long requestId,
            int page,
            int size) {

        User patient = userRepository
                .findByEmail(authenticatedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        if (patient.getRole() != User.Role.PATIENT) {
            throw new IllegalArgumentException(
                    "Only patients can search matching donors"
            );
        }

        BloodRequest bloodRequest =
                bloodRequestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Blood request not found"
                                )
                        );

        verifyPatientOwnership(
                bloodRequest,
                patient
        );

        if (bloodRequest.getStatus() !=
                BloodRequest.Status.OPEN) {

            throw new IllegalArgumentException(
                    "Only open blood requests can be matched"
            );
        }

        DonorProfile.BloodGroup donorBloodGroup =
                convertBloodGroup(
                        bloodRequest.getBloodGroup()
                );

        Page<DonorProfile> donors =
                donorProfileRepository
                        .findByBloodGroupAndAvailableTrueAndVerificationStatus(
                                donorBloodGroup,
                                DonorProfile.VerificationStatus.VERIFIED,
                                PageRequest.of(page, size)
                        );

        /*
         * Create a pending match for every eligible donor
         * who has not already been matched to this request.
         */
        donors.getContent().forEach(donorProfile -> {

            boolean alreadyMatched =
                    bloodRequestMatchRepository
                            .existsByBloodRequestIdAndDonorProfileId(
                                    bloodRequest.getId(),
                                    donorProfile.getId()
                            );

            if (alreadyMatched) {
                return;
            }

            BloodRequestMatch match =
                    BloodRequestMatch.builder()
                            .bloodRequest(bloodRequest)
                            .donorProfile(donorProfile)
                            .status(
                                    BloodRequestMatch.MatchStatus.PENDING
                            )
                            .build();

            bloodRequestMatchRepository.save(match);

            /*
             * Notify the donor that a new blood request
             * is available for them.
             */
            notificationService.createNotification(
                    donorProfile.getUser(),
                    Notification.NotificationType.DONOR_MATCHED,
                    "New Blood Donation Request",
                    "You have been matched with a blood request for "
                            + formatBloodGroup(
                                    bloodRequest.getBloodGroup()
                            )
                            + " blood at "
                            + bloodRequest.getHospitalName(),
                    bloodRequest.getId()
            );
        });

        return donors.map(this::toResponse);
    }

    // =========================================================
    // DONOR - VIEW MATCH INBOX
    // =========================================================

    @Transactional(readOnly = true)
    public Page<DonorMatchInboxResponse> getDonorMatches(
            String authenticatedEmail,
            int page,
            int size) {

        User donor = userRepository
                .findByEmail(authenticatedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        if (donor.getRole() != User.Role.DONOR) {
            throw new IllegalArgumentException(
                    "Only donors can view donor matches"
            );
        }

        DonorProfile donorProfile =
                donorProfileRepository
                        .findByUserId(donor.getId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Donor profile not found"
                                )
                        );

        Page<BloodRequestMatch> matches =
                bloodRequestMatchRepository
                        .findByDonorProfileIdOrderByMatchedAtDesc(
                                donorProfile.getId(),
                                PageRequest.of(page, size)
                        );

        return matches.map(
                this::toDonorMatchInboxResponse
        );
    }

    // =========================================================
    // DONOR - ACCEPT MATCH
    // =========================================================

    @Transactional
    public void acceptMatch(
            String authenticatedEmail,
            Long matchId) {

        BloodRequestMatch match =
                getDonorOwnedMatch(
                        authenticatedEmail,
                        matchId
                );

        if (match.getStatus() !=
                BloodRequestMatch.MatchStatus.PENDING) {

            throw new IllegalArgumentException(
                    "Only pending matches can be accepted"
            );
        }

        BloodRequest request =
                match.getBloodRequest();

        if (request.getStatus() !=
                BloodRequest.Status.OPEN) {

            throw new IllegalArgumentException(
                    "Only matches for open blood requests can be accepted"
            );
        }

        // -----------------------------------------------------
        // Accept this donor's match
        // -----------------------------------------------------

        match.setStatus(
                BloodRequestMatch.MatchStatus.ACCEPTED
        );

        match.setRespondedAt(
                LocalDateTime.now()
        );

        bloodRequestMatchRepository.save(match);

        // -----------------------------------------------------
        // Change request status from OPEN to MATCHED
        // -----------------------------------------------------

        request.setStatus(
                BloodRequest.Status.MATCHED
        );

        bloodRequestRepository.save(request);

        // -----------------------------------------------------
        // Notify the patient
        // -----------------------------------------------------

        notificationService.createNotification(
                request.getPatient(),
                Notification.NotificationType.DONOR_ACCEPTED,
                "Donor Accepted Your Request",
                "A donor has accepted your blood request at "
                        + request.getHospitalName(),
                request.getId()
        );

        // -----------------------------------------------------
        // Cancel all other pending matches
        // -----------------------------------------------------

        List<BloodRequestMatch> otherPendingMatches =
                bloodRequestMatchRepository
                        .findByBloodRequestIdAndStatus(
                                request.getId(),
                                BloodRequestMatch.MatchStatus.PENDING
                        );

        LocalDateTime cancellationTime =
                LocalDateTime.now();

        for (BloodRequestMatch otherMatch :
                otherPendingMatches) {

            if (!otherMatch.getId().equals(match.getId())) {

                otherMatch.setStatus(
                        BloodRequestMatch.MatchStatus.CANCELLED
                );

                otherMatch.setRespondedAt(
                        cancellationTime
                );
            }
        }

        if (!otherPendingMatches.isEmpty()) {

            bloodRequestMatchRepository.saveAll(
                    otherPendingMatches
            );
        }
    }

    // =========================================================
    // DONOR - REJECT MATCH
    // =========================================================

    @Transactional
    public void rejectMatch(
            String authenticatedEmail,
            Long matchId) {

        BloodRequestMatch match =
                getDonorOwnedMatch(
                        authenticatedEmail,
                        matchId
                );

        if (match.getStatus() !=
                BloodRequestMatch.MatchStatus.PENDING) {

            throw new IllegalArgumentException(
                    "Only pending matches can be rejected"
            );
        }

        match.setStatus(
                BloodRequestMatch.MatchStatus.REJECTED
        );

        match.setRespondedAt(
                LocalDateTime.now()
        );

        bloodRequestMatchRepository.save(match);

        // -----------------------------------------------------
        // Notify patient
        // -----------------------------------------------------

        notificationService.createNotification(
                match.getBloodRequest().getPatient(),
                Notification.NotificationType.DONOR_REJECTED,
                "Donor Declined Your Request",
                "A matched donor has declined your blood request.",
                match.getBloodRequest().getId()
        );
    }

    // =========================================================
    // DONOR - VERIFY MATCH OWNERSHIP
    // =========================================================

    private BloodRequestMatch getDonorOwnedMatch(
            String authenticatedEmail,
            Long matchId) {

        User donor = userRepository
                .findByEmail(authenticatedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        if (donor.getRole() != User.Role.DONOR) {
            throw new IllegalArgumentException(
                    "Only donors can respond to matches"
            );
        }

        DonorProfile donorProfile =
                donorProfileRepository
                        .findByUserId(donor.getId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Donor profile not found"
                                )
                        );

        BloodRequestMatch match =
                bloodRequestMatchRepository
                        .findById(matchId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Match not found"
                                )
                        );

        if (!match.getDonorProfile()
                .getId()
                .equals(donorProfile.getId())) {

            throw new IllegalArgumentException(
                    "You are not authorized to respond to this match"
            );
        }

        return match;
    }

    // =========================================================
    // PATIENT OWNERSHIP CHECK
    // =========================================================

    private void verifyPatientOwnership(
            BloodRequest bloodRequest,
            User patient) {

        if (!bloodRequest.getPatient()
                .getId()
                .equals(patient.getId())) {

            throw new IllegalArgumentException(
                    "You are not authorized to access this blood request"
            );
        }
    }

    // =========================================================
    // PATIENT MATCH RESPONSE
    // =========================================================

    private BloodRequestMatchResponse toMatchResponse(
            BloodRequestMatch match) {

        DonorProfile donorProfile =
                match.getDonorProfile();

        User donor =
                donorProfile.getUser();

        return BloodRequestMatchResponse.builder()
                .matchId(match.getId())
                .bloodRequestId(
                        match.getBloodRequest().getId()
                )
                .donorProfileId(
                        donorProfile.getId()
                )
                .donorUserId(
                        donor.getId()
                )
                .donorName(
                        donor.getFullName()
                )
                .bloodGroup(
                        formatBloodGroup(
                                donorProfile.getBloodGroup()
                        )
                )
                .donorGender(
                        donorProfile.getGender().name()
                )
                .donorAddress(
                        donorProfile.getAddress()
                )
                .donorAvailable(
                        donorProfile.getAvailable()
                )
                .verificationStatus(
                        donorProfile
                                .getVerificationStatus()
                                .name()
                )
                .status(
                        match.getStatus()
                )
                .matchedAt(
                        match.getMatchedAt()
                )
                .respondedAt(
                        match.getRespondedAt()
                )
                .build();
    }

    // =========================================================
    // DONOR INBOX RESPONSE
    // =========================================================

    private DonorMatchInboxResponse
    toDonorMatchInboxResponse(
            BloodRequestMatch match) {

        BloodRequest request =
                match.getBloodRequest();

        User patient =
                request.getPatient();

        return DonorMatchInboxResponse.builder()
                .matchId(match.getId())
                .bloodRequestId(
                        request.getId()
                )
                .patientName(
                        patient.getFullName()
                )
                .bloodGroup(
                        formatBloodGroup(
                                request.getBloodGroup()
                        )
                )
                .unitsRequired(
                        request.getUnitsRequired()
                )
                .hospitalName(
                        request.getHospitalName()
                )
                .hospitalAddress(
                        request.getHospitalAddress()
                )
                .urgency(
                        request.getUrgency().name()
                )
                .requestStatus(
                        request.getStatus().name()
                )
                .requiredDate(
                        request.getRequiredDate()
                )
                .additionalNotes(
                        request.getAdditionalNotes()
                )
                .matchStatus(
                        match.getStatus()
                )
                .matchedAt(
                        match.getMatchedAt()
                )
                .respondedAt(
                        match.getRespondedAt()
                )
                .build();
    }

    // =========================================================
    // DONOR SEARCH RESPONSE
    // =========================================================

    private DonorMatchResponse toResponse(
            DonorProfile donorProfile) {

        User donor =
                donorProfile.getUser();

        return DonorMatchResponse.builder()
                .donorProfileId(
                        donorProfile.getId()
                )
                .userId(
                        donor.getId()
                )
                .fullName(
                        donor.getFullName()
                )
                .bloodGroup(
                        formatBloodGroup(
                                donorProfile.getBloodGroup()
                        )
                )
                .gender(
                        donorProfile.getGender().name()
                )
                .address(
                        donorProfile.getAddress()
                )
                .available(
                        donorProfile.getAvailable()
                )
                .verificationStatus(
                        donorProfile
                                .getVerificationStatus()
                                .name()
                )
                .build();
    }

    // =========================================================
    // BLOOD GROUP CONVERSION
    // =========================================================

    private DonorProfile.BloodGroup convertBloodGroup(
            BloodRequest.BloodGroup bloodGroup) {

        return switch (bloodGroup) {

            case A_POSITIVE ->
                    DonorProfile.BloodGroup.A_POSITIVE;

            case A_NEGATIVE ->
                    DonorProfile.BloodGroup.A_NEGATIVE;

            case B_POSITIVE ->
                    DonorProfile.BloodGroup.B_POSITIVE;

            case B_NEGATIVE ->
                    DonorProfile.BloodGroup.B_NEGATIVE;

            case AB_POSITIVE ->
                    DonorProfile.BloodGroup.AB_POSITIVE;

            case AB_NEGATIVE ->
                    DonorProfile.BloodGroup.AB_NEGATIVE;

            case O_POSITIVE ->
                    DonorProfile.BloodGroup.O_POSITIVE;

            case O_NEGATIVE ->
                    DonorProfile.BloodGroup.O_NEGATIVE;
        };
    }

    // =========================================================
    // DONOR BLOOD GROUP FORMAT
    // =========================================================

    private String formatBloodGroup(
            DonorProfile.BloodGroup bloodGroup) {

        return switch (bloodGroup) {

            case A_POSITIVE -> "A+";
            case A_NEGATIVE -> "A-";
            case B_POSITIVE -> "B+";
            case B_NEGATIVE -> "B-";
            case AB_POSITIVE -> "AB+";
            case AB_NEGATIVE -> "AB-";
            case O_POSITIVE -> "O+";
            case O_NEGATIVE -> "O-";
        };
    }

    // =========================================================
    // BLOOD REQUEST BLOOD GROUP FORMAT
    // =========================================================

    private String formatBloodGroup(
            BloodRequest.BloodGroup bloodGroup) {

        return switch (bloodGroup) {

            case A_POSITIVE -> "A+";
            case A_NEGATIVE -> "A-";
            case B_POSITIVE -> "B+";
            case B_NEGATIVE -> "B-";
            case AB_POSITIVE -> "AB+";
            case AB_NEGATIVE -> "AB-";
            case O_POSITIVE -> "O+";
            case O_NEGATIVE -> "O-";
        };
    }
}