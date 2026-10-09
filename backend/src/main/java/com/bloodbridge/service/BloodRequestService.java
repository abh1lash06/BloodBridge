package com.bloodbridge.service;

import com.bloodbridge.dto.bloodrequest.BloodRequestResponse;
import com.bloodbridge.dto.bloodrequest.CreateBloodRequestRequest;
import com.bloodbridge.entity.BloodRequest;
import com.bloodbridge.entity.User;
import com.bloodbridge.repository.BloodRequestRepository;
import com.bloodbridge.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final UserRepository userRepository;
    private final DonorMatchingService donorMatchingService;
    private final HospitalService hospitalService;

    public BloodRequestService(
            BloodRequestRepository bloodRequestRepository,
            UserRepository userRepository,
            DonorMatchingService donorMatchingService,
            HospitalService hospitalService) {

        this.bloodRequestRepository = bloodRequestRepository;
        this.userRepository = userRepository;
        this.donorMatchingService = donorMatchingService;
        this.hospitalService = hospitalService;
    }

    // =========================================================
    // CREATE BLOOD REQUEST
    // =========================================================

    @Transactional
    public BloodRequestResponse createRequest(
            String authenticatedEmail,
            CreateBloodRequestRequest request) {

        User patient = userRepository
                .findByEmail(authenticatedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        if (patient.getRole() != User.Role.PATIENT) {
            throw new IllegalArgumentException(
                    "Only patients can create blood requests"
            );
        }

        BloodRequest bloodRequest =
                BloodRequest.builder()
                        .patient(patient)
                        .bloodGroup(
                                parseBloodGroup(
                                        request.getBloodGroup()
                                )
                        )
                        .unitsRequired(
                                request.getUnitsRequired()
                        )
                        .hospitalName(
                                request.getHospitalName().trim()
                        )
                        .hospitalAddress(
                                request.getHospitalAddress().trim()
                        )
                        .urgency(
                                parseUrgency(
                                        request.getUrgency()
                                )
                        )
                        .status(
                                BloodRequest.Status.OPEN
                        )
                        .requiredDate(
                                request.getRequiredDate()
                        )
                        .additionalNotes(
                                request.getAdditionalNotes()
                        )
                        .build();

        BloodRequest saved =
                bloodRequestRepository.save(bloodRequest);

        donorMatchingService.matchNewRequest(saved);
        return toResponse(saved);
    }

    // =========================================================
    // GET MY REQUESTS
    // =========================================================

    @Transactional(readOnly = true)
    public Page<BloodRequestResponse> getMyRequests(
            String authenticatedEmail,
            int page,
            int size) {

        User patient = getPatient(authenticatedEmail);

        Page<BloodRequest> requests =
                bloodRequestRepository
                        .findByPatientIdOrderByCreatedAtDesc(
                                patient.getId(),
                                PageRequest.of(page, size)
                        );

        return requests.map(this::toResponse);
    }

    // =========================================================
    // GET SINGLE REQUEST
    // =========================================================

    @Transactional(readOnly = true)
    public BloodRequestResponse getMyRequest(
            String authenticatedEmail,
            Long requestId) {

        User patient = getPatient(authenticatedEmail);

        BloodRequest bloodRequest =
                bloodRequestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Blood request not found"
                                )
                        );

        verifyOwnership(
                bloodRequest,
                patient
        );

        return toResponse(bloodRequest);
    }

    // =========================================================
    // CANCEL REQUEST
    // =========================================================

    @Transactional
    public void cancelRequest(
            String authenticatedEmail,
            Long requestId) {

        User patient = getPatient(authenticatedEmail);

        BloodRequest bloodRequest =
                bloodRequestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Blood request not found"
                                )
                        );

        verifyOwnership(
                bloodRequest,
                patient
        );

        if (bloodRequest.getStatus() ==
                BloodRequest.Status.CANCELLED) {

            throw new IllegalArgumentException(
                    "Blood request is already cancelled"
            );
        }

        if (bloodRequest.getStatus() ==
                BloodRequest.Status.FULFILLED) {

            throw new IllegalArgumentException(
                    "Fulfilled blood requests cannot be cancelled"
            );
        }

        bloodRequest.setStatus(
                BloodRequest.Status.CANCELLED
        );

        bloodRequestRepository.save(bloodRequest);
        hospitalService.cancelReservationsForRequest(bloodRequest.getId());
        donorMatchingService.cancelAllMatchesForRequest(bloodRequest.getId());
    }

    // =========================================================
    // MARK REQUEST AS FULFILLED
    // =========================================================

    @Transactional
    public void fulfillRequest(
            String authenticatedEmail,
            Long requestId) {

        User patient = getPatient(authenticatedEmail);

        BloodRequest bloodRequest =
                bloodRequestRepository.findById(requestId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Blood request not found"
                                )
                        );

        verifyOwnership(
                bloodRequest,
                patient
        );

        if (bloodRequest.getStatus() !=
                BloodRequest.Status.MATCHED) {

            throw new IllegalArgumentException(
                    "Only matched blood requests can be fulfilled"
            );
        }

        bloodRequest.setStatus(
                BloodRequest.Status.FULFILLED
        );

        bloodRequestRepository.save(bloodRequest);
    }

    // =========================================================
    // PATIENT VALIDATION
    // =========================================================

    private User getPatient(
            String authenticatedEmail) {

        User patient = userRepository
                .findByEmail(authenticatedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        if (patient.getRole() != User.Role.PATIENT) {
            throw new IllegalArgumentException(
                    "Only patients can access blood requests"
            );
        }

        return patient;
    }

    // =========================================================
    // OWNERSHIP VALIDATION
    // =========================================================

    private void verifyOwnership(
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
    // BLOOD GROUP PARSER
    // =========================================================

    private BloodRequest.BloodGroup parseBloodGroup(
            String bloodGroup) {

        if (bloodGroup == null) {
            throw new IllegalArgumentException(
                    "Blood group is required"
            );
        }

        String normalized =
                bloodGroup
                        .trim()
                        .toUpperCase()
                        .replace(" ", "_");

        return switch (normalized) {

            case "A+", "A_POSITIVE" ->
                    BloodRequest.BloodGroup.A_POSITIVE;

            case "A-", "A_NEGATIVE" ->
                    BloodRequest.BloodGroup.A_NEGATIVE;

            case "B+", "B_POSITIVE" ->
                    BloodRequest.BloodGroup.B_POSITIVE;

            case "B-", "B_NEGATIVE" ->
                    BloodRequest.BloodGroup.B_NEGATIVE;

            case "AB+", "AB_POSITIVE" ->
                    BloodRequest.BloodGroup.AB_POSITIVE;

            case "AB-", "AB_NEGATIVE" ->
                    BloodRequest.BloodGroup.AB_NEGATIVE;

            case "O+", "O_POSITIVE" ->
                    BloodRequest.BloodGroup.O_POSITIVE;

            case "O-", "O_NEGATIVE" ->
                    BloodRequest.BloodGroup.O_NEGATIVE;

            default ->
                    throw new IllegalArgumentException(
                            "Invalid blood group"
                    );
        };
    }
    // =========================================================
    // URGENCY PARSER
    // =========================================================

    private BloodRequest.Urgency parseUrgency(
            String urgency) {

        if (urgency == null) {
            throw new IllegalArgumentException(
                    "Urgency is required"
            );
        }

        try {

            return BloodRequest.Urgency.valueOf(
                    urgency.trim().toUpperCase()
            );

        } catch (IllegalArgumentException exception) {

            throw new IllegalArgumentException(
                    "Invalid urgency. Allowed values: NORMAL, URGENT, CRITICAL"
            );
        }
    }

    // =========================================================
    // RESPONSE MAPPER
    // =========================================================

    private BloodRequestResponse toResponse(
            BloodRequest bloodRequest) {

        User patient =
                bloodRequest.getPatient();

        return BloodRequestResponse.builder()
                .id(bloodRequest.getId())
                .patientUserId(patient.getId())
                .patientName(patient.getFullName())
                .bloodGroup(
                        formatBloodGroup(
                                bloodRequest.getBloodGroup()
                        )
                )
                .unitsRequired(
                        bloodRequest.getUnitsRequired()
                )
                .hospitalName(
                        bloodRequest.getHospitalName()
                )
                .hospitalAddress(
                        bloodRequest.getHospitalAddress()
                )
                .urgency(
                        bloodRequest.getUrgency().name()
                )
                .status(
                        bloodRequest.getStatus().name()
                )
                .requiredDate(
                        bloodRequest.getRequiredDate()
                )
                .additionalNotes(
                        bloodRequest.getAdditionalNotes()
                )
                .createdAt(
                        bloodRequest.getCreatedAt()
                )
                .updatedAt(
                        bloodRequest.getUpdatedAt()
                )
                .build();
    }

    // =========================================================
    // BLOOD GROUP FORMATTER
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