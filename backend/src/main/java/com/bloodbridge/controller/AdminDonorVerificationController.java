package com.bloodbridge.controller;

import com.bloodbridge.dto.admin.DonorVerificationRequest;
import com.bloodbridge.dto.donor.DonorSearchResponse;
import org.springframework.data.domain.Page;
import com.bloodbridge.service.AdminDonorVerificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/donors")
public class AdminDonorVerificationController {

    private final AdminDonorVerificationService
            adminDonorVerificationService;

    public AdminDonorVerificationController(
            AdminDonorVerificationService adminDonorVerificationService) {

        this.adminDonorVerificationService =
                adminDonorVerificationService;
    }

    @GetMapping("/pending")
    public Page<DonorSearchResponse> pendingDonors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        if (page < 0 || size < 1 || size > 50) throw new IllegalArgumentException("Invalid pagination");
        return adminDonorVerificationService.listPendingDonors(page, size);
    }

    @PatchMapping("/{donorProfileId}/verify")
    public ResponseEntity<Void> verifyDonor(
            @PathVariable Long donorProfileId,
            Authentication authentication,
            @Valid @RequestBody DonorVerificationRequest request) {

        adminDonorVerificationService.verifyDonor(
                donorProfileId,
                authentication.getName(),
                request.getReason()
        );

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{donorProfileId}/reject")
    public ResponseEntity<Void> rejectDonor(
            @PathVariable Long donorProfileId,
            Authentication authentication,
            @Valid @RequestBody DonorVerificationRequest request) {

        adminDonorVerificationService.rejectDonor(
                donorProfileId,
                authentication.getName(),
                request.getReason()
        );

        return ResponseEntity.noContent().build();
    }
}