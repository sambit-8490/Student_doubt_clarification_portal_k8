package com.doubt.platform.controller;

import com.doubt.platform.dto.AppDto;
import com.doubt.platform.model.OfficeHour;
import com.doubt.platform.model.User;
import com.doubt.platform.repository.OfficeHourRepository;
import com.doubt.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/office-hours")
@RequiredArgsConstructor
public class OfficeHourController {

    private final OfficeHourRepository officeHourRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(officeHourRepository.findAllByOrderByDateAscTimeAsc()
            .stream().map(this::toMap).toList());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody AppDto.OfficeHourRequest req, Authentication auth) {
        if (!isFaculty(auth)) return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
        if (req.getDate() == null || req.getTime() == null)
            return ResponseEntity.badRequest().body(Map.of("message", "Date and time required"));

        Long facultyId = (Long) auth.getPrincipal();
        User faculty = userRepository.findById(facultyId).orElseThrow();

        int weeks = (req.getRecurring() != null && req.getRecurring() && req.getRepeatWeeks() != null)
            ? req.getRepeatWeeks() : 1;

        List<Map<String, Object>> created = new ArrayList<>();
        LocalDate baseDate = LocalDate.parse(req.getDate());

        for (int i = 0; i < weeks; i++) {
            OfficeHour oh = new OfficeHour();
            oh.setFacultyId(facultyId);
            oh.setFacultyName(faculty.getName());
            oh.setDate(baseDate.plusWeeks(i));
            oh.setTime(req.getTime());
            oh.setIsBooked(false);
            created.add(toMap(officeHourRepository.save(oh)));
        }

        return ResponseEntity.status(201).body(created.size() == 1 ? created.get(0) : created);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<?> toggle(@PathVariable Long id, Authentication auth) {
        if (!isFaculty(auth)) return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
        Long facultyId = (Long) auth.getPrincipal();
        OfficeHour oh = officeHourRepository.findById(id).orElse(null);
        if (oh == null || !oh.getFacultyId().equals(facultyId))
            return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        if (oh.getIsBooked()) return ResponseEntity.badRequest().body(Map.of("message", "Cannot toggle a booked slot"));
        oh.setIsBooked(!oh.getIsBooked());
        return ResponseEntity.ok(toMap(officeHourRepository.save(oh)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication auth) {
        if (!isFaculty(auth)) return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
        Long facultyId = (Long) auth.getPrincipal();
        OfficeHour oh = officeHourRepository.findById(id).orElse(null);
        if (oh == null || !oh.getFacultyId().equals(facultyId))
            return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        if (oh.getIsBooked()) return ResponseEntity.badRequest().body(Map.of("message", "Cannot delete a booked slot"));
        officeHourRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }

    private boolean isFaculty(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_FACULTY"));
    }

    private Map<String, Object> toMap(OfficeHour o) {
        return Map.of(
            "id", o.getId(), "facultyId", o.getFacultyId(),
            "facultyName", o.getFacultyName(), "date", o.getDate().toString(),
            "time", o.getTime(), "isBooked", o.getIsBooked()
        );
    }
}
