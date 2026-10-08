package com.bloodbridge.service;

import com.bloodbridge.dto.notification.NotificationResponse;
import com.bloodbridge.entity.Notification;
import com.bloodbridge.entity.User;
import com.bloodbridge.repository.NotificationRepository;
import com.bloodbridge.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository
    ) {
        this.notificationRepository =
                notificationRepository;

        this.userRepository =
                userRepository;
    }

    // =========================================================
    // CREATE NOTIFICATION
    // =========================================================

    @Transactional
    public void createNotification(
            User user,
            Notification.NotificationType type,
            String title,
            String message,
            Long referenceId
    ) {
        if (user == null) {
            throw new IllegalArgumentException(
                    "Notification user is required"
            );
        }

        if (type == null) {
            throw new IllegalArgumentException(
                    "Notification type is required"
            );
        }

        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException(
                    "Notification title is required"
            );
        }

        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException(
                    "Notification message is required"
            );
        }

        String normalizedTitle = title.trim();
        String normalizedMessage = message.trim();

        if (normalizedTitle.length() > 200) {
            throw new IllegalArgumentException(
                    "Notification title cannot exceed 200 characters"
            );
        }

        if (normalizedMessage.length() > 1000) {
            throw new IllegalArgumentException(
                    "Notification message cannot exceed 1000 characters"
            );
        }

        Notification notification =
                Notification.builder()
                        .user(user)
                        .type(type)
                        .title(normalizedTitle)
                        .message(normalizedMessage)
                        .referenceId(referenceId)
                        .readStatus(false)
                        .build();

        notificationRepository.save(notification);
    }

    // =========================================================
    // GET MY NOTIFICATIONS
    // =========================================================

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getMyNotifications(
            String authenticatedEmail,
            int page,
            int size,
            boolean unreadOnly
    ) {
        validatePagination(page, size);

        User user =
                getUserByEmail(authenticatedEmail);

        Page<Notification> notifications;

        PageRequest pageRequest =
                PageRequest.of(page, size);

        if (unreadOnly) {

            notifications =
                    notificationRepository
                            .findByUserIdAndReadStatusOrderByCreatedAtDesc(
                                    user.getId(),
                                    false,
                                    pageRequest
                            );

        } else {

            notifications =
                    notificationRepository
                            .findByUserIdOrderByCreatedAtDesc(
                                    user.getId(),
                                    pageRequest
                            );
        }

        return notifications.map(
                this::toResponse
        );
    }

    // =========================================================
    // UNREAD COUNT
    // =========================================================

    @Transactional(readOnly = true)
    public long getUnreadCount(
            String authenticatedEmail
    ) {
        User user =
                getUserByEmail(authenticatedEmail);

        return notificationRepository
                .countByUserIdAndReadStatus(
                        user.getId(),
                        false
                );
    }

    // =========================================================
    // MARK ONE AS READ
    // =========================================================

    @Transactional
    public void markAsRead(
            String authenticatedEmail,
            Long notificationId
    ) {
        if (notificationId == null) {
            throw new IllegalArgumentException(
                    "Notification ID is required"
            );
        }

        User user =
                getUserByEmail(authenticatedEmail);

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Notification not found"
                                )
                        );

        verifyNotificationOwnership(
                notification,
                user
        );

        notification.setReadStatus(true);

        notificationRepository.save(
                notification
        );
    }

    // =========================================================
    // MARK ALL AS READ
    // =========================================================

    @Transactional
    public void markAllAsRead(
            String authenticatedEmail
    ) {
        User user =
                getUserByEmail(authenticatedEmail);

        /*
         * Load unread notifications in batches rather than
         * attempting to update an unbounded number of records.
         *
         * The current application uses 1000 as the maximum
         * batch size here.
         */
        Page<Notification> notifications =
                notificationRepository
                        .findByUserIdAndReadStatusOrderByCreatedAtDesc(
                                user.getId(),
                                false,
                                PageRequest.of(
                                        0,
                                        1000
                                )
                        );

        for (Notification notification :
                notifications.getContent()) {

            notification.setReadStatus(true);
        }

        if (!notifications.isEmpty()) {
            notificationRepository.saveAll(
                    notifications.getContent()
            );
        }
    }

    // =========================================================
    // USER LOOKUP
    // =========================================================

    private User getUserByEmail(
            String authenticatedEmail
    ) {
        if (authenticatedEmail == null
                || authenticatedEmail.isBlank()) {

            throw new IllegalArgumentException(
                    "Authenticated user email is required"
            );
        }

        return userRepository
                .findByEmail(authenticatedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );
    }

    // =========================================================
    // OWNERSHIP
    // =========================================================

    private void verifyNotificationOwnership(
            Notification notification,
            User user
    ) {
        if (notification.getUser() == null
                || notification.getUser().getId() == null
                || !notification.getUser()
                .getId()
                .equals(user.getId())) {

            throw new IllegalArgumentException(
                    "You are not authorized to access this notification"
            );
        }
    }

    // =========================================================
    // PAGINATION VALIDATION
    // =========================================================

    private void validatePagination(
            int page,
            int size
    ) {
        if (page < 0) {
            throw new IllegalArgumentException(
                    "Page must be greater than or equal to 0"
            );
        }

        if (size < 1 || size > 50) {
            throw new IllegalArgumentException(
                    "Page size must be between 1 and 50"
            );
        }
    }

    // =========================================================
    // RESPONSE MAPPER
    // =========================================================

    private NotificationResponse toResponse(
            Notification notification
    ) {
        return NotificationResponse
                .builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .referenceId(notification.getReferenceId())
                .readStatus(notification.getReadStatus())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}