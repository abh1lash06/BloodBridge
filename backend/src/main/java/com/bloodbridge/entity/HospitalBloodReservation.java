package com.bloodbridge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "hospital_blood_reservations",
        indexes = {
                @Index(
                        name = "idx_reservation_request",
                        columnList = "blood_request_id"
                ),
                @Index(
                        name = "idx_reservation_hospital",
                        columnList = "hospital_profile_id"
                ),
                @Index(
                        name = "idx_reservation_status",
                        columnList = "status"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalBloodReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "blood_request_id",
            nullable = false
    )
    private BloodRequest bloodRequest;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "hospital_profile_id",
            nullable = false
    )
    private HospitalProfile hospitalProfile;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "blood_group",
            nullable = false,
            length = 20
    )
    private BloodGroup bloodGroup;

    @Column(
            name = "units_reserved",
            nullable = false
    )
    private Integer unitsReserved;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            nullable = false,
            length = 30
    )
    private ReservationStatus status =
            ReservationStatus.RESERVED;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    @PrePersist
    protected void onCreate() {

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (status == null) {
            status = ReservationStatus.RESERVED;
        }
    }

    public enum BloodGroup {

        A_POSITIVE,
        A_NEGATIVE,

        B_POSITIVE,
        B_NEGATIVE,

        AB_POSITIVE,
        AB_NEGATIVE,

        O_POSITIVE,
        O_NEGATIVE
    }

    public enum ReservationStatus {

        RESERVED,
        RELEASED,
        FULFILLED,
        CANCELLED
    }
}