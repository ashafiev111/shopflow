package org.example.magazin.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CreateOrderRequest {
    @NotBlank
    private String customer;

    @NotBlank
    private String phone;

    @NotBlank
    private String address;

    private String comment;

    @NotEmpty
    private List<OrderItemRequest> items;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        @Min(1)
        private Integer qty;
    }
}
