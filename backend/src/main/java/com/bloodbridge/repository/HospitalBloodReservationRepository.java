package com.bloodbridge.repository;

import com.bloodbridge.entity.HospitalBloodReservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HospitalBloodReservationRepository
        extends JpaRepository<HospitalBloodReservation, Long> {

    List<HospitalBloodReservation> findByHospitalProfileIdOrderByCreatedAtDesc(
            Long hospitalProfileId
    );

    List<HospitalBloodReservation> findByBloodRequestIdOrderByCreatedAtDesc(
            Long bloodRequestId
    );

    Optional<HospitalBloodReservation>
    findByBloodRequestIdAndHospitalProfileIdAndStatus(
            Long bloodRequestId,
            Long hospitalProfileId,
            HospitalBloodReservation.ReservationStatus status
    );

    boolean existsByBloodRequestIdAndStatus(
            Long bloodRequestId,
            HospitalBloodReservation.ReservationStatus status
    );
}