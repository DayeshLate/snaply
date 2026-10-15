package com.danny.snaply_backend.dto;

import java.math.BigInteger;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.danny.snaply_backend.entity.Folder;
import com.danny.snaply_backend.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaDTO {
    
    public Long id;

    public String fileName;

    public String mimeType;

    public BigInteger fileSize;

    public String driveFileId;

    public String fileUrl;

    public LocalDateTime createdAt;

    public Long uploadedById;

    public String uploadedByName;

    public String uploadedByEmail;

    public Long folderId;

    public String folderName;

    public Long groupId;

    public String groupName;

    @JsonIgnore
    public User uplodedBy;

    @JsonIgnore
    public Folder folder;

}
