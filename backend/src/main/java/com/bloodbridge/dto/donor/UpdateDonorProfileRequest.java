
package com.bloodbridge.dto.donor;

import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateDonorProfileRequest {

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Address is required")
    @Size(
            max = 500,
            message = "Address must not exceed 500 characters"
    )
    private String address;

    /**
     * Reject attempts to submit bloodGroup in a profile update.
     * Blood group is fixed at registration.
     */
    @JsonSetter("bloodGroup")
    public void rejectBloodGroupChange(String bloodGroup) {
        throw new IllegalArgumentException(
                "Blood group cannot be changed once registered"
        );
    }
}
