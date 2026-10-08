package com.bloodbridge.dto.hospital;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateBloodInventoryRequest {

    @NotBlank(message = "Blood group is required")
    private String bloodGroup;

    @Min(
            value = 0,
            message = "Available units cannot be negative"
    )
    private int availableUnits;
}