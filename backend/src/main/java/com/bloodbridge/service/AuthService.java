
package com.bloodbridge.service;

import com.bloodbridge.dto.admin.CreateHospitalAccountRequest;
import com.bloodbridge.dto.auth.LoginRequest;
import com.bloodbridge.dto.auth.LoginResponse;
import com.bloodbridge.dto.auth.RegisterRequest;
import com.bloodbridge.dto.auth.RegisterResponse;
import com.bloodbridge.entity.DonorProfile;
import com.bloodbridge.entity.User;
import com.bloodbridge.repository.DonorProfileRepository;
import com.bloodbridge.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final DonorProfileRepository donorProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            DonorProfileRepository donorProfileRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.donorProfileRepository = donorProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "An account with this email already exists"
            );
        }

        User.Role requestedRole = request.getRole();

        if (requestedRole != User.Role.PATIENT
                && requestedRole != User.Role.DONOR) {
            throw new IllegalArgumentException(
                    "Public registration is allowed only for PATIENT or DONOR accounts"
            );
        }

        // Validate donor profile information before saving the user.
        DonorProfile.BloodGroup bloodGroup = null;
        DonorProfile.Gender gender = null;

        if (requestedRole == User.Role.DONOR) {

            if (request.getBloodGroup() == null
                    || request.getBloodGroup().isBlank()) {
                throw new IllegalArgumentException(
                        "Blood group is required for donor registration"
                );
            }

            if (request.getDateOfBirth() == null) {
                throw new IllegalArgumentException(
                        "Date of birth is required for donor registration"
                );
            }

            if (!request.getDateOfBirth().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException(
                        "Date of birth must be in the past"
                );
            }

            if (request.getGender() == null
                    || request.getGender().isBlank()) {
                throw new IllegalArgumentException(
                        "Gender is required for donor registration"
                );
            }

            if (request.getAddress() == null
                    || request.getAddress().isBlank()) {
                throw new IllegalArgumentException(
                        "Address is required for donor registration"
                );
            }

            if (request.getAddress().trim().length() > 500) {
                throw new IllegalArgumentException(
                        "Address must not exceed 500 characters"
                );
            }

            bloodGroup = parseBloodGroup(request.getBloodGroup());
            gender = parseGender(request.getGender());
        }

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .passwordHash(
                        passwordEncoder.encode(request.getPassword())
                )
                .phone(
                        request.getPhone() == null
                                ? null
                                : request.getPhone().trim()
                )
                .role(requestedRole)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        // Automatically create a complete donor profile.
        if (requestedRole == User.Role.DONOR) {

            DonorProfile donorProfile = DonorProfile.builder()
                    .user(savedUser)
                    .bloodGroup(bloodGroup)
                    .dateOfBirth(request.getDateOfBirth())
                    .gender(gender)
                    .address(request.getAddress().trim())
                    .available(true)
                    .verificationStatus(
                            DonorProfile.VerificationStatus.PENDING
                    )
                    .build();

            donorProfileRepository.save(donorProfile);
        }

        return RegisterResponse.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .role(savedUser.getRole())
                .active(savedUser.getActive())
                .build();
    }

    @Transactional
    public RegisterResponse createHospitalAccount(String adminEmail, CreateHospitalAccountRequest request) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new IllegalArgumentException("Administrator not found"));
        if (admin.getRole() != User.Role.ADMIN) {
            throw new IllegalArgumentException("Only administrators can create hospital accounts");
        }
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists");
        }
        User hospitalUser = userRepository.save(User.builder()
                .fullName(request.getFullName().trim()).email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone() == null ? null : request.getPhone().trim())
                .role(User.Role.HOSPITAL).active(true).build());
        return RegisterResponse.builder().id(hospitalUser.getId())
                .fullName(hospitalUser.getFullName()).email(hospitalUser.getEmail())
                .phone(hospitalUser.getPhone()).role(hospitalUser.getRole())
                .active(hospitalUser.getActive()).build();
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BadCredentialsException(
                                "Invalid email or password"
                        )
                );

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new BadCredentialsException(
                    "Invalid email or password"
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash())) {

            throw new BadCredentialsException(
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(user);

        return LoginResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationMillis())
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    private DonorProfile.BloodGroup parseBloodGroup(String value) {

        return switch (value.trim().toUpperCase()) {
            case "A+" -> DonorProfile.BloodGroup.A_POSITIVE;
            case "A-" -> DonorProfile.BloodGroup.A_NEGATIVE;
            case "B+" -> DonorProfile.BloodGroup.B_POSITIVE;
            case "B-" -> DonorProfile.BloodGroup.B_NEGATIVE;
            case "AB+" -> DonorProfile.BloodGroup.AB_POSITIVE;
            case "AB-" -> DonorProfile.BloodGroup.AB_NEGATIVE;
            case "O+" -> DonorProfile.BloodGroup.O_POSITIVE;
            case "O-" -> DonorProfile.BloodGroup.O_NEGATIVE;
            default -> throw new IllegalArgumentException(
                    "Invalid blood group. Allowed values: A+, A-, B+, B-, AB+, AB-, O+, O-"
            );
        };
    }

    private DonorProfile.Gender parseGender(String value) {

        try {
            return DonorProfile.Gender.valueOf(
                    value.trim().toUpperCase()
            );
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                    "Invalid gender. Allowed values: MALE, FEMALE, OTHER"
            );
        }
    }
}
