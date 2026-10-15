package com.danny.snaply_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmbeddingStatusDTO {
    private long totalMedia;
    private long indexedCount;
    private long completedCount;
    private long pendingCount;
    private long processingCount;
    private long failedCount;
    private boolean isProcessing;
    private String activeProvider;
    private String visionModel;
    private String embeddingModel;
}

