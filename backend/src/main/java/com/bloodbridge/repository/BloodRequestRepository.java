package com.bloodbridge.repository;

import com.bloodbridge.entity.BloodRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodRequestRepository
        extends JpaRepository<BloodRequest, Long> {

    Page<BloodRequest> findByPatientIdOrderByCreatedAtDesc(
            Long patientId,
            Pageable pageable
    );

    Page<BloodRequest> findByStatusAndBloodGroup(
            BloodRequest.Status status,
            BloodRequest.BloodGroup bloodGroup,
            Pageable pageable
    );
}