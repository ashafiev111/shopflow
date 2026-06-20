package org.example.magazin.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String email;
    private String fullName;
    private String phone;
    private String address;
}
