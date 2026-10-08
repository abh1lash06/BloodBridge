package com.bloodbridge.dto.hospital;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class HospitalBloodInventoryResponse {

    private Long id;

    private Long hospitalProfileId;

    private String hospitalName;

    private String bloodGroup;

    private Integer availableUnits;

    private Integer reservedUnits;

    private Integer totalUnits;

    private LocalDateTime updatedAt;
}