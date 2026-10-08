package com.bloodbridge.dto.bloodrequest;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class BloodRequestResponse {

    private Long id;

    private Long patientUserId;

    private String patientName;

    private String bloodGroup;

    private Integer unitsRequired;

    private String hospitalName;

    private String hospitalAddress;

    private String urgency;

    private String status;

    private LocalDate requiredDate;

    private String additionalNotes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}