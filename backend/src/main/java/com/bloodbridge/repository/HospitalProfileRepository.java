package com.bloodbridge.repository;

import com.bloodbridge.entity.HospitalProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface HospitalProfileRepository
        extends JpaRepository<HospitalProfile, Long> {

    Page<HospitalProfile> findByVerifiedFalse(Pageable pageable);

    Optional<HospitalProfile> findByUserId(
            Long userId
    );

    boolean existsByUserId(
            Long userId
    );

    boolean existsByRegistrationNumber(
            String registrationNumber
    );
}