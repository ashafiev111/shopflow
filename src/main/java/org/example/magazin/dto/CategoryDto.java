package org.example.magazin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CategoryDto {
    private Long id;

    @NotBlank
    private String name;

    @NotBlank @Size(max = 10)
    private String icon;
}
