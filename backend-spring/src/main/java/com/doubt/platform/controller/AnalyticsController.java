package com.doubt.platform.controller;

import com.doubt.platform.repository.AppointmentRepository;
import com.doubt.platform.repository.NotificationRepository;
import com.doubt.platform.repository.OfficeHourRepository;
import com.doubt.platform.repository.ReviewRepository;
import com.doubt.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final OfficeHourRepository officeHourRepository;
    private final ReviewRepository reviewRepository;

    @GetMapping
    public ResponseEntity<?> getAnalytics(Authentication auth) {
        String role = (String) auth.getCredentials();
        if (!"admin".equals(role)) return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));

        List<Object[]> statusCounts = appointmentRepository.countByStatus();
        List<Object[]> tagCounts = appointmentRepository.countByTag();
        List<Object[]> facultyStats = appointmentRepository.countByFaculty();

        Map<String, Object> res = new HashMap<>();

        // Status breakdown
        Map<String, Long> byStatus = statusCounts.stream()
            .collect(Collectors.toMap(r -> (String) r[0], r -> (Long) r[1]));
        res.put("byStatus", byStatus);

        // Tag breakdown
        Map<String, Long> byTag = tagCounts.stream()
            .collect(Collectors.toMap(
                r -> r[0] != null ? (String) r[0] : "Other",
                r -> (Long) r[1]
            ));
        res.put("byTag", byTag);

        // Per faculty
        List<Map<String, Object>> perFaculty = facultyStats.stream().map(r -> {
            Map<String, Object> m = new HashMap<>();
            m.put("facultyName", r[0]);
            m.put("total", r[1]);
            return m;
        }).toList();
        res.put("perFaculty", perFaculty);

        // Totals
        res.put("totalUsers", userRepository.count());
        res.put("totalStudents", userRepository.countByRole("student"));
        res.put("totalFaculty", userRepository.countByRole("faculty"));
        res.put("totalAppointments", appointmentRepository.count());
        res.put("totalOfficeHours", officeHourRepository.count());
        res.put("totalReviews", reviewRepository.count());

        return ResponseEntity.ok(res);
    }
}
