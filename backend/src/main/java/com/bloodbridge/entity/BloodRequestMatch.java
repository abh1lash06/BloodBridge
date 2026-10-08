package com.bloodbridge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "blood_request_matches",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_blood_request_donor_match",
                        columnNames = {
                                "blood_request_id",
                                "donor_profile_id"
                        }
                )
        },
        indexes = {
                @Index(
                        name = "idx_matches_blood_request",
                        columnList = "blood_request_id"
                ),
                @Index(
                        name = "idx_matches_donor",
                        columnList = "donor_profile_id"
                ),
                @Index(
                        name = "idx_matches_status",
                        columnList = "status"
                ),
                @Index(
                        name = "idx_matches_matched_at",
                        columnList = "matched_at"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodRequestMatch {

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
            name = "donor_profile_id",
            nullable = false
    )
    private DonorProfile donorProfile;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            nullable = false,
            length = 30
    )
    private MatchStatus status = MatchStatus.PENDING;

    @Column(
            name = "matched_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime matchedAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @PrePersist
    protected void onCreate() {

        if (matchedAt == null) {
            matchedAt = LocalDateTime.now();
        }

        if (status == null) {
            status = MatchStatus.PENDING;
        }
    }

    public enum MatchStatus {
        PENDING,
        ACCEPTED,
        REJECTED,
        CANCELLED
    }
}