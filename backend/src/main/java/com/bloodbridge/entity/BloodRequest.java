package com.bloodbridge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "blood_requests",
        indexes = {
                @Index(
                        name = "idx_blood_requests_patient",
                        columnList = "patient_user_id"
                ),
                @Index(
                        name = "idx_blood_requests_blood_group",
                        columnList = "blood_group"
                ),
                @Index(
                        name = "idx_blood_requests_status",
                        columnList = "status"
                ),
                @Index(
                        name = "idx_blood_requests_urgency",
                        columnList = "urgency"
                ),
                @Index(
                        name = "idx_blood_requests_required_date",
                        columnList = "required_date"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "patient_user_id",
            nullable = false
    )
    private User patient;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "blood_group",
            nullable = false,
            length = 20
    )
    private BloodGroup bloodGroup;

    @Column(
            name = "units_required",
            nullable = false
    )
    private Integer unitsRequired;

    @Column(
            name = "hospital_name",
            nullable = false,
            length = 200
    )
    private String hospitalName;

    @Column(
            name = "hospital_address",
            nullable = false,
            length = 500
    )
    private String hospitalAddress;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "urgency",
            nullable = false,
            length = 20
    )
    private Urgency urgency = Urgency.NORMAL;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "status",
            nullable = false,
            length = 30
    )
    private Status status = Status.OPEN;

    @Column(
            name = "required_date",
            nullable = false
    )
    private LocalDate requiredDate;

    @Column(
            name = "additional_notes",
            length = 1000
    )
    private String additionalNotes;

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

        if (urgency == null) {
            urgency = Urgency.NORMAL;
        }

        if (status == null) {
            status = Status.OPEN;
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

    public enum Urgency {
        NORMAL,
        URGENT,
        CRITICAL
    }

    public enum Status {
        OPEN,
        MATCHED,
        FULFILLED,
        CANCELLED
    }
}