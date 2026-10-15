package com.danny.snaply_backend.repository;

import java.math.BigInteger;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.danny.snaply_backend.dto.MediaEmbeddingRecord;
import com.danny.snaply_backend.dto.SemanticSearchResultDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
@RequiredArgsConstructor
public class MediaEmbeddingRepository {

    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public void upsert(MediaEmbeddingRecord record) {
        String vectorStr = toVectorString(record.getEmbedding());

        String sql = """
            INSERT INTO media_embeddings (
                media_id, folder_id, group_id, uploaded_by_id, file_name, mime_type, file_size,
                description, tags, embedding, embedding_dimension, model_name, status, retry_count,
                last_error, content_hash, updated_at
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, CAST(? AS vector), ?, ?, ?, ?, ?, ?, NOW()
            )
            ON CONFLICT (media_id) DO UPDATE SET
                folder_id = EXCLUDED.folder_id,
                group_id = EXCLUDED.group_id,
                uploaded_by_id = EXCLUDED.uploaded_by_id,
                file_name = EXCLUDED.file_name,
                mime_type = EXCLUDED.mime_type,
                file_size = EXCLUDED.file_size,
                description = COALESCE(EXCLUDED.description, media_embeddings.description),
                tags = COALESCE(EXCLUDED.tags, media_embeddings.tags),
                embedding = COALESCE(EXCLUDED.embedding, media_embeddings.embedding),
                embedding_dimension = EXCLUDED.embedding_dimension,
                model_name = EXCLUDED.model_name,
                status = EXCLUDED.status,
                retry_count = EXCLUDED.retry_count,
                last_error = EXCLUDED.last_error,
                content_hash = EXCLUDED.content_hash,
                updated_at = NOW();
        """;

        jdbcTemplate.update(sql,
                record.getMediaId(),
                record.getFolderId(),
                record.getGroupId(),
                record.getUploadedById(),
                record.getFileName(),
                record.getMimeType(),
                record.getFileSize(),
                record.getDescription(),
                record.getTags(),
                vectorStr,
                record.getEmbeddingDimension() != null ? record.getEmbeddingDimension() : 768,
                record.getModelName(),
                record.getStatus(),
                record.getRetryCount() != null ? record.getRetryCount() : 0,
                record.getLastError(),
                record.getContentHash()
        );
    }

    public void updateStatus(Long mediaId, String status, String lastError) {
        String sql = """
            UPDATE media_embeddings
            SET status = ?,
                last_error = ?,
                retry_count = CASE WHEN ? = 'FAILED' THEN retry_count + 1 ELSE retry_count END,
                updated_at = NOW()
            WHERE media_id = ?
        """;
        jdbcTemplate.update(sql, status, lastError, status, mediaId);
    }

    public Optional<MediaEmbeddingRecord> findByMediaId(Long mediaId) {
        String sql = "SELECT * FROM media_embeddings WHERE media_id = ?";
        List<MediaEmbeddingRecord> results = jdbcTemplate.query(sql, new MediaEmbeddingRowMapper(), mediaId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public List<Long> findPendingOrRetryableMediaIds(int limit, int maxRetries) {
        String sql = """
            SELECT media_id FROM media_embeddings
            WHERE status = 'PENDING'
               OR (status = 'FAILED' AND retry_count < ?)
            ORDER BY created_at ASC
            LIMIT ?
        """;
        return jdbcTemplate.queryForList(sql, Long.class, maxRetries, limit);
    }

    public List<Long> findMediaIdsMissingEmbeddings(int limit) {
        String sql = """
            SELECT m.id FROM media m
            LEFT JOIN media_embeddings me ON m.id = me.media_id
            WHERE me.id IS NULL
            ORDER BY m.created_at DESC
            LIMIT ?
        """;
        return jdbcTemplate.queryForList(sql, Long.class, limit);
    }

    public long countByStatus(String status) {
        String sql = "SELECT COUNT(*) FROM media_embeddings WHERE status = ?";
        Long count = jdbcTemplate.queryForObject(sql, Long.class, status);
        return count != null ? count : 0L;
    }

    public long countTotal() {
        String sql = "SELECT COUNT(*) FROM media_embeddings";
        Long count = jdbcTemplate.queryForObject(sql, Long.class);
        return count != null ? count : 0L;
    }

    public void resetFailedEmbeddings() {
        String sql = "UPDATE media_embeddings SET status = 'PENDING', last_error = NULL WHERE status = 'FAILED'";
        jdbcTemplate.update(sql);
    }

    public List<SemanticSearchResultDTO> searchSemantic(
            float[] queryVector,
            List<Long> accessibleGroupIds,
            Long folderId,
            Long groupId,
            String queryText,
            Double minSimilarity,
            int limit,
            LocalDateTime startDate,
            LocalDateTime endDate
    ) {
        if (accessibleGroupIds == null || accessibleGroupIds.isEmpty()) {
            return Collections.emptyList();
        }

        String vectorStr = toVectorString(queryVector);
        double threshold = (minSimilarity != null && minSimilarity >= 0.0 && minSimilarity <= 1.0) ? minSimilarity : 0.25;
        int boundedLimit = Math.min(Math.max(limit, 1), 100);

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("vectorStr", vectorStr);
        params.addValue("accessibleGroupIds", accessibleGroupIds);
        params.addValue("minSimilarity", threshold);
        params.addValue("limit", boundedLimit);

        StringBuilder sql = new StringBuilder("""
            SELECT me.media_id,
                   m.file_name,
                   m.file_url,
                   m.mime_type,
                   m.file_size,
                   m.created_at,
                   me.folder_id,
                   f.name AS folder_name,
                   me.group_id,
                   g.name AS group_name,
                   u.id AS uploader_id,
                   u.name AS uploader_name,
                   u.email AS uploader_email,
                   me.description,
                   me.tags,
                   (1.0 - (me.embedding <=> CAST(:vectorStr AS vector))) AS similarity,
                   'SEMANTIC' AS match_type
            FROM media_embeddings me
            JOIN media m ON me.media_id = m.id
            JOIN folder f ON me.folder_id = f.id
            JOIN groups g ON me.group_id = g.id
            JOIN users u ON me.uploaded_by_id = u.id
            WHERE me.status = 'COMPLETED'
              AND me.embedding IS NOT NULL
              AND me.group_id IN (:accessibleGroupIds)
              AND (1.0 - (me.embedding <=> CAST(:vectorStr AS vector))) >= :minSimilarity
        """);

        if (groupId != null) {
            sql.append(" AND me.group_id = :groupId");
            params.addValue("groupId", groupId);
        }

        if (folderId != null) {
            sql.append(" AND me.folder_id = :folderId");
            params.addValue("folderId", folderId);
        }

        if (startDate != null) {
            sql.append(" AND m.created_at >= :startDate");
            params.addValue("startDate", Timestamp.valueOf(startDate));
        }

        if (endDate != null) {
            sql.append(" AND m.created_at <= :endDate");
            params.addValue("endDate", Timestamp.valueOf(endDate));
        }

        sql.append(" ORDER BY (me.embedding <=> CAST(:vectorStr AS vector)) ASC LIMIT :limit");

        List<SemanticSearchResultDTO> results = namedParameterJdbcTemplate.query(
                sql.toString(),
                params,
                new SemanticSearchResultRowMapper()
        );

        // Keyword fallback boost: if queryText matches file_name, description, or tags, mark as HYBRID / EXACT
        if (queryText != null && !queryText.isBlank() && results.size() < boundedLimit) {
            List<SemanticSearchResultDTO> keywordResults = searchKeywordFallback(
                    queryText.trim(),
                    accessibleGroupIds,
                    folderId,
                    groupId,
                    boundedLimit - results.size(),
                    startDate,
                    endDate,
                    results.stream().map(SemanticSearchResultDTO::getMediaId).toList()
            );
            results.addAll(keywordResults);
        }

        return results;
    }

    private List<SemanticSearchResultDTO> searchKeywordFallback(
            String queryText,
            List<Long> accessibleGroupIds,
            Long folderId,
            Long groupId,
            int limit,
            LocalDateTime startDate,
            LocalDateTime endDate,
            List<Long> excludeMediaIds
    ) {
        if (limit <= 0 || accessibleGroupIds == null || accessibleGroupIds.isEmpty()) {
            return Collections.emptyList();
        }

        MapSqlParameterSource params = new MapSqlParameterSource();
        params.addValue("pattern", "%" + queryText.toLowerCase() + "%");
        params.addValue("accessibleGroupIds", accessibleGroupIds);
        params.addValue("limit", limit);

        StringBuilder sql = new StringBuilder("""
            SELECT me.media_id,
                   m.file_name,
                   m.file_url,
                   m.mime_type,
                   m.file_size,
                   m.created_at,
                   me.folder_id,
                   f.name AS folder_name,
                   me.group_id,
                   g.name AS group_name,
                   u.id AS uploader_id,
                   u.name AS uploader_name,
                   u.email AS uploader_email,
                   me.description,
                   me.tags,
                   0.85 AS similarity,
                   'KEYWORD' AS match_type
            FROM media_embeddings me
            JOIN media m ON me.media_id = m.id
            JOIN folder f ON me.folder_id = f.id
            JOIN groups g ON me.group_id = g.id
            JOIN users u ON me.uploaded_by_id = u.id
            WHERE me.group_id IN (:accessibleGroupIds)
              AND (
                  LOWER(m.file_name) LIKE :pattern
                  OR LOWER(COALESCE(me.description, '')) LIKE :pattern
                  OR LOWER(COALESCE(me.tags, '')) LIKE :pattern
              )
        """);

        if (excludeMediaIds != null && !excludeMediaIds.isEmpty()) {
            sql.append(" AND me.media_id NOT IN (:excludeMediaIds)");
            params.addValue("excludeMediaIds", excludeMediaIds);
        }

        if (groupId != null) {
            sql.append(" AND me.group_id = :groupId");
            params.addValue("groupId", groupId);
        }

        if (folderId != null) {
            sql.append(" AND me.folder_id = :folderId");
            params.addValue("folderId", folderId);
        }

        if (startDate != null) {
            sql.append(" AND m.created_at >= :startDate");
            params.addValue("startDate", Timestamp.valueOf(startDate));
        }

        if (endDate != null) {
            sql.append(" AND m.created_at <= :endDate");
            params.addValue("endDate", Timestamp.valueOf(endDate));
        }

        sql.append(" ORDER BY m.created_at DESC LIMIT :limit");

        return namedParameterJdbcTemplate.query(sql.toString(), params, new SemanticSearchResultRowMapper());
    }

    private String toVectorString(float[] vector) {
        if (vector == null || vector.length == 0) return null;
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < vector.length; i++) {
            if (i > 0) sb.append(',');
            sb.append(vector[i]);
        }
        sb.append(']');
        return sb.toString();
    }

    private static class MediaEmbeddingRowMapper implements RowMapper<MediaEmbeddingRecord> {
        @Override
        public MediaEmbeddingRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
            Timestamp created = rs.getTimestamp("created_at");
            Timestamp updated = rs.getTimestamp("updated_at");

            return MediaEmbeddingRecord.builder()
                    .id(rs.getLong("id"))
                    .mediaId(rs.getLong("media_id"))
                    .folderId(rs.getLong("folder_id"))
                    .groupId(rs.getLong("group_id"))
                    .uploadedById(rs.getLong("uploaded_by_id"))
                    .fileName(rs.getString("file_name"))
                    .mimeType(rs.getString("mime_type"))
                    .fileSize(rs.getObject("file_size") != null ? rs.getLong("file_size") : null)
                    .description(rs.getString("description"))
                    .tags(rs.getString("tags"))
                    .embeddingDimension(rs.getInt("embedding_dimension"))
                    .modelName(rs.getString("model_name"))
                    .status(rs.getString("status"))
                    .retryCount(rs.getInt("retry_count"))
                    .lastError(rs.getString("last_error"))
                    .contentHash(rs.getString("content_hash"))
                    .createdAt(created != null ? created.toLocalDateTime() : null)
                    .updatedAt(updated != null ? updated.toLocalDateTime() : null)
                    .build();
        }
    }

    private static class SemanticSearchResultRowMapper implements RowMapper<SemanticSearchResultDTO> {
        @Override
        public SemanticSearchResultDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            Timestamp created = rs.getTimestamp("created_at");
            long fileSizeLong = rs.getLong("file_size");

            return SemanticSearchResultDTO.builder()
                    .mediaId(rs.getLong("media_id"))
                    .fileName(rs.getString("file_name"))
                    .fileUrl(rs.getString("file_url"))
                    .mimeType(rs.getString("mime_type"))
                    .fileSize(BigInteger.valueOf(fileSizeLong))
                    .createdAt(created != null ? created.toLocalDateTime() : null)
                    .folderId(rs.getLong("folder_id"))
                    .folderName(rs.getString("folder_name"))
                    .groupId(rs.getLong("group_id"))
                    .groupName(rs.getString("group_name"))
                    .uploaderId(rs.getLong("uploader_id"))
                    .uploaderName(rs.getString("uploader_name"))
                    .uploaderEmail(rs.getString("uploader_email"))
                    .description(rs.getString("description"))
                    .tags(rs.getString("tags"))
                    .similarity(rs.getDouble("similarity"))
                    .matchType(rs.getString("match_type"))
                    .build();
        }
    }
}

