package com.bloodbridge.dto.matching;

import com.bloodbridge.entity.BloodRequestMatch;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BloodRequestMatchResponse {

    private Long matchId;

    private Long bloodRequestId;

    private Long donorProfileId;

    private Long donorUserId;

    private String donorName;

    private String bloodGroup;

    private String donorGender;

    private String donorAddress;

    private Boolean donorAvailable;

    private String verificationStatus;

    private BloodRequestMatch.MatchStatus status;

    private LocalDateTime matchedAt;

    private LocalDateTime respondedAt;
}