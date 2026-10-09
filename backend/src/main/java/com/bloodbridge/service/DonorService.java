
package com.bloodbridge.service;

import com.bloodbridge.dto.donor.CreateDonorProfileRequest;
import com.bloodbridge.dto.donor.DonorProfileResponse;
import com.bloodbridge.dto.donor.DonorSearchResponse;
import com.bloodbridge.dto.donor.UpdateDonorProfileRequest;
import com.bloodbridge.entity.DonorProfile;
import com.bloodbridge.entity.User;
import com.bloodbridge.repository.DonorProfileRepository;
import com.bloodbridge.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DonorService {

    private final DonorProfileRepository donorProfileRepository;
    private final UserRepository userRepository;
    private final DonorMatchingService donorMatchingService;

    public DonorService(
            DonorProfileRepository donorProfileRepository,
            UserRepository userRepository,
            DonorMatchingService donorMatchingService) {

        this.donorProfileRepository = donorProfileRepository;
        this.userRepository = userRepository;
        this.donorMatchingService = donorMatchingService;
    }

    // =========================================================
    // CREATE DONOR PROFILE
    // =========================================================

    @Transactional
    public DonorProfileResponse createProfile(
            String authenticatedEmail,
            CreateDonorProfileRequest request) {

        User user = userRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        if (user.getRole() != User.Role.PATIENT
                && user.getRole() != User.Role.DONOR) {
            throw new IllegalArgumentException(
                    "Only eligible users can create a donor profile");
        }

        if (donorProfileRepository.existsByUserId(user.getId())) {
            throw new IllegalArgumentException(
                    "Donor profile already exists");
        }

        DonorProfile.BloodGroup bloodGroup =
                parseBloodGroup(request.getBloodGroup());

        DonorProfile.Gender gender =
                parseGender(request.getGender());

        DonorProfile donorProfile = DonorProfile.builder()
                .user(user)
                .bloodGroup(bloodGroup)
                .dateOfBirth(request.getDateOfBirth())
                .gender(gender)
                .address(request.getAddress().trim())
                .available(true)
                .verificationStatus(
                        DonorProfile.VerificationStatus.PENDING)
                .build();

        DonorProfile saved =
                donorProfileRepository.save(donorProfile);

        return toResponse(saved);
    }

    // =========================================================
    // GET MY DONOR PROFILE
    // =========================================================

    @Transactional(readOnly = true)
    public DonorProfileResponse getMyProfile(
            String authenticatedEmail) {

        User user = userRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        DonorProfile donorProfile = donorProfileRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Donor profile not found"));

        return toResponse(donorProfile);
    }

    // =========================================================
    // UPDATE DONOR PROFILE
    // Blood group is immutable through this endpoint.
    // =========================================================

    @Transactional
    public DonorProfileResponse updateProfile(
            String authenticatedEmail,
            UpdateDonorProfileRequest request) {

        User user = userRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        DonorProfile donorProfile = donorProfileRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Donor profile not found"));

        // Deliberately do not read or modify bloodGroup.
        donorProfile.setDateOfBirth(request.getDateOfBirth());
        donorProfile.setGender(parseGender(request.getGender()));
        donorProfile.setAddress(request.getAddress().trim());

        DonorProfile saved =
                donorProfileRepository.save(donorProfile);

        return toResponse(saved);
    }

    // =========================================================
    // UPDATE DONOR AVAILABILITY
    // =========================================================

    @Transactional
    public DonorProfileResponse updateAvailability(
            String authenticatedEmail,
            Boolean available) {

        User user = userRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        DonorProfile donorProfile = donorProfileRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Donor profile not found"));

        if (available == null) {
            throw new IllegalArgumentException(
                    "Availability is required");
        }

        donorProfile.setAvailable(available);

        DonorProfile saved =
                donorProfileRepository.save(donorProfile);

        if (Boolean.TRUE.equals(available)) {
            donorMatchingService.matchOpenRequestsForDonor(saved);
        }

        return toResponse(saved);
    }

    // =========================================================
    // SEARCH VERIFIED AND AVAILABLE DONORS
    // =========================================================

    @Transactional(readOnly = true)
    public Page<DonorSearchResponse> searchDonors(
            String bloodGroup,
            Pageable pageable) {

        DonorProfile.BloodGroup parsedBloodGroup =
                parseBloodGroup(bloodGroup);

        return donorProfileRepository
                .findByBloodGroupAndAvailableTrueAndVerificationStatus(
                        parsedBloodGroup,
                        DonorProfile.VerificationStatus.VERIFIED,
                        pageable)
                .map(this::toSearchResponse);
    }

    // =========================================================
    // MAP DONOR PROFILE RESPONSE
    // =========================================================

    private DonorProfileResponse toResponse(
            DonorProfile donorProfile) {

        User user = donorProfile.getUser();

        return DonorProfileResponse.builder()
                .id(donorProfile.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .bloodGroup(
                        donorProfile.getBloodGroup() == null
                                ? null
                                : formatBloodGroup(
                                        donorProfile.getBloodGroup()))
                .dateOfBirth(donorProfile.getDateOfBirth())
                .gender(
                        donorProfile.getGender() == null
                                ? null
                                : donorProfile.getGender().name())
                .address(donorProfile.getAddress())
                .available(donorProfile.getAvailable())
                .lastDonationDate(donorProfile.getLastDonationDate())
                .verificationStatus(
                        donorProfile.getVerificationStatus())
                .build();
    }

    // =========================================================
    // MAP DONOR SEARCH RESPONSE
    // =========================================================

    private DonorSearchResponse toSearchResponse(
            DonorProfile donorProfile) {

        User user = donorProfile.getUser();

        return DonorSearchResponse.builder()
                .donorProfileId(donorProfile.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .bloodGroup(
                        formatBloodGroup(
                                donorProfile.getBloodGroup()))
                .gender(donorProfile.getGender().name())
                .address(donorProfile.getAddress())
                .available(donorProfile.getAvailable())
                .verificationStatus(
                        donorProfile.getVerificationStatus().name())
                .build();
    }

    // =========================================================
    // PARSE BLOOD GROUP
    // =========================================================

    private DonorProfile.BloodGroup parseBloodGroup(
            String bloodGroup) {

        if (bloodGroup == null || bloodGroup.isBlank()) {
            throw new IllegalArgumentException(
                    "Blood group is required");
        }

        return switch (bloodGroup.trim().toUpperCase()) {
            case "A+" -> DonorProfile.BloodGroup.A_POSITIVE;
            case "A-" -> DonorProfile.BloodGroup.A_NEGATIVE;
            case "B+" -> DonorProfile.BloodGroup.B_POSITIVE;
            case "B-" -> DonorProfile.BloodGroup.B_NEGATIVE;
            case "AB+" -> DonorProfile.BloodGroup.AB_POSITIVE;
            case "AB-" -> DonorProfile.BloodGroup.AB_NEGATIVE;
            case "O+" -> DonorProfile.BloodGroup.O_POSITIVE;
            case "O-" -> DonorProfile.BloodGroup.O_NEGATIVE;
            default -> throw new IllegalArgumentException(
                    "Invalid blood group. Allowed values: "
                            + "A+, A-, B+, B-, AB+, AB-, O+, O-");
        };
    }

    // =========================================================
    // PARSE GENDER
    // =========================================================

    private DonorProfile.Gender parseGender(String gender) {

        if (gender == null || gender.isBlank()) {
            throw new IllegalArgumentException("Gender is required");
        }

        try {
            return DonorProfile.Gender.valueOf(
                    gender.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                    "Invalid gender. Allowed values: MALE, FEMALE, OTHER");
        }
    }

    // =========================================================
    // FORMAT BLOOD GROUP
    // =========================================================

    private String formatBloodGroup(
            DonorProfile.BloodGroup bloodGroup) {

        if (bloodGroup == null) {
            return null;
        }

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
