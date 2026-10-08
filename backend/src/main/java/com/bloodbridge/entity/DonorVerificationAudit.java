package com.bloodbridge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "donor_verification_audits",
        indexes = {
                @Index(
                        name = "idx_verification_audit_donor",
                        columnList = "donor_profile_id"
                ),
                @Index(
                        name = "idx_verification_audit_admin",
                        columnList = "admin_user_id"
                ),
                @Index(
                        name = "idx_verification_audit_created",
                        columnList = "created_at"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonorVerificationAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "donor_profile_id",
            nullable = false
    )
    private DonorProfile donorProfile;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "admin_user_id",
            nullable = false
    )
    private User adminUser;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "previous_status",
            nullable = false,
            length = 30
    )
    private DonorProfile.VerificationStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "new_status",
            nullable = false,
            length = 30
    )
    private DonorProfile.VerificationStatus newStatus;

    @Column(
            name = "reason",
            length = 500
    )
    private String reason;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}