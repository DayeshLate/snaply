package com.danny.snaply_backend.dto;

import java.time.LocalDateTime;

import com.danny.snaply_backend.entity.Group;
import com.danny.snaply_backend.entity.Role;
import com.danny.snaply_backend.entity.User;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GroupMembersDTO {
    
    public Long id;

    public Role role;

    public Group group;

    public User user;

    public LocalDateTime joinedAt;

    public boolean isAccepted;
}
