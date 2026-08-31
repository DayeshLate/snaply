package com.danny.snaply_backend.service;

import org.springframework.stereotype.Component;

import com.danny.snaply_backend.dto.MediaDTO;
import com.danny.snaply_backend.entity.Media;

@Component
public class MediaMapper {

    public Media toEntity(MediaDTO dto){
        if (dto == null) return null;
        return Media.builder()
            .id(dto.getId())
            .fileName(dto.getFileName())
            .mimeType(dto.getMimeType())
            .fileSize(dto.getFileSize())
            .driveFileId(dto.getDriveFileId())
            .fileUrl(dto.getFileUrl())
            .createdAt(dto.getCreatedAt())
            .uplodedBy(dto.getUplodedBy())
            .folder(dto.getFolder())
            .build();
    }

    public MediaDTO toDTO(Media entity){
        if (entity == null) return null;
        return MediaDTO.builder()
            .id(entity.getId())
            .fileName(entity.getFileName())
            .mimeType(entity.getMimeType())
            .fileSize(entity.getFileSize())
            .driveFileId(entity.getDriveFileId())
            .fileUrl(entity.getFileUrl())
            .createdAt(entity.getCreatedAt())
            .uplodedBy(entity.getUplodedBy())
            .folder(entity.getFolder())
            .build();
    }
}
