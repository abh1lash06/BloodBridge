package com.bloodbridge.dto.hospital;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HospitalProfileResponse {

    private Long id;

    private Long userId;

    private String email;

    private String hospitalName;

    private String registrationNumber;

    private String address;

    private String city;

    private String state;

    private String phone;

    private Boolean verified;
}