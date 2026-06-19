package org.example.magazin.service;

import lombok.RequiredArgsConstructor;
import org.example.magazin.dto.CreateOrderRequest;
import org.example.magazin.dto.OrderDto;
import org.example.magazin.exception.NotFoundException;
import org.example.magazin.model.Order;
import org.example.magazin.model.OrderItem;
import org.example.magazin.model.Product;
import org.example.magazin.repository.OrderRepository;
import org.example.magazin.repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final AtomicLong orderIdCounter = new AtomicLong(100);

    @PostConstruct
    public void init() {
        orderIdCounter.set(orderRepository.count() + 100);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> findAll() {
        return orderRepository.findAllByOrderByDateDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderDto> findByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByDateDesc(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDto create(CreateOrderRequest request, Long userId) {
        String orderId = "ORD-" + String.format("%04d", orderIdCounter.incrementAndGet());

        Order order = new Order();
        order.setId(orderId);
        order.setDate(LocalDateTime.now());
        order.setCustomer(request.getCustomer());
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress());
        order.setStatus("pending");
        order.setUserId(userId);

        int total = 0;
        for (CreateOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new NotFoundException("Product not found: " + itemReq.getProductId()));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setName(product.getName());
            item.setQty(itemReq.getQty());
            item.setPrice(product.getPrice());
            order.getItems().add(item);

            total += product.getPrice() * itemReq.getQty();
        }
        order.setTotal(total);

        return toDto(orderRepository.save(order));
    }

    @Transactional
    public OrderDto updateStatus(String id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found: " + id));
        order.setStatus(status);
        return toDto(orderRepository.save(order));
    }

    private OrderDto toDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setDate(order.getDate().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
        dto.setTotal(order.getTotal());
        dto.setStatus(order.getStatus());
        dto.setCustomer(order.getCustomer());
        dto.setAddress(order.getAddress());
        dto.setPhone(order.getPhone());
        dto.setUserId(order.getUserId());
        dto.setItems(order.getItems().stream().map(item -> {
            OrderDto.OrderItemDto itemDto = new OrderDto.OrderItemDto();
            itemDto.setName(item.getName());
            itemDto.setQty(item.getQty());
            itemDto.setPrice(item.getPrice());
            return itemDto;
        }).collect(Collectors.toList()));
        return dto;
    }
}
