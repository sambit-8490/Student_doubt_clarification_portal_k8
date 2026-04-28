package com.doubt.platform.controller;

import com.doubt.platform.dto.AppDto;
import com.doubt.platform.model.User;
import com.doubt.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
        List<Map<String, Object>> users = userRepository.findAll().stream().map(u -> Map.of(
                "id", u.getId(), "name", u.getName(), "email", u.getEmail(),
                "role", u.getRole(), "department", u.getDepartment() != null ? u.getDepartment() : "",
                "createdAt", u.getCreatedAt()
        )).toList();
        return ResponseEntity.ok(users);
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
        User saved = userRepository.save(u);

        return ResponseEntity.status(201).body(Map.of(
                "id", saved.getId(), "name", saved.getName(),
                "email", saved.getEmail(), "role", saved.getRole()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication auth) {
        if (!isAdmin(auth)) return forbidden();
        Long currentId = (Long) auth.getPrincipal();
        if (currentId.equals(id))
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot delete yourself"));
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    private ResponseEntity<?> forbidden() {
        return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
    }
}
