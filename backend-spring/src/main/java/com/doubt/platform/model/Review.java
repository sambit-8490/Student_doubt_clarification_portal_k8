package com.doubt.platform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reviews")
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "appointment_id", nullable = false, unique = true)
    private Long appointmentId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "faculty_id", nullable = false)
    private Long facultyId;

    @Column(name = "faculty_name", length = 100)
    private String facultyName;

    @Column(name = "student_name", length = 100)
    private String studentName;

    @Column(nullable = false)
    private Integer rating; // 1-5

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
