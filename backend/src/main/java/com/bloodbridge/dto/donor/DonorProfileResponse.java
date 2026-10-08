package com.bloodbridge.dto.donor;

import com.bloodbridge.entity.DonorProfile;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class DonorProfileResponse {

    private Long id;

    private Long userId;

    private String fullName;

    private String email;

    private String bloodGroup;

    private LocalDate dateOfBirth;

    private String gender;

    private String address;

    private Boolean available;

    private LocalDate lastDonationDate;

    private DonorProfile.VerificationStatus verificationStatus;
}