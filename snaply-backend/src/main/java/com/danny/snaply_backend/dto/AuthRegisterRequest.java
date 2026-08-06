package com.danny.snaply_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthRegisterRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @NotBlank String password
) {
}