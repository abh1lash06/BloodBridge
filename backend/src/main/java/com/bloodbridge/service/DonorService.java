package com.bloodbridge.service;

import com.bloodbridge.dto.donor.CreateDonorProfileRequest;
import com.bloodbridge.dto.donor.DonorProfileResponse;
import com.bloodbridge.dto.donor.DonorSearchResponse;
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

    public DonorService(
            DonorProfileRepository donorProfileRepository,
            UserRepository userRepository) {

        this.donorProfileRepository = donorProfileRepository;
        this.userRepository = userRepository;
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

        if (user.getRole() != User.Role.PATIENT &&
                user.getRole() != User.Role.DONOR) {

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

    @Transactional
    public DonorProfileResponse updateProfile(
            String authenticatedEmail,
            CreateDonorProfileRequest request) {
        User user = userRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (user.getRole() != User.Role.DONOR) {
            throw new IllegalArgumentException("Only donor accounts can update donor profiles");
        }
        DonorProfile profile = donorProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Donor profile not found"));
        DonorProfile.BloodGroup requestedBloodGroup = parseBloodGroup(request.getBloodGroup());
        if (requestedBloodGroup != profile.getBloodGroup()) {
            throw new IllegalArgumentException("Blood group cannot be changed after registration");
        }
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setGender(parseGender(request.getGender()));
        profile.setAddress(request.getAddress().trim());
        return toResponse(donorProfileRepository.save(profile));
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

        DonorProfile donorProfile =
                donorProfileRepository.findByUserId(user.getId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Donor profile not found"));

        return toResponse(donorProfile);
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

        DonorProfile donorProfile =
                donorProfileRepository.findByUserId(user.getId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Donor profile not found"));

        donorProfile.setAvailable(available);

        DonorProfile saved =
                donorProfileRepository.save(donorProfile);

        return toResponse(saved);
    }

    // =========================================================
    // SEARCH VERIFIED + AVAILABLE DONORS
    // =========================================================

    @Transactional(readOnly = true)
    public Page<DonorSearchResponse> searchDonors(
            String bloodGroup,
            Pageable pageable) {

        DonorProfile.BloodGroup parsedBloodGroup =
                parseBloodGroup(bloodGroup);

        Page<DonorProfile> donors =
                donorProfileRepository
                        .findByBloodGroupAndAvailableTrueAndVerificationStatus(
                                parsedBloodGroup,
                                DonorProfile.VerificationStatus.VERIFIED,
                                pageable
                        );

        return donors.map(this::toSearchResponse);
    }

    // =========================================================
    // CONVERT DONOR PROFILE TO SEARCH RESPONSE
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
    // CONVERT DONOR PROFILE TO NORMAL RESPONSE
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
                        formatBloodGroup(
                                donorProfile.getBloodGroup()))
                .dateOfBirth(donorProfile.getDateOfBirth())
                .gender(donorProfile.getGender().name())
                .address(donorProfile.getAddress())
                .available(donorProfile.getAvailable())
                .lastDonationDate(
                        donorProfile.getLastDonationDate())
                .verificationStatus(
                        donorProfile.getVerificationStatus())
                .build();
    }

    // =========================================================
    // PARSE BLOOD GROUP
    // =========================================================

    private DonorProfile.BloodGroup parseBloodGroup(
            String bloodGroup) {

        if (bloodGroup == null) {
            throw new IllegalArgumentException(
                    "Blood group is required");
        }

        return switch (bloodGroup.trim().toUpperCase()) {

            case "A+" ->
                    DonorProfile.BloodGroup.A_POSITIVE;

            case "A-" ->
                    DonorProfile.BloodGroup.A_NEGATIVE;

            case "B+" ->
                    DonorProfile.BloodGroup.B_POSITIVE;

            case "B-" ->
                    DonorProfile.BloodGroup.B_NEGATIVE;

            case "AB+" ->
                    DonorProfile.BloodGroup.AB_POSITIVE;

            case "AB-" ->
                    DonorProfile.BloodGroup.AB_NEGATIVE;

            case "O+" ->
                    DonorProfile.BloodGroup.O_POSITIVE;

            case "O-" ->
                    DonorProfile.BloodGroup.O_NEGATIVE;

            default ->
                    throw new IllegalArgumentException(
                            "Invalid blood group");
        };
    }

    // =========================================================
    // PARSE GENDER
    // =========================================================

    private DonorProfile.Gender parseGender(
            String gender) {

        if (gender == null) {
            throw new IllegalArgumentException(
                    "Gender is required");
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
    // FORMAT BLOOD GROUP FOR API RESPONSE
    // =========================================================

    private String formatBloodGroup(
            DonorProfile.BloodGroup bloodGroup) {

        return switch (bloodGroup) {

            case A_POSITIVE ->
                    "A+";

            case A_NEGATIVE ->
                    "A-";

            case B_POSITIVE ->
                    "B+";

            case B_NEGATIVE ->
                    "B-";

            case AB_POSITIVE ->
                    "AB+";

            case AB_NEGATIVE ->
                    "AB-";

            case O_POSITIVE ->
                    "O+";

            case O_NEGATIVE ->
                    "O-";
        };
    }
}