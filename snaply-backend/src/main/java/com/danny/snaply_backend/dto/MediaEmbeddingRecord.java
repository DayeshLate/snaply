package com.danny.snaply_backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaEmbeddingRecord {
    private Long id;
    private Long mediaId;
    private Long folderId;
    private Long groupId;
    private Long uploadedById;
    private String fileName;
    private String mimeType;
    private Long fileSize;
    private String description;
    private String tags;
    private float[] embedding;
    private Integer embeddingDimension;
    private String modelName;
    private String status; // PENDING, PROCESSING, COMPLETED, FAILED
    private Integer retryCount;
    private String lastError;
    private String contentHash;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

