package com.bloodbridge.repository;

import com.bloodbridge.entity.HospitalProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HospitalProfileRepository
        extends JpaRepository<HospitalProfile, Long> {

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