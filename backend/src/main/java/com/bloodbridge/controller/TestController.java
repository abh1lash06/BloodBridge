package com.bloodbridge.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TestController {

    @GetMapping("/api/test/patient/profile")
    public Map<String, Object> patient(Authentication authentication) {
        return Map.of(
                "message", "Patient endpoint accessed successfully",
                "username", authentication.getName(),
                "role", "PATIENT"
        );
    }

    @GetMapping("/api/test/donor/profile")
    public Map<String, Object> donor(Authentication authentication) {
        return Map.of(
                "message", "Donor endpoint accessed successfully",
                "username", authentication.getName(),
                "role", "DONOR"
        );
    }

    @GetMapping("/api/test/hospital/profile")
    public Map<String, Object> hospital(Authentication authentication) {
        return Map.of(
                "message", "Hospital endpoint accessed successfully",
                "username", authentication.getName(),
                "role", "HOSPITAL"
        );
    }

    @GetMapping("/api/test/admin/profile")
    public Map<String, Object> admin(Authentication authentication) {
        return Map.of(
                "message", "Admin endpoint accessed successfully",
                "username", authentication.getName(),
                "role", "ADMIN"
        );
    }
}