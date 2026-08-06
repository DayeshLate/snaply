package com.danny.snaply_backend.dto;

import com.danny.snaply_backend.entity.User;

public record AuthResponse(
        String token,
        User user,
        String message
) {
}