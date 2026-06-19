package org.example.magazin.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.magazin.dto.CreateOrderRequest;
import org.example.magazin.dto.OrderDto;
import org.example.magazin.dto.OrderStatusRequest;
import org.example.magazin.model.User;
import org.example.magazin.repository.UserRepository;
import org.example.magazin.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final UserRepository userRepository;

    @GetMapping
    public List<OrderDto> getAll(Authentication auth) {
        if (auth != null && isAdmin(auth)) {
            return orderService.findAll();
        }
        if (auth != null) {
            User user = userRepository.findByUsername(auth.getName()).orElse(null);
            if (user != null) {
                return orderService.findByUserId(user.getId());
            }
        }
        return List.of();
    }

    @PostMapping
    public ResponseEntity<OrderDto> create(@Valid @RequestBody CreateOrderRequest request, Authentication auth) {
        Long userId = null;
        if (auth != null) {
            User user = userRepository.findByUsername(auth.getName()).orElse(null);
            if (user != null) {
                userId = user.getId();
            }
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(request, userId));
    }

    @PatchMapping("/{id}/status")
    public OrderDto updateStatus(@PathVariable String id, @Valid @RequestBody OrderStatusRequest request) {
        return orderService.updateStatus(id, request.getStatus());
    }

    private boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
