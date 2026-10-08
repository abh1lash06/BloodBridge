package com.bloodbridge.controller;

import com.bloodbridge.dto.notification.NotificationResponse;
import com.bloodbridge.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService =
                notificationService;
    }

    // =========================================================
    // GET NOTIFICATIONS
    // =========================================================

    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> getMyNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {

        validatePagination(page, size);

        Page<NotificationResponse> response =
                notificationService.getMyNotifications(
                        authentication.getName(),
                        page,
                        size,
                        unreadOnly
                );

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // UNREAD COUNT
    // =========================================================

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            Authentication authentication) {

        return ResponseEntity.ok(
                notificationService.getUnreadCount(
                        authentication.getName()
                )
        );
    }

    // =========================================================
    // MARK ONE AS READ
    // =========================================================

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(
            Authentication authentication,
            @PathVariable Long notificationId) {

        notificationService.markAsRead(
                authentication.getName(),
                notificationId
        );

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // MARK ALL AS READ
    // =========================================================

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            Authentication authentication) {

        notificationService.markAllAsRead(
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // PAGINATION
    // =========================================================

    private void validatePagination(
            int page,
            int size) {

        if (page < 0) {

            throw new IllegalArgumentException(
                    "Page must be greater than or equal to 0"
            );
        }

        if (size < 1 || size > 50) {

            throw new IllegalArgumentException(
                    "Size must be between 1 and 50"
            );
        }
    }
}