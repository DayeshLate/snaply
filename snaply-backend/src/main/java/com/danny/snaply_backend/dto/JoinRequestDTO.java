package com.danny.snaply_backend.dto;

import java.time.LocalDateTime;

import com.danny.snaply_backend.entity.JoinRequest.Status;

import lombok.Builder;
import lombok.Data;

@Builder
@Data 
public class JoinRequestDTO {
    
    public String id;

    public String groupId;

    public String userId;

    public Status status;

    public LocalDateTime requestAt;
    
    public LocalDateTime respondedAt;
}
