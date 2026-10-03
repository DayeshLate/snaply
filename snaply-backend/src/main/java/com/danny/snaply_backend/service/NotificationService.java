package com.danny.snaply_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.danny.snaply_backend.dto.NotificationDTO;
import com.danny.snaply_backend.entity.Notification;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public NotificationDTO sendNotification(User recipient, String title, String message) {
        if (recipient == null) {
            log.warn("Cannot send notification: recipient is null. Title: {}", title);
            return null;
        }

        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .isRead(false)
                .user(recipient)
                .build();

        Notification saved = notificationRepository.save(notification);
        log.info("Notification sent to user {}: {}", recipient.getEmail(), title);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getAllForCurrentUser() {
        User currentUser = userService.getCurrentUser();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getUnreadForCurrentUser() {
        User currentUser = userService.getCurrentUser();
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCountForCurrentUser() {
        User currentUser = userService.getCurrentUser();
        return notificationRepository.countByUserIdAndIsReadFalse(currentUser.getId());
    }

    public NotificationDTO markAsRead(Long notificationId) {
        User currentUser = userService.getCurrentUser();
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + notificationId));

        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return toDTO(saved);
    }

    public void markAllAsRead() {
        User currentUser = userService.getCurrentUser();
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(currentUser.getId());
        for (Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    public NotificationDTO toDTO(Notification entity) {
        if (entity == null) return null;
        return NotificationDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .message(entity.getMessage())
                .isRead(entity.isRead())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
