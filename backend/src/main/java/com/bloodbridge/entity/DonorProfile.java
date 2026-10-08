package com.bloodbridge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "donor_profiles",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_donor_profiles_user",
                        columnNames = "user_id"
                )
        },
        indexes = {
                @Index(
                        name = "idx_donor_blood_group",
                        columnList = "blood_group"
                ),
                @Index(
                        name = "idx_donor_available",
                        columnList = "available"
                ),
                @Index(
                        name = "idx_donor_verification",
                        columnList = "verification_status"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonorProfile {

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

    @Enumerated(EnumType.STRING)
    @Column(
            name = "blood_group",
            nullable = false,
            length = 20
    )
    private BloodGroup bloodGroup;

    @Column(
            name = "date_of_birth",
            nullable = false
    )
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "gender",
            nullable = false,
            length = 20
    )
    private Gender gender;

    @Column(
            name = "address",
            nullable = false,
            length = 500
    )
    private String address;

    @Column(
            name = "available",
            nullable = false
    )
    private Boolean available = true;

    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "verification_status",
            nullable = false,
            length = 30
    )
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

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

        if (available == null) {
            available = true;
        }

        if (verificationStatus == null) {
            verificationStatus = VerificationStatus.PENDING;
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

    public enum Gender {
        MALE,
        FEMALE,
        OTHER
    }

    public enum VerificationStatus {
        PENDING,
        VERIFIED,
        REJECTED
    }
}