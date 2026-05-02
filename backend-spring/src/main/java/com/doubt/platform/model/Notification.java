package com.doubt.platform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notifications")
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 50)
    private String type; // APPOINTMENT_BOOKED, APPROVED, CANCELLED, COMPLETED

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "appointment_id")
    private Long appointmentId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
