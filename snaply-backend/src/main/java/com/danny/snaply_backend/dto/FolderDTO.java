package com.danny.snaply_backend.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonIgnore
    public Group group;

    @JsonIgnore
    public User user;

    public LocalDateTime createdAt;

    @Builder.Default
    public List<MediaDTO> media = new ArrayList<>();
}
