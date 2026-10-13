package com.danny.snaply_backend.controller;

import java.util.List;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.danny.snaply_backend.dto.MediaDTO;
import com.danny.snaply_backend.dto.MediaDownloadDTO;
import com.danny.snaply_backend.entity.Media;
import com.danny.snaply_backend.service.MediaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MediaDTO> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam("folderId") Long folderId
    ) {
        MediaDTO uploaded = mediaService.uploadMedia(file, folderId);
        return ResponseEntity.ok(uploaded);
    }

    @GetMapping("/download/{mediaId}")
    public ResponseEntity<byte[]> downloadMedia(@PathVariable Long mediaId) {
        MediaDownloadDTO mediaDownload = mediaService.downloadMedia(mediaId);

        String contentType = mediaDownload.mimeType() != null ? mediaDownload.mimeType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename(sanitizeFilename(mediaDownload.fileName()))
                        .build()
                        .toString())
                .contentType(MediaType.parseMediaType(contentType))
                .body(mediaDownload.data());
    }

    @GetMapping("/stream/{mediaId}")
    public ResponseEntity<byte[]> streamMedia(
            @PathVariable Long mediaId,
            @RequestHeader(value = HttpHeaders.RANGE, required = false) String rangeHeader
    ) {
        MediaDownloadDTO mediaDownload = mediaService.downloadMedia(mediaId);

        String contentType = mediaDownload.mimeType() != null ? mediaDownload.mimeType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        byte[] data = mediaDownload.data();
        if (data == null) {
            data = new byte[0];
        }
        long totalLength = data.length;

        if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
            String rangeSpec = rangeHeader.substring(6).trim();
            long start = 0;
            long end = totalLength > 0 ? totalLength - 1 : 0;

            if (rangeSpec.contains("-")) {
                String[] parts = rangeSpec.split("-", -1);
                try {
                    if (!parts[0].isEmpty()) {
                        start = Long.parseLong(parts[0]);
                    }
                    if (parts.length > 1 && !parts[1].isEmpty()) {
                        end = Long.parseLong(parts[1]);
                    }
                } catch (NumberFormatException ignored) {}
            }

            if (start > end || start >= totalLength) {
                return ResponseEntity.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
                        .header(HttpHeaders.CONTENT_RANGE, "bytes */" + totalLength)
                        .build();
            }

            end = Math.min(end, totalLength - 1);
            int contentLength = (int) (end - start + 1);
            byte[] rangeData = new byte[contentLength];
            System.arraycopy(data, (int) start, rangeData, 0, contentLength);

            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.inline()
                            .filename(sanitizeFilename(mediaDownload.fileName()))
                            .build()
                            .toString())
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .header(HttpHeaders.CONTENT_RANGE, String.format("bytes %d-%d/%d", start, end, totalLength))
                    .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(contentLength))
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(rangeData);
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.inline()
                        .filename(sanitizeFilename(mediaDownload.fileName()))
                        .build()
                        .toString())
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(totalLength))
                .contentType(MediaType.parseMediaType(contentType))
                .body(data);
    }

    @GetMapping("/get/{mediaId}")
    public ResponseEntity<MediaDTO> getMediaById(@PathVariable Long mediaId) {
        return ResponseEntity.ok(mediaService.getMediaById(mediaId));
    }

    @PostMapping("/createMedia")
    public ResponseEntity<String> createMedia(@RequestBody Media media){
        String result = mediaService.createMedia(media);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete/{mediaId}")
    public ResponseEntity<String> deleteMedia(@PathVariable Long mediaId){
        String result = mediaService.deleteMedia(mediaId);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/update/{mediaId}")
    public ResponseEntity<MediaDTO> updateMedia(
            @PathVariable Long mediaId,
            @RequestBody(required = false) UpdateMediaRequest request,
            @RequestParam(required = false) String fileName,
            @RequestParam(required = false) Long folderId
    ) {
        String finalName = request != null && request.fileName() != null ? request.fileName() : fileName;
        Long finalFolderId = request != null && request.folderId() != null ? request.folderId() : folderId;
        MediaDTO updated = mediaService.updateMedia(mediaId, finalName, finalFolderId);
        return ResponseEntity.ok(updated);
    }

    public record UpdateMediaRequest(String fileName, Long folderId) {}
    
    @PostMapping("/getCount/{folderId}")
    public ResponseEntity<Long> getMediaCountByFolder(@PathVariable Long folderId){
        Long count = mediaService.getCountOfMediaInFolder(folderId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/getCount/{folderId}")
    public ResponseEntity<Long> getMediaCountByFolderGet(@PathVariable Long folderId){
        Long count = mediaService.getCountOfMediaInFolder(folderId);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/getAllMedia/{folderId}")
    public ResponseEntity<List<MediaDTO>> getAllMedaByFolder(@PathVariable Long folderId){
        List<MediaDTO> media = mediaService.getAllMediaByFolder(folderId);
        return ResponseEntity.ok(media);
    }

    @GetMapping("/getAllMedia/{folderId}")
    public ResponseEntity<List<MediaDTO>> getAllMediaByFolderGet(@PathVariable Long folderId){
        List<MediaDTO> media = mediaService.getAllMediaByFolder(folderId);
        return ResponseEntity.ok(media);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<MediaDTO>> getAllMediaByGroup(@PathVariable Long groupId) {
        List<MediaDTO> media = mediaService.getAllMediaByGroup(groupId);
        return ResponseEntity.ok(media);
    }

    private String sanitizeFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            return "file";
        }
        return filename.replaceAll("[\\r\\n\"\\\\]", "_").trim();
    }
}
