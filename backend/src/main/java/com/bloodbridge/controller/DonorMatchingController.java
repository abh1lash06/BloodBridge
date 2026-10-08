package com.bloodbridge.controller;

import com.bloodbridge.dto.matching.BloodRequestMatchResponse;
import com.bloodbridge.dto.matching.DonorMatchResponse;
import com.bloodbridge.service.DonorMatchingService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blood-requests")
public class DonorMatchingController {

    private final DonorMatchingService donorMatchingService;

    public DonorMatchingController(
            DonorMatchingService donorMatchingService) {

        this.donorMatchingService = donorMatchingService;
    }

    @GetMapping("/{requestId}/matches/persisted")
    public ResponseEntity<Page<BloodRequestMatchResponse>> getMyMatches(
            Authentication authentication,
            @PathVariable Long requestId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        validatePagination(page, size);

        Page<BloodRequestMatchResponse> response =
                donorMatchingService.getMyMatches(
                        authentication.getName(),
                        requestId,
                        page,
                        size
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{requestId}/matches")
    public ResponseEntity<Page<DonorMatchResponse>> findMatchingDonors(
            Authentication authentication,
            @PathVariable Long requestId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        validatePagination(page, size);

        Page<DonorMatchResponse> response =
                donorMatchingService.findMatchingDonors(
                        authentication.getName(),
                        requestId,
                        page,
                        size
                );

        return ResponseEntity.ok(response);
    }

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