package com.danny.snaply_backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.danny.snaply_backend.dto.FolderDTO;
import com.danny.snaply_backend.entity.Folder;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FolderMapper {

    private final MediaMapper mediaMapper;

    public Folder toEntity(FolderDTO dto){
        if (dto == null) return null;
        return Folder.builder()
            .id(dto.getId())
            .name(dto.getName())
            .parentFolderId(dto.getParentFolderId())
            .driveFolderId(dto.getDriveFolderId())
            .group(dto.getGroup())
            .owner(dto.getUser())
            .createdAt(dto.getCreatedAt())
            .media(dto.getMedia() == null ? new ArrayList<>() : dto.getMedia().stream().map(mediaMapper::toEntity).toList())
            .build();
    }

    public FolderDTO toDTO(Folder entity){
        if (entity == null) return null;

        Long groupId = null;
        String groupName = null;
        if (entity.getGroup() != null) {
            try {
                groupId = entity.getGroup().getId();
                groupName = entity.getGroup().getName();
            } catch (Exception ignored) {}
        }

        Long ownerId = null;
        String ownerName = null;
        if (entity.getOwner() != null) {
            try {
                ownerId = entity.getOwner().getId();
                ownerName = entity.getOwner().getName();
            } catch (Exception ignored) {}
        }

        List<com.danny.snaply_backend.dto.MediaDTO> mediaList = new ArrayList<>();
        try {
            if (entity.getMedia() != null && org.hibernate.Hibernate.isInitialized(entity.getMedia())) {
                mediaList = entity.getMedia().stream().map(mediaMapper::toDTO).toList();
            }
        } catch (Exception ignored) {}

        return FolderDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .parentFolderId(entity.getParentFolderId())
                .driveFolderId(entity.getDriveFolderId())
                .groupId(groupId)
                .groupName(groupName)
                .ownerId(ownerId)
                .ownerName(ownerName)
                .mediaCount((long) mediaList.size())
                .group(entity.getGroup())
                .user(entity.getOwner())
                .createdAt(entity.getCreatedAt())
                .media(mediaList)
                .build();
    }
}
