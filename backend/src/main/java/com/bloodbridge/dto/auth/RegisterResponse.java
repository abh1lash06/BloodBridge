package com.bloodbridge.dto.auth;

import com.bloodbridge.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RegisterResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private User.Role role;
    private Boolean active;
}