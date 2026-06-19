package org.example.magazin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class OrderStatusRequest {
    @NotBlank
    private String status;
}
