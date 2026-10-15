package com.danny.snaply_backend.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.danny.snaply_backend.dto.EmbeddingStatusDTO;
import com.danny.snaply_backend.dto.MediaDownloadDTO;
import com.danny.snaply_backend.dto.MediaEmbeddingRecord;
import com.danny.snaply_backend.dto.SemanticSearchRequest;
import com.danny.snaply_backend.dto.SemanticSearchResultDTO;
import com.danny.snaply_backend.entity.GroupMembers;
import com.danny.snaply_backend.entity.Media;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.repository.GroupMembersRepository;
import com.danny.snaply_backend.repository.MediaEmbeddingRepository;
import com.danny.snaply_backend.repository.MediaRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MediaEmbeddingService {

    private final MediaEmbeddingRepository mediaEmbeddingRepository;
    private final MediaRepository mediaRepository;
    private final MediaService mediaService;
    private final AiVisionAndEmbeddingService aiVisionAndEmbeddingService;
    private final GroupMembersRepository groupMembersRepository;

    @Value("${snaply.ai.batch-size:10}")
    private int batchSize;

    @Value("${snaply.ai.max-retries:3}")
    private int maxRetries;

    @Value("${snaply.ai.auto-index.enabled:true}")
    private boolean autoIndexEnabled;

    private final AtomicBoolean isProcessing = new AtomicBoolean(false);

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        if (autoIndexEnabled) {
            log.info("Snaply AI: Checking for unindexed photos on application startup...");
            try {
                enqueueAllMissingMedia();
                triggerAsyncProcessing();
            } catch (Exception e) {
                log.warn("Snaply AI: Startup auto-indexing encountered an issue: {}", e.getMessage());
            }
        }
    }

    public void enqueueMedia(Media media) {
        if (media == null || media.getId() == null) return;

        Media m = media;
        if (m.getFolder() == null || m.getUplodedBy() == null) {
            m = mediaRepository.findByIdWithDetails(media.getId()).orElse(media);
        }

        String contentHash = computeMediaHash(m);
        Optional<MediaEmbeddingRecord> existing = mediaEmbeddingRepository.findByMediaId(m.getId());

        if (existing.isPresent()) {
            MediaEmbeddingRecord record = existing.get();
            if ("COMPLETED".equals(record.getStatus()) && contentHash.equals(record.getContentHash())) {
                log.debug("Media ID {} embedding is up-to-date. Skipping enqueue.", m.getId());
                return;
            }
        }

        Long folderId = m.getFolder() != null ? m.getFolder().getId() : null;
        Long groupId = (m.getFolder() != null && m.getFolder().getGroup() != null) ? m.getFolder().getGroup().getId() : null;
        Long uploadedById = m.getUplodedBy() != null ? m.getUplodedBy().getId() : null;

        MediaEmbeddingRecord record = MediaEmbeddingRecord.builder()
                .mediaId(m.getId())
                .folderId(folderId)
                .groupId(groupId)
                .uploadedById(uploadedById)
                .fileName(m.getFileName())
                .mimeType(m.getMimeType())
                .fileSize(m.getFileSize() != null ? m.getFileSize().longValue() : 0L)
                .status("PENDING")
                .retryCount(0)
                .contentHash(contentHash)
                .embeddingDimension(AiVisionAndEmbeddingService.EMBEDDING_DIMENSION)
                .build();

        mediaEmbeddingRepository.upsert(record);
        log.info("Media ID {} enqueued for AI embedding with status PENDING", m.getId());
        triggerAsyncProcessing();
    }

    @Transactional(readOnly = true)
    public int enqueueAllMissingMedia() {
        List<Long> missingIds = mediaEmbeddingRepository.findMediaIdsMissingEmbeddings(500);
        if (missingIds.isEmpty()) {
            return 0;
        }

        List<Media> mediaList = mediaRepository.findAllWithDetailsByIdIn(missingIds);
        int enqueuedCount = 0;

        for (Media m : mediaList) {
            Long folderId = m.getFolder() != null ? m.getFolder().getId() : null;
            Long groupId = (m.getFolder() != null && m.getFolder().getGroup() != null) ? m.getFolder().getGroup().getId() : null;
            Long uploadedById = m.getUplodedBy() != null ? m.getUplodedBy().getId() : null;

            MediaEmbeddingRecord record = MediaEmbeddingRecord.builder()
                    .mediaId(m.getId())
                    .folderId(folderId)
                    .groupId(groupId)
                    .uploadedById(uploadedById)
                    .fileName(m.getFileName())
                    .mimeType(m.getMimeType())
                    .fileSize(m.getFileSize() != null ? m.getFileSize().longValue() : 0L)
                    .status("PENDING")
                    .retryCount(0)
                    .contentHash(computeMediaHash(m))
                    .embeddingDimension(AiVisionAndEmbeddingService.EMBEDDING_DIMENSION)
                    .build();

            mediaEmbeddingRepository.upsert(record);
            enqueuedCount++;
        }

        if (enqueuedCount > 0) {
            log.info("Enqueued {} missing media records for AI embedding", enqueuedCount);
        }
        return enqueuedCount;
    }

    @Async
    public void triggerAsyncProcessing() {
        processPendingBatch(batchSize);
    }

    @Scheduled(fixedDelayString = "${snaply.ai.auto-index.interval:120000}")
    public void scheduledBatchProcessor() {
        if (!autoIndexEnabled) return;
        processPendingBatch(batchSize);
    }

    public int processPendingBatch(int limit) {
        if (!isProcessing.compareAndSet(false, true)) {
            log.debug("Batch embedding processing is already running in background.");
            return 0;
        }

        int processed = 0;
        try {
            List<Long> mediaIds = mediaEmbeddingRepository.findPendingOrRetryableMediaIds(limit, maxRetries);
            if (mediaIds.isEmpty()) {
                return 0;
            }

            log.info("Processing AI embedding batch of {} media items...", mediaIds.size());

            for (Long mediaId : mediaIds) {
                boolean success = processSingleMedia(mediaId);
                if (success) {
                    processed++;
                }
            }
        } finally {
            isProcessing.set(false);
        }

        return processed;
    }

    public boolean processSingleMedia(Long mediaId) {
        Optional<Media> mediaOpt = mediaRepository.findByIdWithDetails(mediaId);
        if (mediaOpt.isEmpty()) {
            mediaOpt = mediaRepository.findById(mediaId);
        }
        if (mediaOpt.isEmpty()) {
            mediaEmbeddingRepository.updateStatus(mediaId, "FAILED", "Media record no longer exists in database");
            return false;
        }

        Media media = mediaOpt.get();
        mediaEmbeddingRepository.updateStatus(mediaId, "PROCESSING", null);

        try {
            MediaDownloadDTO download = mediaService.downloadMediaInternal(media);
            byte[] fileBytes = download.data();

            if (fileBytes == null || fileBytes.length == 0) {
                throw new RuntimeException("Media content is empty or could not be downloaded from storage");
            }

            // Step 1: Generate AI visual description
            AiVisionAndEmbeddingService.ImageDescriptionResult descResult =
                    aiVisionAndEmbeddingService.describeImage(fileBytes, media.getMimeType(), media.getFileName());

            // Step 2: Build enriched semantic indexing text
            String folderName = media.getFolder() != null ? media.getFolder().getName() : "";
            String groupName = (media.getFolder() != null && media.getFolder().getGroup() != null) ? media.getFolder().getGroup().getName() : "";
            String indexingText = String.format(
                    "Filename: %s. Description: %s. Keywords: %s. Folder: %s. Group: %s.",
                    media.getFileName(),
                    descResult.description(),
                    descResult.tags(),
                    folderName,
                    groupName
            );

            // Step 3: Generate text embedding vector
            float[] vector = aiVisionAndEmbeddingService.generateEmbedding(indexingText);

            Long folderId = media.getFolder() != null ? media.getFolder().getId() : null;
            Long groupId = (media.getFolder() != null && media.getFolder().getGroup() != null) ? media.getFolder().getGroup().getId() : null;
            Long uploadedById = media.getUplodedBy() != null ? media.getUplodedBy().getId() : null;

            // Step 4: Persist in PostgreSQL pgvector table
            MediaEmbeddingRecord record = MediaEmbeddingRecord.builder()
                    .mediaId(media.getId())
                    .folderId(folderId)
                    .groupId(groupId)
                    .uploadedById(uploadedById)
                    .fileName(media.getFileName())
                    .mimeType(media.getMimeType())
                    .fileSize(media.getFileSize() != null ? media.getFileSize().longValue() : (long) fileBytes.length)
                    .description(descResult.description())
                    .tags(descResult.tags())
                    .embedding(vector)
                    .embeddingDimension(AiVisionAndEmbeddingService.EMBEDDING_DIMENSION)
                    .modelName(descResult.modelName())
                    .status("COMPLETED")
                    .retryCount(0)
                    .lastError(null)
                    .contentHash(computeMediaHash(media))
                    .build();

            mediaEmbeddingRepository.upsert(record);
            log.info("Successfully embedded media ID {} ('{}') using model '{}'", mediaId, media.getFileName(), descResult.modelName());
            return true;

        } catch (Exception e) {
            log.error("Failed to process embedding for media ID {}: {}", mediaId, e.getMessage());
            mediaEmbeddingRepository.updateStatus(mediaId, "FAILED", e.getMessage());
            return false;
        }
    }

    public List<SemanticSearchResultDTO> searchSemantic(SemanticSearchRequest request, User currentUser) {
        if (request == null || request.getQuery() == null || request.getQuery().trim().isBlank()) {
            return Collections.emptyList();
        }

        String query = request.getQuery().trim();

        // Security: Get all groups where current user is an accepted member or owner
        List<GroupMembers> memberships = groupMembersRepository.findByUserId(currentUser.getId());
        List<Long> accessibleGroupIds = memberships.stream()
                .filter(GroupMembers::isAccepted)
                .map(m -> m.getGroup().getId())
                .distinct()
                .toList();

        if (accessibleGroupIds.isEmpty()) {
            log.debug("User {} has no accepted group memberships; returning empty search results", currentUser.getEmail());
            return Collections.emptyList();
        }

        // If request specified a group, ensure user has access to it
        if (request.getGroupId() != null && !accessibleGroupIds.contains(request.getGroupId())) {
            throw new RuntimeException("Access Denied: You do not have permission to view media in group " + request.getGroupId());
        }

        // Generate query embedding vector
        float[] queryVector = aiVisionAndEmbeddingService.generateEmbedding(query);

        // Date range parsing
        LocalDateTime startDate = parseDateTime(request.getStartDate(), true);
        LocalDateTime endDate = parseDateTime(request.getEndDate(), false);

        int limit = (request.getLimit() != null && request.getLimit() > 0) ? request.getLimit() : 20;
        Double minSimilarity = request.getMinSimilarity() != null ? request.getMinSimilarity() : 0.25;

        List<SemanticSearchResultDTO> results = mediaEmbeddingRepository.searchSemantic(
                queryVector,
                accessibleGroupIds,
                request.getFolderId(),
                request.getGroupId(),
                query,
                minSimilarity,
                limit,
                startDate,
                endDate
        );

        // Populate dynamic stream URLs
        for (SemanticSearchResultDTO item : results) {
            item.setFileUrl("/media/stream/" + item.getMediaId());
        }

        return results;
    }

    public EmbeddingStatusDTO getStatus() {
        long totalMedia = mediaRepository.count();
        long totalEmbeddings = mediaEmbeddingRepository.countTotal();
        long completed = mediaEmbeddingRepository.countByStatus("COMPLETED");
        long pending = mediaEmbeddingRepository.countByStatus("PENDING");
        long processing = mediaEmbeddingRepository.countByStatus("PROCESSING");
        long failed = mediaEmbeddingRepository.countByStatus("FAILED");

        return EmbeddingStatusDTO.builder()
                .totalMedia(totalMedia)
                .indexedCount(totalEmbeddings)
                .completedCount(completed)
                .pendingCount(pending)
                .processingCount(processing)
                .failedCount(failed)
                .isProcessing(isProcessing.get())
                .activeProvider(aiVisionAndEmbeddingService.getActiveProviderName())
                .visionModel(aiVisionAndEmbeddingService.getVisionModelName())
                .embeddingModel(aiVisionAndEmbeddingService.getEmbeddingModelName())
                .build();
    }

    public void retryFailedEmbeddings() {
        mediaEmbeddingRepository.resetFailedEmbeddings();
        triggerAsyncProcessing();
    }

    private String computeMediaHash(Media media) {
        String base = (media.getDriveFileId() != null ? media.getDriveFileId() : "") +
                "|" + (media.getFileSize() != null ? media.getFileSize().toString() : "") +
                "|" + (media.getFileName() != null ? media.getFileName() : "");
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(base.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception e) {
            return Integer.toHexString(base.hashCode());
        }
    }

    private LocalDateTime parseDateTime(String dateStr, boolean isStart) {
        if (dateStr == null || dateStr.isBlank()) return null;
        try {
            if (dateStr.length() == 10) {
                LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
                return isStart ? date.atStartOfDay() : date.atTime(23, 59, 59);
            }
            return LocalDateTime.parse(dateStr, DateTimeFormatter.ISO_DATE_TIME);
        } catch (Exception e) {
            return null;
        }
    }
}

