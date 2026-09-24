package com.danny.snaply_backend.dto;

import java.time.LocalDateTime;

import com.danny.snaply_backend.entity.JoinRequest.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data 
@NoArgsConstructor
@AllArgsConstructor
public class JoinRequestDTO {
    
    public String id;

    public String groupId;

    public String userId;

    public Status status;

    public LocalDateTime requestAt;
    
    public LocalDateTime respondedAt;
}
