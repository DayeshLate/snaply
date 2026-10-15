package com.danny.snaply_backend.dto;

import java.math.BigInteger;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SemanticSearchResultDTO {
    private Long mediaId;
    private String fileName;
    private String fileUrl;
    private String mimeType;
    private BigInteger fileSize;
    private LocalDateTime createdAt;
    private Long folderId;
    private String folderName;
    private Long groupId;
    private String groupName;
    private Long uploaderId;
    private String uploaderName;
    private String uploaderEmail;
    private String description;
    private String tags;
    private Double similarity;
    private String matchType; // SEMANTIC, EXACT_KEYWORD, HYBRID

    public Long getId() {
        return mediaId;
    }
}
