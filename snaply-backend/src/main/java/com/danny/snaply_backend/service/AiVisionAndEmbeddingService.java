package com.danny.snaply_backend.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AiVisionAndEmbeddingService {

    public static final int EMBEDDING_DIMENSION = 768;

    @Value("${snaply.ai.provider:gemini}")
    private String configuredProvider;

    @Value("${snaply.ai.gemini.api-key:${GEMINI_API_KEY:${GOOGLE_API_KEY:}}}")
    private String geminiApiKey;

    @Value("${snaply.ai.gemini.vision-model:gemini-2.0-flash}")
    private String geminiVisionModel;

    @Value("${snaply.ai.gemini.embedding-model:text-embedding-004}")
    private String geminiEmbeddingModel;

    @Value("${snaply.ai.openai.api-key:${OPENAI_API_KEY:}}")
    private String openaiApiKey;

    @Value("${snaply.ai.openai.vision-model:gpt-4o-mini}")
    private String openaiVisionModel;

    @Value("${snaply.ai.openai.embedding-model:text-embedding-3-small}")
    private String openaiEmbeddingModel;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public record ImageDescriptionResult(String description, String tags, String modelName) {}

    public ImageDescriptionResult describeImage(byte[] imageBytes, String mimeType, String fileName) {
        if (hasGeminiKey()) {
            try {
                return describeImageWithGemini(imageBytes, mimeType, fileName);
            } catch (Exception e) {
                log.warn("Gemini vision API call failed ({}), falling back to local descriptor", e.getMessage());
            }
        } else if (hasOpenAiKey()) {
            try {
                return describeImageWithOpenAI(imageBytes, mimeType, fileName);
            } catch (Exception e) {
                log.warn("OpenAI vision API call failed ({}), falling back to local descriptor", e.getMessage());
            }
        }

        return describeImageFallback(fileName, mimeType);
    }

    public float[] generateEmbedding(String text) {
        if (text == null || text.isBlank()) {
            return new float[EMBEDDING_DIMENSION];
        }

        if (hasGeminiKey()) {
            try {
                return generateEmbeddingWithGemini(text);
            } catch (Exception e) {
                log.warn("Gemini embedding API call failed ({}), falling back to deterministic vectorizer", e.getMessage());
            }
        } else if (hasOpenAiKey()) {
            try {
                return generateEmbeddingWithOpenAI(text);
            } catch (Exception e) {
                log.warn("OpenAI embedding API call failed ({}), falling back to deterministic vectorizer", e.getMessage());
            }
        }

        return generateDeterministicVector(text);
    }

    public String getActiveProviderName() {
        if (hasGeminiKey()) return "Google Gemini (" + geminiVisionModel + " / " + geminiEmbeddingModel + ")";
        if (hasOpenAiKey()) return "OpenAI (" + openaiVisionModel + " / " + openaiEmbeddingModel + ")";
        return "Deterministic Semantic Vectorizer (Local Fallback - Ready for Gemini API Key)";
    }

    public String getVisionModelName() {
        if (hasGeminiKey()) return geminiVisionModel;
        if (hasOpenAiKey()) return openaiVisionModel;
        return "local-heuristic-v1";
    }

    public String getEmbeddingModelName() {
        if (hasGeminiKey()) return geminiEmbeddingModel;
        if (hasOpenAiKey()) return openaiEmbeddingModel;
        return "local-hash-vector-768";
    }

    private boolean hasGeminiKey() {
        return geminiApiKey != null && !geminiApiKey.trim().isBlank();
    }

    private boolean hasOpenAiKey() {
        return openaiApiKey != null && !openaiApiKey.trim().isBlank();
    }

    // --- Google Gemini Integration ---

    private ImageDescriptionResult describeImageWithGemini(byte[] imageBytes, String mimeType, String fileName) throws Exception {
        String effectiveMime = (mimeType != null && mimeType.startsWith("image/")) ? mimeType : "image/jpeg";
        String base64Data = Base64.getEncoder().encodeToString(imageBytes);

        String url = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                geminiVisionModel, geminiApiKey.trim()
        );

        String prompt = "You are an AI photo librarian for Snaply. Analyze this uploaded photograph thoroughly. " +
                "Describe what is happening in the scene: the subjects (people, animals, objects), scenery, setting, lighting, colors, emotions, landmarks, backdrop, and activities. " +
                "Keep the description natural, detailed, and directly search-relevant. " +
                "On the final line, output: 'Keywords: <5 to 10 comma-separated keywords>'.";

        Map<String, Object> inlineData = Map.of(
                "mimeType", effectiveMime,
                "data", base64Data
        );
        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> inlinePart = Map.of("inlineData", inlineData);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(textPart, inlinePart))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.2,
                        "maxOutputTokens", 400
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        JsonNode root = objectMapper.readTree(response.getBody());

        String generatedText = root.path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText("");

        return parseDescriptionAndTags(generatedText, "gemini-" + geminiVisionModel, fileName);
    }

    private float[] generateEmbeddingWithGemini(String text) throws Exception {
        String url = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:embedContent?key=%s",
                geminiEmbeddingModel, geminiApiKey.trim()
        );

        Map<String, Object> requestBody = Map.of(
                "model", "models/" + geminiEmbeddingModel,
                "content", Map.of(
                        "parts", List.of(Map.of("text", text))
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        JsonNode root = objectMapper.readTree(response.getBody());

        JsonNode valuesNode = root.path("embedding").path("values");
        if (!valuesNode.isArray() || valuesNode.isEmpty()) {
            throw new RuntimeException("Gemini returned empty embedding values");
        }

        float[] vector = new float[EMBEDDING_DIMENSION];
        int size = Math.min(valuesNode.size(), EMBEDDING_DIMENSION);
        for (int i = 0; i < size; i++) {
            vector[i] = (float) valuesNode.get(i).asDouble();
        }
        return normalizeL2(vector);
    }

    // --- OpenAI Integration ---

    private ImageDescriptionResult describeImageWithOpenAI(byte[] imageBytes, String mimeType, String fileName) throws Exception {
        String effectiveMime = (mimeType != null && mimeType.startsWith("image/")) ? mimeType : "image/jpeg";
        String base64Data = Base64.getEncoder().encodeToString(imageBytes);
        String dataUrl = "data:" + effectiveMime + ";base64," + base64Data;

        String prompt = "Describe this photograph in detail for photo gallery search. Focus on objects, people, environment, colors, and activity. End with 'Keywords: tag1, tag2, tag3'.";

        Map<String, Object> userMessage = Map.of(
                "role", "user",
                "content", List.of(
                        Map.of("type", "text", "text", prompt),
                        Map.of("type", "image_url", "image_url", Map.of("url", dataUrl, "detail", "low"))
                )
        );

        Map<String, Object> requestBody = Map.of(
                "model", openaiVisionModel,
                "messages", List.of(userMessage),
                "max_tokens", 400
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey.trim());
        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);

        ResponseEntity<String> response = restTemplate.exchange("https://api.openai.com/v1/chat/completions", HttpMethod.POST, entity, String.class);
        JsonNode root = objectMapper.readTree(response.getBody());
        String content = root.path("choices").path(0).path("message").path("content").asText("");

        return parseDescriptionAndTags(content, "openai-" + openaiVisionModel, fileName);
    }

    private float[] generateEmbeddingWithOpenAI(String text) throws Exception {
        Map<String, Object> requestBody = Map.of(
                "model", openaiEmbeddingModel,
                "input", text,
                "dimensions", EMBEDDING_DIMENSION
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey.trim());
        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);

        ResponseEntity<String> response = restTemplate.exchange("https://api.openai.com/v1/embeddings", HttpMethod.POST, entity, String.class);
        JsonNode root = objectMapper.readTree(response.getBody());
        JsonNode data = root.path("data").path(0).path("embedding");

        float[] vector = new float[EMBEDDING_DIMENSION];
        for (int i = 0; i < Math.min(data.size(), EMBEDDING_DIMENSION); i++) {
            vector[i] = (float) data.get(i).asDouble();
        }
        return normalizeL2(vector);
    }

    // --- Deterministic Local Fallback ---

    private ImageDescriptionResult describeImageFallback(String fileName, String mimeType) {
        String cleanName = (fileName != null) ? fileName.replaceFirst("\\.[^.]+$", "").replaceAll("[_-]+", " ").trim() : "photo";
        String description = String.format("A photograph titled '%s' (%s) saved in Snaply photo vault.", cleanName, mimeType != null ? mimeType : "image");
        String tags = String.join(", ", extractTagsFromFileName(cleanName));
        return new ImageDescriptionResult(description, tags, "local-heuristic-v1");
    }

    public float[] generateDeterministicVector(String text) {
        float[] vector = new float[EMBEDDING_DIMENSION];
        if (text == null || text.isBlank()) {
            return vector;
        }

        String normalized = text.toLowerCase(Locale.ROOT).trim();
        String[] tokens = normalized.split("[\\s,;:.!?\"'()\\[\\]{}]+");

        for (String token : tokens) {
            if (token.isBlank()) continue;
            applyTokenToVector(token, 1.2f, vector);

            // Also hash character n-grams (subwords) for typo-tolerance and semantic stems
            if (token.length() >= 4) {
                for (int i = 0; i <= token.length() - 3; i++) {
                    String trigram = token.substring(i, i + 3);
                    applyTokenToVector(trigram, 0.4f, vector);
                }
            }
        }

        return normalizeL2(vector);
    }

    private void applyTokenToVector(String token, float weight, float[] vector) {
        try {
            MessageDigest md5 = MessageDigest.getInstance("MD5");
            byte[] digest = md5.digest(token.getBytes(StandardCharsets.UTF_8));

            int idx1 = Math.abs(((digest[0] & 0xFF) << 8) | (digest[1] & 0xFF)) % EMBEDDING_DIMENSION;
            int idx2 = Math.abs(((digest[2] & 0xFF) << 8) | (digest[3] & 0xFF)) % EMBEDDING_DIMENSION;
            int idx3 = Math.abs(((digest[4] & 0xFF) << 8) | (digest[5] & 0xFF)) % EMBEDDING_DIMENSION;

            float sign1 = (digest[6] & 1) == 0 ? 1.0f : -1.0f;
            float sign2 = (digest[7] & 1) == 0 ? 1.0f : -1.0f;
            float sign3 = (digest[8] & 1) == 0 ? 1.0f : -1.0f;

            vector[idx1] += sign1 * weight;
            vector[idx2] += sign2 * (weight * 0.7f);
            vector[idx3] += sign3 * (weight * 0.5f);
        } catch (Exception ignored) {}
    }

    private float[] normalizeL2(float[] v) {
        double sumSq = 0.0;
        for (float val : v) {
            sumSq += val * val;
        }
        if (sumSq > 0.0) {
            float norm = (float) Math.sqrt(sumSq);
            for (int i = 0; i < v.length; i++) {
                v[i] /= norm;
            }
        }
        return v;
    }

    private ImageDescriptionResult parseDescriptionAndTags(String rawText, String modelName, String fallbackFileName) {
        if (rawText == null || rawText.isBlank()) {
            return describeImageFallback(fallbackFileName, "image/jpeg");
        }

        String description = rawText.trim();
        String tags = "";

        Pattern pattern = Pattern.compile("(?i)(?:keywords|tags)\\s*:\\s*(.*)$", Pattern.MULTILINE);
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            tags = matcher.group(1).trim();
            description = description.substring(0, matcher.start()).trim();
        }

        if (tags.isBlank()) {
            tags = String.join(", ", extractTagsFromFileName(fallbackFileName));
        }

        return new ImageDescriptionResult(description, tags, modelName);
    }

    private List<String> extractTagsFromFileName(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return List.of("photo", "memory");
        }
        String clean = fileName.replaceFirst("\\.[^.]+$", "").replaceAll("[^a-zA-Z0-9]+", " ").trim();
        String[] words = clean.split("\\s+");
        List<String> tags = new ArrayList<>();
        Set<String> stopWords = Set.of("the", "a", "an", "and", "or", "in", "on", "at", "img", "image", "photo", "pic", "dsc", "screenshot");

        for (String w : words) {
            String lower = w.toLowerCase(Locale.ROOT);
            if (lower.length() > 2 && !stopWords.contains(lower)) {
                tags.add(lower);
            }
        }
        if (tags.isEmpty()) {
            tags.add("memory");
            tags.add("snaply");
        }
        return tags;
    }
}

