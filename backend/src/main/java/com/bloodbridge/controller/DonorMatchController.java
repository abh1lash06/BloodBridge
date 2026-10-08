package com.bloodbridge.controller;

import com.bloodbridge.dto.matching.DonorMatchInboxResponse;
import com.bloodbridge.service.DonorMatchingService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donor/matches")
public class DonorMatchController {

    private final DonorMatchingService donorMatchingService;

    public DonorMatchController(
            DonorMatchingService donorMatchingService) {

        this.donorMatchingService = donorMatchingService;
    }

    @GetMapping
    public ResponseEntity<Page<DonorMatchInboxResponse>> getMyMatches(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        validatePagination(page, size);

        Page<DonorMatchInboxResponse> response =
                donorMatchingService.getDonorMatches(
                        authentication.getName(),
                        page,
                        size
                );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{matchId}/accept")
    public ResponseEntity<Void> acceptMatch(
            Authentication authentication,
            @PathVariable Long matchId) {

        donorMatchingService.acceptMatch(
                authentication.getName(),
                matchId
        );

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{matchId}/reject")
    public ResponseEntity<Void> rejectMatch(
            Authentication authentication,
            @PathVariable Long matchId) {

        donorMatchingService.rejectMatch(
                authentication.getName(),
                matchId
        );

        return ResponseEntity.noContent().build();
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