package com.doubt.platform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "student_name", nullable = false, length = 100)
    private String studentName;

    @Column(name = "faculty_id")
    private Long facultyId;

    @Column(name = "faculty_name", nullable = false, length = 100)
    private String facultyName;

    @Column(name = "office_hour_id")
    private Long officeHourId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 50)
    private String time;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String doubt;

    @Column(length = 50)
    private String tag; // DSA, DBMS, OS, Networks, Math, Other

    @Column(length = 20)
    private String status = "pending";

    @Column(columnDefinition = "TEXT")
    private String notes; // faculty session notes

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
