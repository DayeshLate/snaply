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
        String fileUrl = entity.getFileUrl();
        if (fileUrl == null || fileUrl.contains("drive.google.com") || (entity.getDriveFileId() != null && entity.getDriveFileId().startsWith("local:"))) {
            fileUrl = "/media/stream/" + entity.getId();
        }
        Long uId = null;
        String uName = null;
        String uEmail = null;
        if (entity.getUplodedBy() != null) {
            try {
                uId = entity.getUplodedBy().getId();
                uName = entity.getUplodedBy().getName();
                uEmail = entity.getUplodedBy().getEmail();
            } catch (Exception ignored) {}
        }
        Long fId = null;
        String fName = null;
        Long gId = null;
        String gName = null;
        if (entity.getFolder() != null) {
            try {
                fId = entity.getFolder().getId();
                fName = entity.getFolder().getName();
                if (entity.getFolder().getGroup() != null) {
                    gId = entity.getFolder().getGroup().getId();
                    gName = entity.getFolder().getGroup().getName();
                }
            } catch (Exception ignored) {}
        }
        return MediaDTO.builder()
            .id(entity.getId())
            .fileName(entity.getFileName())
            .mimeType(entity.getMimeType())
            .fileSize(entity.getFileSize())
            .driveFileId(entity.getDriveFileId())
            .fileUrl(fileUrl)
            .createdAt(entity.getCreatedAt())
            .uploadedById(uId)
            .uploadedByName(uName)
            .uploadedByEmail(uEmail)
            .folderId(fId)
            .folderName(fName)
            .groupId(gId)
            .groupName(gName)
            .uplodedBy(entity.getUplodedBy())
            .folder(entity.getFolder())
            .build();
    }
}
