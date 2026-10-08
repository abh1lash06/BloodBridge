package com.bloodbridge.dto.hospital;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateHospitalProfileRequest {

    @NotBlank(message = "Hospital name is required")
    @Size(
            max = 200,
            message = "Hospital name must not exceed 200 characters"
    )
    private String hospitalName;

    @NotBlank(message = "Registration number is required")
    @Size(
            max = 100,
            message = "Registration number must not exceed 100 characters"
    )
    private String registrationNumber;

    @NotBlank(message = "Address is required")
    @Size(
            max = 500,
            message = "Address must not exceed 500 characters"
    )
    private String address;

    @NotBlank(message = "City is required")
    @Size(
            max = 100,
            message = "City must not exceed 100 characters"
    )
    private String city;

    @NotBlank(message = "State is required")
    @Size(
            max = 100,
            message = "State must not exceed 100 characters"
    )
    private String state;

    @NotBlank(message = "Phone is required")
    @Size(
            max = 20,
            message = "Phone must not exceed 20 characters"
    )
    private String phone;
}