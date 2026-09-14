package com.danny.snaply_backend.dto;

import java.math.BigInteger;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.danny.snaply_backend.entity.Folder;
import com.danny.snaply_backend.entity.User;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MediaDTO {
    
    public Long id;

    public String fileName;

    public String mimeType;

    public BigInteger fileSize;

    public String driveFileId;

    public String fileUrl;

    public LocalDateTime createdAt;

    @JsonIgnore
    public User uplodedBy;

    @JsonIgnore
    public Folder folder;

}
