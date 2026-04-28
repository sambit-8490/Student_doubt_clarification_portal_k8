package com.doubt.platform.controller;

import com.doubt.platform.dto.AuthDto;
import com.doubt.platform.model.User;
import com.doubt.platform.repository.UserRepository;
import com.doubt.platform.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDto.LoginRequest req) {
        if (req.getEmail() == null || req.getPassword() == null || req.getRole() == null)
            return ResponseEntity.badRequest().body(Map.of("message", "All fields required"));

        User user = userRepository.findByEmail(req.getEmail().toLowerCase())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(req.getPassword(), user.getPassword()))
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));

        if (!user.getRole().equals(req.getRole()))
            return ResponseEntity.status(401).body(Map.of("message",
                    "This account is registered as " + user.getRole() + ". Please select the correct role."));

        String token = jwtUtil.generate(user.getId(), user.getRole());

        AuthDto.LoginResponse.UserInfo info = new AuthDto.LoginResponse.UserInfo();
        info.setId(user.getId());
        info.setName(user.getName());
        info.setEmail(user.getEmail());
        info.setRole(user.getRole());
        info.setDepartment(user.getDepartment());

        AuthDto.LoginResponse response = new AuthDto.LoginResponse();
        response.setToken(token);
        response.setUser(info);

        return ResponseEntity.ok(response);
    }
}
