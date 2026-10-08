package com.bloodbridge.dto.donor;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DonorSearchResponse {

    private Long donorProfileId;
    private Long userId;
    private String fullName;
    private String bloodGroup;
    private String gender;
    private String address;
    private Boolean available;
    private String verificationStatus;
}