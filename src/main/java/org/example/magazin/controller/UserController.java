package org.example.magazin.controller;

import lombok.RequiredArgsConstructor;
import org.example.magazin.dto.UpdateProfileRequest;
import org.example.magazin.dto.UserDto;
import org.example.magazin.model.User;
import org.example.magazin.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public List<UserDto> getAll() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(toDto(user));
    }

    @PatchMapping("/me")
    public ResponseEntity<?> updateMe(Authentication auth, @RequestBody UpdateProfileRequest body) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (body.getEmail() != null) user.setEmail(body.getEmail());
        if (body.getFullName() != null) user.setFullName(body.getFullName());
        if (body.getPhone() != null) user.setPhone(body.getPhone());
        if (body.getAddress() != null) user.setAddress(body.getAddress());

        userRepository.save(user);
        return ResponseEntity.ok(toDto(user));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication auth) {
        String newRole = body.get("role");
        if (newRole == null || (!newRole.equals("CLIENT") && !newRole.equals("MANAGER") && !newRole.equals("ADMIN"))) {
            return ResponseEntity.status(400).body(Map.of("error", "Invalid role. Must be CLIENT, MANAGER, or ADMIN"));
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        if (auth != null && auth.getName().equals(user.getUsername())) {
            return ResponseEntity.status(400).body(Map.of("error", "Нельзя изменить свою собственную роль"));
        }
        user.setRole(newRole);
        userRepository.save(user);
        return ResponseEntity.ok(toDto(user));
    }

    private UserDto toDto(User u) {
        return new UserDto(u.getId(), u.getUsername(), u.getRole(),
                u.getEmail(), u.getFullName(), u.getPhone(), u.getAddress());
    }
}
