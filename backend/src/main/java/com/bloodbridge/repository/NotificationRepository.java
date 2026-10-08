package com.bloodbridge.repository;

import com.bloodbridge.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    Page<Notification> findByUserIdOrderByCreatedAtDesc(
            Long userId,
            Pageable pageable
    );

    Page<Notification> findByUserIdAndReadStatusOrderByCreatedAtDesc(
            Long userId,
            Boolean readStatus,
            Pageable pageable
    );

    long countByUserIdAndReadStatus(
            Long userId,
            Boolean readStatus
    );
}