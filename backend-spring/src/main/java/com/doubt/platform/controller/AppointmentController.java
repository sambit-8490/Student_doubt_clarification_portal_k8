package com.doubt.platform.controller;

import com.doubt.platform.dto.AppDto;
import com.doubt.platform.model.Appointment;
import com.doubt.platform.model.OfficeHour;
import com.doubt.platform.model.User;
import com.doubt.platform.repository.AppointmentRepository;
import com.doubt.platform.repository.OfficeHourRepository;
import com.doubt.platform.repository.UserRepository;
import com.doubt.platform.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final OfficeHourRepository officeHourRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<?> getAll(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        String role = (String) auth.getCredentials();
        List<Appointment> list = switch (role) {
            case "student" -> appointmentRepository.findByStudentIdOrderByDateDesc(userId);
            case "faculty" -> appointmentRepository.findByFacultyIdOrderByDateDesc(userId);
            default -> appointmentRepository.findAllByOrderByDateDesc();
        };
        return ResponseEntity.ok(list.stream().map(this::toMap).toList());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> book(@RequestBody AppDto.AppointmentRequest req, Authentication auth) {
        String role = (String) auth.getCredentials();
        if (!"student".equals(role)) return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
        if (req.getOfficeHourId() == null || req.getDoubt() == null)
            return ResponseEntity.badRequest().body(Map.of("message", "All fields required"));

        OfficeHour slot = officeHourRepository.findById(req.getOfficeHourId()).orElse(null);
        if (slot == null) return ResponseEntity.status(404).body(Map.of("message", "Slot not found"));
        if (slot.getIsBooked()) return ResponseEntity.badRequest().body(Map.of("message", "Slot already booked"));

        Long studentId = (Long) auth.getPrincipal();
        User student = userRepository.findById(studentId).orElseThrow();

        Appointment a = new Appointment();
        a.setStudentId(studentId);
        a.setStudentName(student.getName());
        a.setFacultyId(slot.getFacultyId());
        a.setFacultyName(slot.getFacultyName());
        a.setOfficeHourId(slot.getId());
        a.setDate(slot.getDate());
        a.setTime(slot.getTime());
        a.setDoubt(req.getDoubt());
        a.setTag(req.getTag());

        slot.setIsBooked(true);
        officeHourRepository.save(slot);
        Appointment saved = appointmentRepository.save(a);

        // Notify faculty
        notificationService.send(slot.getFacultyId(), "APPOINTMENT_BOOKED",
            student.getName() + " booked an appointment on " + slot.getDate() + " at " + slot.getTime(), saved.getId());

        return ResponseEntity.status(201).body(toMap(saved));
    }

    @PatchMapping("/{id}")
    @Transactional
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody AppDto.StatusRequest req, Authentication auth) {
        String role = (String) auth.getCredentials();
        if (!"faculty".equals(role)) return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));

        List<String> valid = List.of("approved", "cancelled", "completed");
        if (!valid.contains(req.getStatus()))
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid status"));

        Long facultyId = (Long) auth.getPrincipal();
        Appointment a = appointmentRepository.findById(id).orElse(null);
        if (a == null || !a.getFacultyId().equals(facultyId))
            return ResponseEntity.status(404).body(Map.of("message", "Appointment not found"));

        a.setStatus(req.getStatus());
        if (req.getNotes() != null) a.setNotes(req.getNotes());

        if ("cancelled".equals(req.getStatus())) {
            officeHourRepository.findById(a.getOfficeHourId()).ifPresent(oh -> {
                oh.setIsBooked(false);
                officeHourRepository.save(oh);
            });
            notificationService.send(a.getStudentId(), "CANCELLED",
                "Your appointment with " + a.getFacultyName() + " on " + a.getDate() + " was cancelled.", id);
        } else if ("approved".equals(req.getStatus())) {
            notificationService.send(a.getStudentId(), "APPROVED",
                "Your appointment with " + a.getFacultyName() + " on " + a.getDate() + " has been approved!", id);
        } else if ("completed".equals(req.getStatus())) {
            notificationService.send(a.getStudentId(), "COMPLETED",
                "Your session with " + a.getFacultyName() + " is marked complete. Please rate the session.", id);
        }

        return ResponseEntity.ok(toMap(appointmentRepository.save(a)));
    }

    private Map<String, Object> toMap(Appointment a) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", a.getId());
        m.put("studentId", a.getStudentId());
        m.put("studentName", a.getStudentName());
        m.put("facultyId", a.getFacultyId());
        m.put("facultyName", a.getFacultyName());
        m.put("officeHourId", a.getOfficeHourId());
        m.put("date", a.getDate().toString());
        m.put("time", a.getTime());
        m.put("doubt", a.getDoubt());
        m.put("status", a.getStatus());
        m.put("tag", a.getTag() != null ? a.getTag() : "");
        m.put("notes", a.getNotes() != null ? a.getNotes() : "");
        return m;
    }
}
