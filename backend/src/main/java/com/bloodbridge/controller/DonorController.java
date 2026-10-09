package com.bloodbridge.controller;

import com.bloodbridge.dto.donor.CreateDonorProfileRequest;
import com.bloodbridge.dto.donor.DonorProfileResponse;
import com.bloodbridge.dto.donor.DonorSearchResponse;
import com.bloodbridge.dto.donor.UpdateAvailabilityRequest;
import com.bloodbridge.service.DonorService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @PostMapping("/profile")
    public ResponseEntity<DonorProfileResponse> createProfile(
            Authentication authentication,
            @Valid @RequestBody CreateDonorProfileRequest request) {

        DonorProfileResponse response =
                donorService.createProfile(
                        authentication.getName(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<DonorProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody CreateDonorProfileRequest request) {
        return ResponseEntity.ok(donorService.updateProfile(authentication.getName(), request));
    }

    @GetMapping("/profile")
    public ResponseEntity<DonorProfileResponse> getMyProfile(
            Authentication authentication) {

        DonorProfileResponse response =
                donorService.getMyProfile(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/profile/availability")
    public ResponseEntity<DonorProfileResponse> updateAvailability(
            Authentication authentication,
            @Valid @RequestBody UpdateAvailabilityRequest request) {

        DonorProfileResponse response =
                donorService.updateAvailability(
                        authentication.getName(),
                        request.getAvailable()
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<DonorSearchResponse>> searchDonors(
            @RequestParam String bloodGroup,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

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

        Pageable pageable = PageRequest.of(page, size);

        Page<DonorSearchResponse> response =
                donorService.searchDonors(
                        bloodGroup,
                        pageable
                );

        return ResponseEntity.ok(response);
    }
}