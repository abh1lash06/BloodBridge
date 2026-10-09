package com.bloodbridge.controller;

import com.bloodbridge.dto.admin.CreateHospitalAccountRequest;
import com.bloodbridge.dto.auth.RegisterResponse;
import com.bloodbridge.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import com.bloodbridge.dto.hospital.HospitalProfileResponse;
import com.bloodbridge.service.HospitalService;

import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/hospitals")
public class HospitalAdminController {

    private final HospitalService hospitalService;
    private final AuthService authService;

    public HospitalAdminController(HospitalService hospitalService, AuthService authService) {
        this.hospitalService = hospitalService;
        this.authService = authService;
    }

    /**
     * Verify a hospital.
     *
     * Only users with ADMIN role can reach /api/admin/**.
     */
    @PostMapping("/accounts")
    public ResponseEntity<RegisterResponse> createHospitalAccount(
            Authentication authentication,
            @Valid @RequestBody CreateHospitalAccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                authService.createHospitalAccount(authentication.getName(), request));
    }

    @GetMapping("/pending")
    public Page<HospitalProfileResponse> pendingHospitals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        if (page < 0 || size < 1 || size > 50) throw new IllegalArgumentException("Invalid pagination");
        return hospitalService.listUnverifiedHospitals(page, size);
    }

    @PatchMapping("/{hospitalProfileId}/verify")
    public ResponseEntity<HospitalProfileResponse> verifyHospital(
            Authentication authentication,
            @PathVariable Long hospitalProfileId
    ) {

        return ResponseEntity.ok(
                hospitalService.verifyHospital(
                        authentication.getName(),
                        hospitalProfileId
                )
        );
    }

    /**
     * Reject / unverify a hospital.
     */
    @PatchMapping("/{hospitalProfileId}/unverify")
    public ResponseEntity<HospitalProfileResponse> unverifyHospital(
            Authentication authentication,
            @PathVariable Long hospitalProfileId
    ) {

        return ResponseEntity.ok(
                hospitalService.unverifyHospital(
                        authentication.getName(),
                        hospitalProfileId
                )
        );
    }
}