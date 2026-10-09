package com.bloodbridge.dto.auth;

import com.bloodbridge.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    @Size(
            min = 2,
            max = 100,
            message = "Full name must be between 2 and 100 characters"
    )
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    @Size(
            max = 255,
            message = "Email must not exceed 255 characters"
    )
    private String email;

    @NotBlank(message = "Password is required")
    @Size(
            min = 8,
            max = 72,
            message = "Password must be between 8 and 72 characters"
    )
    private String password;

    @Size(
            max = 20,
            message = "Phone must not exceed 20 characters"
    )
    private String phone;

    @NotNull(message = "Role is required")
    private User.Role role;
    // Extra details for donor registrations.
    private String bloodGroup;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    private String gender;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;
}
