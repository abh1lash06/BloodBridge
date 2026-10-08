package com.bloodbridge.repository;

import com.bloodbridge.entity.DonorVerificationAudit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonorVerificationAuditRepository
        extends JpaRepository<DonorVerificationAudit, Long> {

    List<DonorVerificationAudit> findByDonorProfileIdOrderByCreatedAtDesc(
            Long donorProfileId
    );
}