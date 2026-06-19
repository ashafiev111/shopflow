package org.example.magazin.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProductDto {
    private Long id;

    @NotBlank
    private String name;

    @NotNull
    private Long categoryId;

    @NotNull @Min(0)
    private Integer price;

    private Integer oldPrice;

    @Size(max = 500)
    private String imageUrl;

    @Min(0)
    private Integer stock = 0;

    private BigDecimal rating;

    @Min(0)
    private Integer sold = 0;
}
