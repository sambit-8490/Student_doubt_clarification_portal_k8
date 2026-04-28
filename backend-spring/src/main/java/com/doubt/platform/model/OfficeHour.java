package com.doubt.platform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "office_hours")
public class OfficeHour {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "faculty_id")
    private Long facultyId;

    @Column(name = "faculty_name", nullable = false, length = 100)
    private String facultyName;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 50)
    private String time;

    @Column(name = "is_booked")
    private Boolean isBooked = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
