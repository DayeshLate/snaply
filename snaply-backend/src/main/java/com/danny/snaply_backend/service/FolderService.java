package com.danny.snaply_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.danny.snaply_backend.dto.FolderDTO;
import com.danny.snaply_backend.entity.Folder;
import com.danny.snaply_backend.repository.FolderReposiory;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FolderService {

    private final FolderReposiory folderReposiory;

    public void createFolder(Folder folder){
        folderReposiory.save(folder);
    }
    
    public Folder toEntity(FolderDTO dto){
        return Folder.builder()
            .id(dto.getId())
            .name(dto.getName())
            .parentFolderId(dto.getParentFolderId())
            .driveFolderId(dto.getDriveFolderId())
            .group(dto.getGroup())
            .owner(dto.getUser())
            .createdAt(dto.getCreatedAt())
            .build();
    }

    public FolderDTO toDTO(Folder entity){
        return FolderDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .parentFolderId(entity.getParentFolderId())
                .driveFolderId(entity.getDriveFolderId())
                .group(entity.getGroup())
                .user(entity.getOwner())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
