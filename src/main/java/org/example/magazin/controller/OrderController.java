package org.example.magazin.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.magazin.dto.CreateOrderRequest;
import org.example.magazin.dto.OrderDto;
import org.example.magazin.dto.OrderStatusRequest;
import org.example.magazin.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    public List<OrderDto> getAll() {
        return orderService.findAll();
    }

    @PostMapping
    public ResponseEntity<OrderDto> create(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(request));
    }

    @PatchMapping("/{id}/status")
    public OrderDto updateStatus(@PathVariable String id, @Valid @RequestBody OrderStatusRequest request) {
        return orderService.updateStatus(id, request.getStatus());
    }
}
