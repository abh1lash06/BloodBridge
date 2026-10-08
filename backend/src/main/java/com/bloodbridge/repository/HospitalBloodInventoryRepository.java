package com.bloodbridge.repository;

import com.bloodbridge.entity.HospitalBloodInventory;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HospitalBloodInventoryRepository
        extends JpaRepository<HospitalBloodInventory, Long> {

    List<HospitalBloodInventory>
    findByHospitalProfileIdOrderByBloodGroupAsc(
            Long hospitalProfileId
    );

    Optional<HospitalBloodInventory>
    findByHospitalProfileIdAndBloodGroup(
            Long hospitalProfileId,
            HospitalBloodInventory.BloodGroup bloodGroup
    );

    boolean existsByHospitalProfileIdAndBloodGroup(
            Long hospitalProfileId,
            HospitalBloodInventory.BloodGroup bloodGroup
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT inventory
            FROM HospitalBloodInventory inventory
            WHERE inventory.hospitalProfile.id = :hospitalProfileId
              AND inventory.bloodGroup = :bloodGroup
            """)
    Optional<HospitalBloodInventory> findForUpdate(
            @Param("hospitalProfileId") Long hospitalProfileId,
            @Param("bloodGroup") HospitalBloodInventory.BloodGroup bloodGroup
    );
}