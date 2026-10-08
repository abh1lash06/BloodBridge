package com.bloodbridge.dto.donor;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAvailabilityRequest {

    @NotNull(message = "Availability is required")
    private Boolean available;
}