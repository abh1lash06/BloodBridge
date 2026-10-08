package com.bloodbridge.dto.auth;

import com.bloodbridge.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private String accessToken;
    private String tokenType;
    private long expiresIn;

    private Long id;
    private String fullName;
    private String email;
    private User.Role role;
}