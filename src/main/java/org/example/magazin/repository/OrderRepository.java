package org.example.magazin.repository;

import org.example.magazin.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findAllByOrderByDateDesc();
    List<Order> findByUserIdOrderByDateDesc(Long userId);
}
