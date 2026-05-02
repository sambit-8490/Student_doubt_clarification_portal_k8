package com.doubt.platform.controller;

import com.doubt.platform.model.Notification;
import com.doubt.platform.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<?> getAll(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(list.stream().map(this::toMap).toList());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> unreadCount(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        long count = notificationRepository.countByUserIdAndIsRead(userId, false);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/mark-all-read")
    @Transactional
    public ResponseEntity<?> markAllRead(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        notificationRepository.markAllReadByUserId(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @PatchMapping("/{id}/read")
    @Transactional
    public ResponseEntity<?> markRead(@PathVariable Long id, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        notificationRepository.findById(id).ifPresent(n -> {
            if (n.getUserId().equals(userId)) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        });
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }

    private Map<String, Object> toMap(Notification n) {
        return Map.of(
            "id", n.getId(),
            "type", n.getType(),
            "message", n.getMessage(),
            "isRead", n.getIsRead(),
            "appointmentId", n.getAppointmentId() != null ? n.getAppointmentId() : 0,
            "createdAt", n.getCreatedAt().toString()
        );
    }
}
