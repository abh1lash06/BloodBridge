package com.bloodbridge.controller;

import com.bloodbridge.dto.hospital.HospitalProfileResponse;
import com.bloodbridge.service.HospitalService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/hospitals")
public class HospitalAdminController {

    private final HospitalService hospitalService;

    public HospitalAdminController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    /**
     * Verify a hospital.
     *
     * Only users with ADMIN role can reach /api/admin/**.
     */
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