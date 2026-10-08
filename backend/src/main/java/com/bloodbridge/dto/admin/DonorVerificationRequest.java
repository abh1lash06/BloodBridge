package com.bloodbridge.dto.admin;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonorVerificationRequest {

    @Size(
            max = 500,
            message = "Reason must not exceed 500 characters"
    )
    private String reason;
}