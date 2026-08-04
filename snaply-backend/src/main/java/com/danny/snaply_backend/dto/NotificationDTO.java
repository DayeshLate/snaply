package com.danny.snaply_backend.dto;

import java.time.LocalDateTime;

import com.danny.snaply_backend.entity.User;

import lombok.Data;

@Data
public class NotificationDTO {
    
    public Long id;

    public String title;

    public String message;

    public boolean isRead;

    public User user;

    public LocalDateTime createdAt;
}
