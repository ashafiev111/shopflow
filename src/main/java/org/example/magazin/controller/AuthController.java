package org.example.magazin.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.magazin.config.JwtUtil;
import org.example.magazin.dto.RegisterRequest;
import org.example.magazin.model.User;
import org.example.magazin.repository.UserRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        if (username == null || password == null) {
            return ResponseEntity.status(400).body(Map.of("error", "username and password required"));
        }
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
        String token = jwtUtil.generateToken(username);
        User user = userRepository.findByUsername(username).orElse(null);
        String role = user != null ? user.getRole() : "CLIENT";
        return ResponseEntity.ok(Map.of("token", token, "username", username, "role", role));
    }

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            return ResponseEntity.status(400).body(Map.of("error", "Username is required"));
        }
        if (request.getPassword() == null || request.getPassword().length() < 4) {
            return ResponseEntity.status(400).body(Map.of("error", "Password must be at least 4 characters"));
        }
        if (userRepository.existsByUsername(request.getUsername().trim().toLowerCase())) {
            return ResponseEntity.status(409).body(Map.of("error", "Username already taken"));
        }
        User user = new User();
        user.setUsername(request.getUsername().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("CLIENT");
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getUsername());
        return ResponseEntity.ok(Map.of("token", token, "username", user.getUsername(), "role", user.getRole()));
    }

    @GetMapping("/status")
    public ResponseEntity<?> status(Authentication auth) {
        if (auth != null && auth.isAuthenticated()) {
            String username = auth.getName();
            User user = userRepository.findByUsername(username).orElse(null);
            String role = user != null ? user.getRole() : "CLIENT";
            return ResponseEntity.ok(Map.of("username", username, "role", role));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
    }
}
