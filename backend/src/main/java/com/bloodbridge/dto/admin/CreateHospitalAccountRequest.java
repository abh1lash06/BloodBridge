package com.bloodbridge.dto.admin;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateHospitalAccountRequest {
    @NotBlank @Size(min = 2, max = 100)
    private String fullName;
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 8, max = 72)
    private String password;
    @Size(max = 20)
    private String phone;
}
