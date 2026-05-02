package com.doubt.platform.controller;

import com.doubt.platform.dto.AppDto;
import com.doubt.platform.model.User;
import com.doubt.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<?> getAll(Authentication auth) {
        if (!isAdmin(auth)) return forbidden();
        return ResponseEntity.ok(userRepository.findAll().stream().map(this::toMap).toList());
    }

    @GetMapping("/faculty")
    public ResponseEntity<?> getFaculty(@RequestParam(required = false) String search) {
        List<User> faculty = userRepository.findAll().stream()
            .filter(u -> "faculty".equals(u.getRole()))
            .filter(u -> search == null || search.isBlank() ||
                u.getName().toLowerCase().contains(search.toLowerCase()) ||
                (u.getDepartment() != null && u.getDepartment().toLowerCase().contains(search.toLowerCase())))
            .toList();
        return ResponseEntity.ok(faculty.stream().map(this::toMap).toList());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return userRepository.findById(userId)
            .map(u -> ResponseEntity.ok(toMap(u)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody AppDto.ProfileRequest req, Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        User u = userRepository.findById(userId).orElseThrow();
        if (req.getName() != null && !req.getName().isBlank()) u.setName(req.getName());
        if (req.getDepartment() != null) u.setDepartment(req.getDepartment());
        return ResponseEntity.ok(toMap(userRepository.save(u)));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody AppDto.UserRequest req, Authentication auth) {
        if (!isAdmin(auth)) return forbidden();
        if (req.getName() == null || req.getEmail() == null || req.getPassword() == null || req.getRole() == null)
            return ResponseEntity.badRequest().body(Map.of("message", "All fields required"));
        if (userRepository.existsByEmail(req.getEmail().toLowerCase()))
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));

        User u = new User();
        u.setName(req.getName());
        u.setEmail(req.getEmail().toLowerCase());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setRole(req.getRole());
        u.setDepartment(req.getDepartment());
        return ResponseEntity.status(201).body(toMap(userRepository.save(u)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication auth) {
        if (!isAdmin(auth)) return forbidden();
        Long currentId = (Long) auth.getPrincipal();
        if (currentId.equals(id)) return ResponseEntity.badRequest().body(Map.of("message", "Cannot delete yourself"));
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    private Map<String, Object> toMap(User u) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", u.getId());
        m.put("name", u.getName());
        m.put("email", u.getEmail());
        m.put("role", u.getRole());
        m.put("department", u.getDepartment() != null ? u.getDepartment() : "");
        m.put("createdAt", u.getCreatedAt().toString());
        return m;
    }

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private ResponseEntity<?> forbidden() {
        return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
    }
}
