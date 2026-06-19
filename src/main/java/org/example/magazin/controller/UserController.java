package org.example.magazin.controller;

import lombok.RequiredArgsConstructor;
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
                .map(u -> new UserDto(u.getId(), u.getUsername(), u.getRole()))
                .collect(Collectors.toList());
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
        return ResponseEntity.ok(new UserDto(user.getId(), user.getUsername(), user.getRole()));
    }
}
