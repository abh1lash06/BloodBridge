package com.bloodbridge.dto.bloodrequest;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateBloodRequestRequest {

    @NotBlank(message = "Blood group is required")
    private String bloodGroup;

    @NotNull(message = "Units required is required")
    @Min(value = 1, message = "At least 1 unit is required")
    @Max(value = 20, message = "Units required must not exceed 20")
    private Integer unitsRequired;

    @NotBlank(message = "Hospital name is required")
    @Size(
            max = 200,
            message = "Hospital name must not exceed 200 characters"
    )
    private String hospitalName;

    @NotBlank(message = "Hospital address is required")
    @Size(
            max = 500,
            message = "Hospital address must not exceed 500 characters"
    )
    private String hospitalAddress;

    @NotBlank(message = "Urgency is required")
    private String urgency;

    @NotNull(message = "Required date is required")
    @FutureOrPresent(message = "Required date cannot be in the past")
    private LocalDate requiredDate;

    @Size(
            max = 1000,
            message = "Additional notes must not exceed 1000 characters"
    )
    private String additionalNotes;
}