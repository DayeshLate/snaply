package com.danny.snaply_backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import com.danny.snaply_backend.dto.FolderDTO;
import com.danny.snaply_backend.dto.GroupMembersDTO;
import com.danny.snaply_backend.entity.Folder;
import com.danny.snaply_backend.entity.Role;
import com.danny.snaply_backend.repository.FolderReposiory;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FolderService {

    private final FolderReposiory folderReposiory;
    private final MediaService mediaService;
    private final GroupService groupService;
    private final UserService userService;
    private final GroupMembersService groupMembersService;

    public void createFolder(Folder folder){
        folderReposiory.save(folder);
    }

    public FolderDTO getFolderById(Long folderId){
        Folder folder = folderReposiory.findById(folderId)
            .orElseThrow(()-> new RuntimeException("folder not found"));

        return toDTO(folder);
    }

    public String deleteFolderByOwner(Long groupId,Long folderId){
        if(!folderReposiory.existsById(folderId)){
            return "folder not found";
        }
        if(!groupService.existGroupById(groupId)){
            return "group is not exist";
        }
        Optional<Folder> folder = folderReposiory.findById(folderId);
        if(folder.get().getOwner() != userService.getCurrentUser()){
            return "you are not ownwer of this group";
        }
        folderReposiory.deleteById(folderId);
        return "folder deleted successfully";
    }

    public String deleteFolderByAdmin(Long groupId, Long folderId){
        if(!folderReposiory.existsById(folderId)){
            return "folder not found";
        }
        if(!groupService.existGroupById(groupId)){
            return "group is not exist";
        }
        if(!groupMembersService.existByUserAndGroup(userService.getCurrentUser().getId(), groupId)){
            return "you are not member of this group";
        }

        GroupMembersDTO groupMembers = groupMembersService.getByUserAndGroup(folderId, groupId);

        if(groupMembers.getRole() != Role.ADMIN){
            return "you are not Admin of this group";
        }
        folderReposiory.deleteById(folderId);
        return "folder deleted successfully";
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
            .media(dto.getMedia().stream().map(mediaService :: toEntity).toList())
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
                .media(entity.getMedia().stream().map(mediaService :: toDTO).toList())
                .build();
    }
}
