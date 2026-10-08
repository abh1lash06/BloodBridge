package com.bloodbridge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "hospital_profiles",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_hospital_profiles_user",
                        columnNames = "user_id"
                ),
                @UniqueConstraint(
                        name = "uk_hospital_registration",
                        columnNames = "registration_number"
                )
        },
        indexes = {
                @Index(
                        name = "idx_hospital_profiles_city",
                        columnList = "city"
                ),
                @Index(
                        name = "idx_hospital_profiles_state",
                        columnList = "state"
                ),
                @Index(
                        name = "idx_hospital_profiles_verified",
                        columnList = "verified"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Column(
            name = "hospital_name",
            nullable = false,
            length = 200
    )
    private String hospitalName;

    @Column(
            name = "registration_number",
            nullable = false,
            length = 100,
            unique = true
    )
    private String registrationNumber;

    @Column(
            name = "address",
            nullable = false,
            length = 500
    )
    private String address;

    @Column(
            name = "city",
            nullable = false,
            length = 100
    )
    private String city;

    @Column(
            name = "state",
            nullable = false,
            length = 100
    )
    private String state;

    @Column(
            name = "phone",
            nullable = false,
            length = 20
    )
    private String phone;

    @Column(
            name = "verified",
            nullable = false
    )
    private Boolean verified = false;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }

        if (verified == null) {
            verified = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}