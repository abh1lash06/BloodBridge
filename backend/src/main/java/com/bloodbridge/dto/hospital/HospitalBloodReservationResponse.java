package com.bloodbridge.dto.hospital;

import com.bloodbridge.entity.HospitalBloodReservation;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class HospitalBloodReservationResponse {

    private Long id;

    private Long bloodRequestId;

    private Long hospitalProfileId;

    private String hospitalName;

    private String bloodGroup;

    private Integer unitsReserved;

    private HospitalBloodReservation.ReservationStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime releasedAt;
}