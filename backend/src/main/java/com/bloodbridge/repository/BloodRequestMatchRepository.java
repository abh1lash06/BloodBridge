package com.bloodbridge.repository;

import com.bloodbridge.entity.BloodRequest;
import com.bloodbridge.entity.BloodRequestMatch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodRequestMatchRepository
        extends JpaRepository<BloodRequestMatch, Long> {

    Page<BloodRequestMatch> findByBloodRequestId(
            Long bloodRequestId,
            Pageable pageable
    );

    Page<BloodRequestMatch> findByDonorProfileId(
            Long donorProfileId,
            Pageable pageable
    );

    boolean existsByBloodRequestIdAndDonorProfileId(
            Long bloodRequestId,
            Long donorProfileId
    );

    Page<BloodRequestMatch> findByDonorProfileIdOrderByMatchedAtDesc(
            Long donorProfileId,
            Pageable pageable
    );

    List<BloodRequestMatch> findByBloodRequestIdAndStatus(
            Long bloodRequestId,
            BloodRequestMatch.MatchStatus status
    );
}