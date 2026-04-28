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
        List<Map<String, Object>> list = officeHourRepository.findAllByOrderByDateAscTimeAsc()
                .stream().map(this::toMap).toList();
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody AppDto.OfficeHourRequest req, Authentication auth) {
        if (!isFaculty(auth)) return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
        if (req.getDate() == null || req.getTime() == null)
            return ResponseEntity.badRequest().body(Map.of("message", "Date and time required"));

        Long facultyId = (Long) auth.getPrincipal();
        User faculty = userRepository.findById(facultyId).orElseThrow();

        OfficeHour oh = new OfficeHour();
        oh.setFacultyId(facultyId);
        oh.setFacultyName(faculty.getName());
        oh.setDate(LocalDate.parse(req.getDate()));
        oh.setTime(req.getTime());
        oh.setIsBooked(false);

        return ResponseEntity.status(201).body(toMap(officeHourRepository.save(oh)));
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
