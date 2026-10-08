package com.bloodbridge.repository;

import com.bloodbridge.entity.DonorProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DonorProfileRepository
        extends JpaRepository<DonorProfile, Long> {

    Optional<DonorProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    Page<DonorProfile> findByBloodGroupAndAvailableTrueAndVerificationStatus(
            DonorProfile.BloodGroup bloodGroup,
            DonorProfile.VerificationStatus verificationStatus,
            Pageable pageable
    );
}