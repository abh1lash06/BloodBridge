package com.bloodbridge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "hospital_blood_inventory",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_hospital_inventory_group",
                        columnNames = {
                                "hospital_profile_id",
                                "blood_group"
                        }
                )
        },
        indexes = {
                @Index(
                        name = "idx_inventory_blood_group",
                        columnList = "blood_group"
                ),
                @Index(
                        name = "idx_inventory_hospital",
                        columnList = "hospital_profile_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalBloodInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
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
            name = "available_units",
            nullable = false
    )
    private Integer availableUnits = 0;

    @Column(
            name = "reserved_units",
            nullable = false
    )
    private Integer reservedUnits = 0;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {

        if (availableUnits == null) {
            availableUnits = 0;
        }

        if (reservedUnits == null) {
            reservedUnits = 0;
        }

        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
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
}