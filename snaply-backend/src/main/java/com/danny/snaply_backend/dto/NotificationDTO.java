package com.danny.snaply_backend.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.danny.snaply_backend.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    
    public Long id;

    public String title;

    public String message;

    public boolean isRead;

    @JsonIgnore
    public User user;

    public LocalDateTime createdAt;
}
