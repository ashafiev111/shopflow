package org.example.magazin.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class OrderDto {
    private String id;
    private String date;
    private List<OrderItemDto> items;
    private Integer total;
    private String status;
    private String customer;
    private String address;
    private String phone;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class OrderItemDto {
        private String name;
        private Integer qty;
        private Integer price;
    }
}
