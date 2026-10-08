package com.bloodbridge.controller;

import com.bloodbridge.dto.hospital.CreateHospitalProfileRequest;
import com.bloodbridge.dto.hospital.HospitalBloodInventoryResponse;
import com.bloodbridge.dto.hospital.HospitalBloodReservationResponse;
import com.bloodbridge.dto.hospital.HospitalProfileResponse;
import com.bloodbridge.dto.hospital.ReserveBloodRequestRequest;
import com.bloodbridge.dto.hospital.UpdateBloodInventoryRequest;
import com.bloodbridge.service.HospitalService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    // =========================================================
    // HOSPITAL PROFILE
    // =========================================================

    @PostMapping("/profile")
    public ResponseEntity<HospitalProfileResponse> createProfile(
            Authentication authentication,
            @Valid @RequestBody CreateHospitalProfileRequest request
    ) {

        HospitalProfileResponse response =
                hospitalService.createProfile(
                        authentication.getName(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<HospitalProfileResponse> getMyProfile(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                hospitalService.getMyProfile(
                        authentication.getName()
                )
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<HospitalProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody CreateHospitalProfileRequest request
    ) {

        return ResponseEntity.ok(
                hospitalService.updateProfile(
                        authentication.getName(),
                        request
                )
        );
    }

    // =========================================================
    // BLOOD INVENTORY
    // =========================================================

    @GetMapping("/inventory")
    public ResponseEntity<List<HospitalBloodInventoryResponse>> getInventory(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                hospitalService.getInventory(
                        authentication.getName()
                )
        );
    }

    @PutMapping("/inventory")
    public ResponseEntity<HospitalBloodInventoryResponse> updateInventory(
            Authentication authentication,
            @Valid @RequestBody UpdateBloodInventoryRequest request
    ) {

        return ResponseEntity.ok(
                hospitalService.updateInventory(
                        authentication.getName(),
                        request
                )
        );
    }

    @GetMapping("/inventory/{bloodGroup}")
    public ResponseEntity<HospitalBloodInventoryResponse>
    getInventoryForBloodGroup(
            Authentication authentication,
            @PathVariable String bloodGroup
    ) {

        return ResponseEntity.ok(
                hospitalService.getInventoryForBloodGroup(
                        authentication.getName(),
                        bloodGroup
                )
        );
    }

    // =========================================================
    // BLOOD RESERVATION
    // =========================================================

    @PostMapping("/blood-requests/{requestId}/reserve")
    public ResponseEntity<HospitalBloodReservationResponse> reserveBlood(
            Authentication authentication,
            @PathVariable Long requestId,
            @Valid @RequestBody ReserveBloodRequestRequest request
    ) {

        HospitalBloodReservationResponse response =
                hospitalService.reserveBlood(
                        authentication.getName(),
                        requestId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<HospitalBloodReservationResponse>>
    getMyReservations(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                hospitalService.getMyReservations(
                        authentication.getName()
                )
        );
    }

    // =========================================================
    // FULFILL RESERVATION
    // =========================================================

    @PatchMapping("/reservations/{reservationId}/fulfill")
    public ResponseEntity<Void> fulfillReservation(
            Authentication authentication,
            @PathVariable Long reservationId
    ) {

        hospitalService.fulfillReservation(
                authentication.getName(),
                reservationId
        );

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // RELEASE RESERVATION
    // =========================================================

    @PatchMapping("/reservations/{reservationId}/release")
    public ResponseEntity<Void> releaseReservation(
            Authentication authentication,
            @PathVariable Long reservationId
    ) {

        hospitalService.releaseReservation(
                authentication.getName(),
                reservationId
        );

        return ResponseEntity.noContent().build();
    }
}