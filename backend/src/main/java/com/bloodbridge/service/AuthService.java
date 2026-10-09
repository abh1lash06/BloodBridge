package com.bloodbridge.service;

import com.bloodbridge.dto.auth.LoginRequest;
import com.bloodbridge.dto.auth.LoginResponse;
import com.bloodbridge.dto.auth.RegisterRequest;
import com.bloodbridge.dto.auth.RegisterResponse;
import com.bloodbridge.entity.User;
import com.bloodbridge.entity.DonorProfile;
import com.bloodbridge.repository.UserRepository;
import com.bloodbridge.repository.DonorProfileRepository;
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

        DonorProfile.BloodGroup bloodGroup = null;
        DonorProfile.Gender gender = null;
        if (requestedRole == User.Role.DONOR) {
            if (request.getBloodGroup() == null || request.getBloodGroup().isBlank()) {
                throw new IllegalArgumentException("Blood group is required");
            }
            if (request.getDateOfBirth() == null || !request.getDateOfBirth().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Valid date of birth is required");
            }
            if (request.getGender() == null || request.getGender().isBlank()) {
                throw new IllegalArgumentException("Gender is required");
            }
            if (request.getAddress() == null || request.getAddress().trim().length() < 3) {
                throw new IllegalArgumentException("Address is required (at least 3 characters)");
            }
            try {
                bloodGroup = switch (request.getBloodGroup().trim().toUpperCase()) {
                    case "A+" -> DonorProfile.BloodGroup.A_POSITIVE;
                    case "A-" -> DonorProfile.BloodGroup.A_NEGATIVE;
                    case "B+" -> DonorProfile.BloodGroup.B_POSITIVE;
                    case "B-" -> DonorProfile.BloodGroup.B_NEGATIVE;
                    case "AB+" -> DonorProfile.BloodGroup.AB_POSITIVE;
                    case "AB-" -> DonorProfile.BloodGroup.AB_NEGATIVE;
                    case "O+" -> DonorProfile.BloodGroup.O_POSITIVE;
                    case "O-" -> DonorProfile.BloodGroup.O_NEGATIVE;
                    default -> throw new IllegalArgumentException("Invalid blood group");
                };
                gender = DonorProfile.Gender.valueOf(request.getGender().trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new IllegalArgumentException("Invalid donor blood group or gender");
            }
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
        if (requestedRole == User.Role.DONOR) {
            donorProfileRepository.save(DonorProfile.builder()
                    .user(savedUser)
                    .bloodGroup(bloodGroup)
                    .dateOfBirth(request.getDateOfBirth())
                    .gender(gender)
                    .address(request.getAddress().trim())
                    .available(true)
                    .verificationStatus(DonorProfile.VerificationStatus.PENDING)
                    .build());
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

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BadCredentialsException(
                                "Invalid email or password"
                        ));

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
}