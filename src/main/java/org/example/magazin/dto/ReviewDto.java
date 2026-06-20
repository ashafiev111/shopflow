package org.example.magazin.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ReviewDto {
    private Long id;
    private Long userId;
    private String username;
    private Long productId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
