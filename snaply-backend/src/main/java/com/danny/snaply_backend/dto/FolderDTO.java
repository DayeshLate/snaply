package com.danny.snaply_backend.dto;

import java.time.LocalDateTime;

import com.danny.snaply_backend.entity.Group;
import com.danny.snaply_backend.entity.User;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class FolderDTO {
    
    public long id;

    public String name;

    public String parentFolderId;

    public String driveFolderId;

    public Group group;

    public User user;

    public LocalDateTime createdAt;
}
