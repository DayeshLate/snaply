package com.danny.snaply_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.danny.snaply_backend.config.CacheConstants;
import com.danny.snaply_backend.dto.FolderDTO;
import com.danny.snaply_backend.dto.GroupMembersDTO;
import com.danny.snaply_backend.entity.Folder;
import com.danny.snaply_backend.entity.Group;
import com.danny.snaply_backend.entity.Role;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.repository.FolderReposiory;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FolderService {

    private final FolderReposiory folderReposiory;
    private final MediaMapper mediaMapper;
    private final GroupService groupService;
    private final UserService userService;
    private final GroupMembersService groupMembersService;
    private final GoogleDriveService googleDriveService;

    @CacheEvict(value = {CacheConstants.FOLDERS_BY_ID, CacheConstants.FOLDERS_ALL, CacheConstants.GROUP_BY_ID, CacheConstants.GROUPS_ALL}, allEntries = true)
    public void createFolder(Folder folder){
        folderReposiory.save(folder);
    }

    @Cacheable(value = CacheConstants.FOLDERS_BY_ID, key = "#folderId")
    public FolderDTO getFolderById(Long folderId){
        Folder folder = folderReposiory.findById(folderId)
            .orElseThrow(()-> new RuntimeException("folder not found"));

        return toDTO(folder);
    }

    @Cacheable(value = CacheConstants.FOLDERS_ALL, key = "'all'")
    public List<FolderDTO> getAllFolders(){
        List<Folder> folders = folderReposiory.findAll();
        return folders.stream().map(this::toDTO).toList();
    }

    @CacheEvict(value = {CacheConstants.FOLDERS_BY_ID, CacheConstants.FOLDERS_ALL, CacheConstants.GROUP_BY_ID, CacheConstants.GROUPS_ALL}, allEntries = true)
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
        if (folder.get().getDriveFolderId() != null && folder.get().getOwner().isDriveConnected()) {
            try {
                googleDriveService.deleteFileOrFolder(folder.get().getOwner(), folder.get().getDriveFolderId());
            } catch (Exception ignored) {}
        }
        folderReposiory.deleteById(folderId);
        return "folder deleted successfully";
    }

    @CacheEvict(value = {CacheConstants.FOLDERS_BY_ID, CacheConstants.FOLDERS_ALL, CacheConstants.GROUP_BY_ID, CacheConstants.GROUPS_ALL}, allEntries = true)
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

        GroupMembersDTO groupMembers = groupMembersService.getByUserAndGroup(userService.getCurrentUser().getId(), groupId);

        if(groupMembers.getRole() != Role.ADMIN){
            return "you are not Admin of this group";
        }

        Folder folder = folderReposiory.findById(folderId).orElse(null);
        if (folder != null && folder.getDriveFolderId() != null) {
            User driveUser = folder.getOwner().isDriveConnected() ? folder.getOwner() : folder.getGroup().getUser();
            if (driveUser != null && driveUser.isDriveConnected()) {
                try {
                    googleDriveService.deleteFileOrFolder(driveUser, folder.getDriveFolderId());
                } catch (Exception ignored) {}
            }
        }

        folderReposiory.deleteById(folderId);
        return "folder deleted successfully";
    }

    @CacheEvict(value = {CacheConstants.FOLDERS_BY_ID, CacheConstants.FOLDERS_ALL, CacheConstants.GROUP_BY_ID, CacheConstants.GROUPS_ALL}, allEntries = true)
    public String addFolderInGroup(Long groupId,Folder folder){
        if(!groupService.existGroupById(groupId)){
            return "Group does not exist";
        }
        GroupMembersDTO member = groupMembersService.getByUserAndGroup(userService.getCurrentUser().getId(), groupId);
        if(member.role == Role.VIEWER){
            return "Yoou dont have access to add the folder";
        }
        Folder newFolder = folder;
        Group group = groupService.getGroupById(groupId);
        User currentUser = userService.getCurrentUser();
        newFolder.setGroup(group);
        newFolder.setOwner(currentUser);

        User driveUser = currentUser.isDriveConnected() ? currentUser :
                         (group.getUser().isDriveConnected() ? group.getUser() : null);

        if (driveUser != null && driveUser.isDriveConnected()) {
            try {
                String parentDriveId = group.getDriveFolderId() != null ? group.getDriveFolderId() : driveUser.getDriveRootFolderId();
                String driveFolderId = googleDriveService.createFolder(driveUser, newFolder.getName(), parentDriveId);
                newFolder.setDriveFolderId(driveFolderId);
            } catch (Exception ignored) {}
        }

        folderReposiory.save(newFolder);
        return "Folder added successfully in the group";
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
            .media(dto.getMedia().stream().map(mediaMapper :: toEntity).toList())
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
                .media(entity.getMedia().stream().map(mediaMapper :: toDTO).toList())
                .build();
    }
}
