package com.bloodbridge.dto.hospital;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReserveBloodRequestRequest {

    @NotNull(message = "Units to reserve are required")
    @Min(
            value = 1,
            message = "At least 1 unit must be reserved"
    )
    private Integer units;
}