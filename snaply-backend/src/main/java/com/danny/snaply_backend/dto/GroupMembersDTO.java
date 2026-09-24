package com.danny.snaply_backend.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.danny.snaply_backend.entity.Group;
import com.danny.snaply_backend.entity.Role;
import com.danny.snaply_backend.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupMembersDTO {
    
    public Long id;

    public Role role;

    @JsonIgnore
    public Group group;

    @JsonIgnore
    public User user;

    public LocalDateTime joinedAt;

    public boolean isAccepted;
}
