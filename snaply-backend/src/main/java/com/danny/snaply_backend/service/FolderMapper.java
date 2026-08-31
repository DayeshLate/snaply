package com.danny.snaply_backend.service;

import java.util.ArrayList;

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
        FolderDTO dto = FolderDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .parentFolderId(entity.getParentFolderId())
                .driveFolderId(entity.getDriveFolderId())
                .group(entity.getGroup())
                .user(entity.getOwner())
                .createdAt(entity.getCreatedAt())
                .media(entity.getMedia() == null ? new ArrayList<>() : entity.getMedia().stream().map(mediaMapper::toDTO).toList())
                .build();

        return dto;
    }
}
