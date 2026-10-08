package com.bloodbridge.controller;

import com.bloodbridge.dto.bloodrequest.BloodRequestResponse;
import com.bloodbridge.dto.bloodrequest.CreateBloodRequestRequest;
import com.bloodbridge.service.BloodRequestService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blood-requests")
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;

    public BloodRequestController(
            BloodRequestService bloodRequestService) {

        this.bloodRequestService =
                bloodRequestService;
    }

    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping
    public ResponseEntity<BloodRequestResponse> createRequest(
            Authentication authentication,
            @Valid @RequestBody CreateBloodRequestRequest request) {

        BloodRequestResponse response =
                bloodRequestService.createRequest(
                        authentication.getName(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================================================
    // GET MY REQUESTS
    // =========================================================

    @GetMapping("/my")
    public ResponseEntity<Page<BloodRequestResponse>> getMyRequests(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        validatePagination(page, size);

        Page<BloodRequestResponse> response =
                bloodRequestService.getMyRequests(
                        authentication.getName(),
                        page,
                        size
                );

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET SINGLE REQUEST
    // =========================================================

    @GetMapping("/{requestId}")
    public ResponseEntity<BloodRequestResponse> getMyRequest(
            Authentication authentication,
            @PathVariable Long requestId) {

        BloodRequestResponse response =
                bloodRequestService.getMyRequest(
                        authentication.getName(),
                        requestId
                );

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // CANCEL
    // =========================================================

    @PatchMapping("/{requestId}/cancel")
    public ResponseEntity<Void> cancelRequest(
            Authentication authentication,
            @PathVariable Long requestId) {

        bloodRequestService.cancelRequest(
                authentication.getName(),
                requestId
        );

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // FULFILL
    // =========================================================

    @PatchMapping("/{requestId}/fulfill")
    public ResponseEntity<Void> fulfillRequest(
            Authentication authentication,
            @PathVariable Long requestId) {

        bloodRequestService.fulfillRequest(
                authentication.getName(),
                requestId
        );

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // PAGINATION VALIDATION
    // =========================================================

    private void validatePagination(
            int page,
            int size) {

        if (page < 0) {

            throw new IllegalArgumentException(
                    "Page must be greater than or equal to 0"
            );
        }

        if (size < 1 || size > 50) {

            throw new IllegalArgumentException(
                    "Size must be between 1 and 50"
            );
        }
    }
}