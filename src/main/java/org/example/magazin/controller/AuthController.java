package org.example.magazin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/status")
    public ResponseEntity<?> status(Authentication auth) {
        if (auth != null && auth.isAuthenticated()) {
            return ResponseEntity.ok(Map.of("username", auth.getName()));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
    }
}
