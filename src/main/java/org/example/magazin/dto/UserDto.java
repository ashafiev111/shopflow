package org.example.magazin.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String role;
}
