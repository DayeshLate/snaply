package com.danny.snaply_backend.controller;

import java.util.List;

import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danny.snaply_backend.dto.MediaDTO;
import com.danny.snaply_backend.entity.Media;
import com.danny.snaply_backend.service.MediaService;

import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @GetMapping("/createMedia")
    public ResponseEntity<String> createMedia(Media media){
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

    @PostMapping("/getAllMedia/{folderId}")
    public ResponseEntity<List<MediaDTO>> getAllMedaByFolder(@PathVariable Long folderId){
        List<MediaDTO> media = mediaService.getAllMediaByFolder(folderId);
        return ResponseEntity.ok(media);
    }

}
