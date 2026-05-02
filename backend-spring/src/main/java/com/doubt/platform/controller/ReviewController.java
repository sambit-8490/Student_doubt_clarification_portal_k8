package com.doubt.platform.controller;

import com.doubt.platform.dto.AppDto;
import com.doubt.platform.model.Appointment;
import com.doubt.platform.model.Review;
import com.doubt.platform.repository.AppointmentRepository;
import com.doubt.platform.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final AppointmentRepository appointmentRepository;

    @PostMapping
    public ResponseEntity<?> submit(@RequestBody AppDto.ReviewRequest req, Authentication auth) {
        String role = (String) auth.getCredentials();
        if (!"student".equals(role)) return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
        if (req.getRating() == null || req.getRating() < 1 || req.getRating() > 5)
            return ResponseEntity.badRequest().body(Map.of("message", "Rating must be 1-5"));

        Long studentId = (Long) auth.getPrincipal();
        Appointment apt = appointmentRepository.findById(req.getAppointmentId()).orElse(null);
        if (apt == null || !apt.getStudentId().equals(studentId))
            return ResponseEntity.status(404).body(Map.of("message", "Appointment not found"));
        if (!"completed".equals(apt.getStatus()))
            return ResponseEntity.badRequest().body(Map.of("message", "Can only review completed appointments"));
        if (reviewRepository.findByAppointmentId(req.getAppointmentId()).isPresent())
            return ResponseEntity.badRequest().body(Map.of("message", "Already reviewed"));

        Review r = new Review();
        r.setAppointmentId(req.getAppointmentId());
        r.setStudentId(studentId);
        r.setFacultyId(apt.getFacultyId());
        r.setFacultyName(apt.getFacultyName());
        r.setStudentName(apt.getStudentName());
        r.setRating(req.getRating());
        r.setComment(req.getComment());

        return ResponseEntity.status(201).body(toMap(reviewRepository.save(r)));
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<?> getFacultyReviews(@PathVariable Long facultyId) {
        List<Map<String, Object>> reviews = reviewRepository
            .findByFacultyIdOrderByCreatedAtDesc(facultyId)
            .stream().map(this::toMap).toList();
        Double avg = reviewRepository.avgRatingByFacultyId(facultyId);
        Map<String, Object> res = new HashMap<>();
        res.put("reviews", reviews);
        res.put("averageRating", avg != null ? Math.round(avg * 10.0) / 10.0 : 0);
        res.put("totalReviews", reviews.size());
        return ResponseEntity.ok(res);
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> getByAppointment(@PathVariable Long appointmentId) {
        return reviewRepository.findByAppointmentId(appointmentId)
            .map(r -> ResponseEntity.ok(toMap(r)))
            .orElse(ResponseEntity.ok(Map.of()));
    }

    private Map<String, Object> toMap(Review r) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", r.getId());
        m.put("appointmentId", r.getAppointmentId());
        m.put("studentName", r.getStudentName());
        m.put("facultyName", r.getFacultyName());
        m.put("rating", r.getRating());
        m.put("comment", r.getComment() != null ? r.getComment() : "");
        m.put("createdAt", r.getCreatedAt().toString());
        return m;
    }
}
