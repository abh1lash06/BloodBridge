package com.bloodbridge.dto.matching;

import com.bloodbridge.entity.BloodRequestMatch;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class DonorMatchInboxResponse {

    private Long matchId;

    private Long bloodRequestId;

    private String patientName;

    private String bloodGroup;

    private Integer unitsRequired;

    private String hospitalName;

    private String hospitalAddress;

    private String urgency;

    private String requestStatus;

    private LocalDate requiredDate;

    private String additionalNotes;

    private BloodRequestMatch.MatchStatus matchStatus;

    private LocalDateTime matchedAt;

    private LocalDateTime respondedAt;
}