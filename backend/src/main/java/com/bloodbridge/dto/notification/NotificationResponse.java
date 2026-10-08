package com.bloodbridge.dto.notification;

import com.bloodbridge.entity.Notification;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NotificationResponse {

    private Long id;

    private Notification.NotificationType type;

    private String title;

    private String message;

    private Long referenceId;

    private Boolean readStatus;

    private LocalDateTime createdAt;
}