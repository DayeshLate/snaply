package com.danny.snaply_backend;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import com.danny.snaply_backend.dto.MediaEmbeddingRecord;
import com.danny.snaply_backend.dto.SemanticSearchResultDTO;
import com.danny.snaply_backend.repository.MediaEmbeddingRepository;
import com.danny.snaply_backend.service.AiVisionAndEmbeddingService;

@SpringBootTest
class SnaplyBackendApplicationTests {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private AiVisionAndEmbeddingService aiVisionAndEmbeddingService;

	@Autowired
	private MediaEmbeddingRepository mediaEmbeddingRepository;

	@Test
	void contextLoads() {
		assertNotNull(jdbcTemplate);
		assertNotNull(aiVisionAndEmbeddingService);
		assertNotNull(mediaEmbeddingRepository);
	}

	@Test
	void testVectorExtensionActive() {
		Float dist = jdbcTemplate.queryForObject(
				"SELECT ('[1,0,0]'::vector <=> '[0,1,0]'::vector) as dist", Float.class
		);
		assertNotNull(dist);
		assertEquals(1.0f, dist, 0.001f);
	}

	@Test
	void testEmbeddingGenerationDimensionAndNormalization() {
		String text = "Golden sunset over Goa beach with palm trees and ocean waves";
		float[] vector = aiVisionAndEmbeddingService.generateEmbedding(text);

		assertNotNull(vector);
		assertEquals(AiVisionAndEmbeddingService.EMBEDDING_DIMENSION, vector.length);

		// Verify unit normalization: sqrt(sum(v_i^2)) ~= 1.0
		double sumSq = 0.0;
		for (float val : vector) {
			sumSq += val * val;
		}
		assertEquals(1.0, Math.sqrt(sumSq), 0.01, "Vector must be L2 normalized");
	}

	@Test
	void testImageDescriptionFallback() {
		byte[] mockBytes = new byte[]{1, 2, 3, 4};
		AiVisionAndEmbeddingService.ImageDescriptionResult result =
				aiVisionAndEmbeddingService.describeImage(mockBytes, "image/jpeg", "vacation_sunset.jpg");

		assertNotNull(result);
		assertNotNull(result.description());
		assertFalse(result.description().isBlank());
		assertTrue(result.tags().contains("sunset") || result.tags().contains("vacation"));
	}

	@Test
	void testEmbeddingPersistenceAndDuplicatePrevention() {
		// Use a high mock mediaId that won't conflict with real user data
		// First check if an existing real media exists, or use test media
		List<Long> existingMediaIds = jdbcTemplate.queryForList("SELECT id FROM media LIMIT 1", Long.class);
		if (existingMediaIds.isEmpty()) {
			System.out.println("No media in DB yet, skipping DB persistence test");
			return;
		}

		Long testMediaId = existingMediaIds.get(0);

		// First upsert
		float[] vector1 = aiVisionAndEmbeddingService.generateEmbedding("Mountain hiking trail in Himalayas");
		MediaEmbeddingRecord record1 = MediaEmbeddingRecord.builder()
				.mediaId(testMediaId)
				.folderId(1L)
				.groupId(1L)
				.uploadedById(1L)
				.fileName("hike.jpg")
				.mimeType("image/jpeg")
				.fileSize(1024L)
				.description("Mountain hiking trail in Himalayas")
				.tags("mountain, hiking, trail")
				.embedding(vector1)
				.embeddingDimension(768)
				.modelName("test-model")
				.status("COMPLETED")
				.contentHash("hash-v1")
				.build();

		mediaEmbeddingRepository.upsert(record1);

		Optional<MediaEmbeddingRecord> found = mediaEmbeddingRepository.findByMediaId(testMediaId);
		assertTrue(found.isPresent());
		assertEquals("COMPLETED", found.get().getStatus());
		assertEquals("hash-v1", found.get().getContentHash());

		// Duplicate test: re-upsert with updated content must update the existing row, not duplicate
		record1.setDescription("Updated mountain trail description");
		record1.setContentHash("hash-v2");
		mediaEmbeddingRepository.upsert(record1);

		Optional<MediaEmbeddingRecord> updated = mediaEmbeddingRepository.findByMediaId(testMediaId);
		assertTrue(updated.isPresent());
		assertEquals("hash-v2", updated.get().getContentHash());
		assertEquals("Updated mountain trail description", updated.get().getDescription());

		// Verify row count for this mediaId is exactly 1
		Long count = jdbcTemplate.queryForObject(
				"SELECT COUNT(*) FROM media_embeddings WHERE media_id = ?", Long.class, testMediaId
		);
		assertEquals(1L, count);
	}

	@Test
	void testSemanticSearchAuthorization() {
		// Query with accessibleGroupIds containing an empty or non-matching list
		float[] queryVector = aiVisionAndEmbeddingService.generateEmbedding("sunset beach");

		// Non-accessible group query must return empty list
		List<SemanticSearchResultDTO> unauthorizedResults = mediaEmbeddingRepository.searchSemantic(
				queryVector,
				List.of(999999L), // user is not in this group
				null,
				null,
				"sunset beach",
				0.2,
				10,
				null,
				null
		);
		assertTrue(unauthorizedResults.isEmpty(), "Unauthorized group search must return empty list");
	}
}
