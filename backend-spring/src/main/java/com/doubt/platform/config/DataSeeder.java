package com.doubt.platform.config;

import com.doubt.platform.model.User;
import com.doubt.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.save(user("Admin User", "admin@college.edu", "admin123", "admin", null));
            userRepository.save(user("Faculty", "faculty@college.edu", "faculty123", "faculty", null));
            userRepository.save(user("Student", "student@college.edu", "student123", "student", null));
            System.out.println("✅ Default users seeded");
        }
    }

    private User user(String name, String email, String password, String role, String dept) {
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(password));
        u.setRole(role);
        u.setDepartment(dept);
        return u;
    }
}
