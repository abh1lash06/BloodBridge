package com.bloodbridge.repository;

import com.bloodbridge.entity.BloodRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodRequestRepository
        extends JpaRepository<BloodRequest, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select r from BloodRequest r where r.id = :id")
    Optional<BloodRequest> findForUpdate(@org.springframework.data.repository.query.Param("id") Long id);

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