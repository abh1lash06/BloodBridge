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

    /*
     * Blood group is intentionally nullable because the donor profile
     * is automatically created during registration.
     *
     * IMPORTANT:
     * Once blood group is set, it cannot be changed.
     */
    @Enumerated(EnumType.STRING)
    @Column(
            name = "blood_group",
            length = 20
    )
    @Setter(AccessLevel.NONE)
    private BloodGroup bloodGroup;

    @Column(
            name = "date_of_birth"
    )
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "gender",
            length = 20
    )
    private Gender gender;

    @Column(
            name = "address",
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
    private VerificationStatus verificationStatus =
            VerificationStatus.PENDING;

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

    /*
     * Blood group can be assigned once.
     *
     * If already assigned, attempting to change it is rejected.
     */
    public void setBloodGroup(BloodGroup bloodGroup) {

        if (this.bloodGroup != null &&
                bloodGroup != this.bloodGroup) {

            throw new IllegalArgumentException(
                    "Blood group cannot be changed once it has been set"
            );
        }

        this.bloodGroup = bloodGroup;
    }

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
            verificationStatus =
                    VerificationStatus.PENDING;
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