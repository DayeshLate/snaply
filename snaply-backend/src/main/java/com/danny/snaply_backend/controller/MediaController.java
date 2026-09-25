package com.danny.snaply_backend.controller;

import java.util.List;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
                        .filename(mediaDownload.fileName())
                        .build()
                        .toString())
                .contentType(MediaType.parseMediaType(contentType))
                .body(mediaDownload.data());
    }

    @GetMapping("/stream/{mediaId}")
    public ResponseEntity<byte[]> streamMedia(@PathVariable Long mediaId) {
        MediaDownloadDTO mediaDownload = mediaService.downloadMedia(mediaId);

        String contentType = mediaDownload.mimeType() != null ? mediaDownload.mimeType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.inline()
                        .filename(mediaDownload.fileName())
                        .build()
                        .toString())
                .contentType(MediaType.parseMediaType(contentType))
                .body(mediaDownload.data());
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
}
