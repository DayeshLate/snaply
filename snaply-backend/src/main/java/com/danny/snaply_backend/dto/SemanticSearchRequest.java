package com.danny.snaply_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SemanticSearchRequest {
    private String query;
    private Long folderId;
    private Long groupId;
    private Double minSimilarity;
    private Integer limit;
    private String startDate;
    private String endDate;
}

