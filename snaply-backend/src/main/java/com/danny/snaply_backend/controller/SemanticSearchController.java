package com.danny.snaply_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.danny.snaply_backend.dto.EmbeddingStatusDTO;
import com.danny.snaply_backend.dto.SemanticSearchRequest;
import com.danny.snaply_backend.dto.SemanticSearchResultDTO;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.service.MediaEmbeddingService;
import com.danny.snaply_backend.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class SemanticSearchController {

    private final MediaEmbeddingService mediaEmbeddingService;
    private final UserService userService;

    @PostMapping({"/api/media/search", "/media/search"})
    public ResponseEntity<List<SemanticSearchResultDTO>> searchMedia(
            @RequestBody SemanticSearchRequest request
    ) {
        User currentUser = userService.getCurrentUser();
        List<SemanticSearchResultDTO> results = mediaEmbeddingService.searchSemantic(request, currentUser);
        return ResponseEntity.ok(results);
    }

    @PostMapping({"/api/media/embeddings/index-all", "/media/embeddings/index-all"})
    public ResponseEntity<Map<String, Object>> enqueueAllMissingMedia() {
        int enqueued = mediaEmbeddingService.enqueueAllMissingMedia();
        mediaEmbeddingService.triggerAsyncProcessing();
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Enqueued " + enqueued + " missing media records for AI embedding",
                "enqueuedCount", enqueued
        ));
    }

    @PostMapping({"/api/media/embeddings/process-batch", "/media/embeddings/process-batch"})
    public ResponseEntity<Map<String, Object>> processBatch(
            @RequestParam(defaultValue = "10") int limit
    ) {
        int processed = mediaEmbeddingService.processPendingBatch(Math.min(Math.max(limit, 1), 50));
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "processedCount", processed,
                "message", "Processed " + processed + " media embeddings"
        ));
    }

    @PostMapping({"/api/media/embeddings/retry-failed", "/media/embeddings/retry-failed"})
    public ResponseEntity<Map<String, Object>> retryFailed() {
        mediaEmbeddingService.retryFailedEmbeddings();
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Reset failed embeddings to PENDING and triggered background processing"
        ));
    }

    @GetMapping({"/api/media/embeddings/status", "/media/embeddings/status"})
    public ResponseEntity<EmbeddingStatusDTO> getStatus() {
        EmbeddingStatusDTO status = mediaEmbeddingService.getStatus();
        return ResponseEntity.ok(status);
    }

    @PostMapping({"/api/media/embeddings/index/{mediaId}", "/media/embeddings/index/{mediaId}"})
    public ResponseEntity<Map<String, Object>> indexSingleMedia(
            @PathVariable Long mediaId
    ) {
        boolean success = mediaEmbeddingService.processSingleMedia(mediaId);
        return ResponseEntity.ok(Map.of(
                "mediaId", mediaId,
                "success", success,
                "status", success ? "COMPLETED" : "FAILED"
        ));
    }
}

