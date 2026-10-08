package com.danny.snaply_backend.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.danny.snaply_backend.config.CacheConstants;
import com.danny.snaply_backend.dto.FolderDTO;
import com.danny.snaply_backend.dto.GoogleDriveFileDTO;
import com.danny.snaply_backend.dto.GroupMembersDTO;
import com.danny.snaply_backend.dto.MediaDTO;
import com.danny.snaply_backend.dto.MediaDownloadDTO;
import com.danny.snaply_backend.entity.Folder;
import com.danny.snaply_backend.entity.Media;
import com.danny.snaply_backend.entity.Role;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.repository.FolderReposiory;
import com.danny.snaply_backend.repository.MediaRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;
    private final UserService userService;
    private final FolderService folderService;
    private final FolderReposiory folderReposiory;
    private final MediaMapper mediaMapper;
    private final GoogleDriveService googleDriveService;
    private final GroupMembersService groupMembersService;

    @CacheEvict(value = {
        CacheConstants.MEDIA_BY_FOLDER,
        CacheConstants.MEDIA_COUNT_BY_FOLDER,
        CacheConstants.MEDIA_BY_ID,
        CacheConstants.MEDIA_BY_GROUP,
        CacheConstants.FOLDERS_BY_ID,
        CacheConstants.FOLDERS_ALL,
        CacheConstants.GROUP_BY_ID,
        CacheConstants.GROUPS_ALL
    }, allEntries = true)
    @Transactional
    public MediaDTO uploadMedia(MultipartFile file, Long folderId) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Uploaded file is empty");
        }

        Folder folder = folderReposiory.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found with ID: " + folderId));

        User currentUser = userService.getCurrentUser();
        Long groupId = folder.getGroup().getId();

        // Check if user is authorized to upload to this group
        GroupMembersDTO member = null;
        if (groupMembersService.existByUserAndGroup(currentUser.getId(), groupId)) {
            member = groupMembersService.getByUserAndGroup(currentUser.getId(), groupId);
        }

        boolean isGroupOwner = (folder.getGroup().getUser() != null && folder.getGroup().getUser().getId().equals(currentUser.getId()))
                || (member != null && member.isAccepted() && member.getRole() == Role.OWNER);

        if (!isGroupOwner) {
            if (member == null || !member.isAccepted()) {
                throw new RuntimeException("Access Denied: You are not an active member of this group");
            }
            if (member.getRole() == Role.VIEWER) {
                throw new RuntimeException("Access Denied: Viewers do not have permission to push or upload files to this group");
            }
        }

        // Determine which Google Drive account to store the file into (prefer group creator who has Snaply root folder)
        User driveUser = (folder.getGroup().getUser() != null && folder.getGroup().getUser().isDriveConnected())
                ? folder.getGroup().getUser()
                : (folder.getOwner() != null && folder.getOwner().isDriveConnected() ? folder.getOwner()
                : (currentUser.isDriveConnected() ? currentUser : null));

        if (driveUser == null || !driveUser.isDriveConnected()) {
            throw new RuntimeException("No connected Google Drive account found to store this file. The group owner must connect Google Drive.");
        }

        String targetDriveFolder = folder.getDriveFolderId();
        if (targetDriveFolder == null || targetDriveFolder.isBlank()) {
            targetDriveFolder = folder.getGroup().getDriveFolderId();
        }
        if (targetDriveFolder == null || targetDriveFolder.isBlank()) {
            targetDriveFolder = googleDriveService.getOrCreateSnaplyRootFolder(driveUser);
        }

        GoogleDriveFileDTO driveFile = googleDriveService.uploadFile(driveUser, file, targetDriveFolder);

        Media media = Media.builder()
                .fileName(driveFile.name())
                .mimeType(driveFile.mimeType())
                .fileSize(driveFile.size())
                .driveFileId(driveFile.id())
                .fileUrl(driveFile.webViewLink())
                .uplodedBy(currentUser)
                .folder(folder)
                .build();

        Media savedMedia = mediaRepository.save(media);
        log.info("Media '{}' uploaded to Google Drive folder '{}' by user '{}'", savedMedia.getFileName(), targetDriveFolder, currentUser.getEmail());
        return toDTO(savedMedia);
    }

    public MediaDownloadDTO downloadMedia(Long mediaId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found with ID: " + mediaId));

        validateMemberAccess(media.getFolder().getGroup().getId());

        if (media.getDriveFileId() == null || media.getDriveFileId().isBlank()) {
            throw new RuntimeException("Media does not have an associated Google Drive file ID");
        }

        User driveUser = getDriveUserForMedia(media);
        byte[] fileBytes = googleDriveService.downloadFile(driveUser, media.getDriveFileId());

        return new MediaDownloadDTO(media.getFileName(), media.getMimeType(), fileBytes);
    }

    @Cacheable(value = CacheConstants.MEDIA_BY_ID, key = "#mediaId")
    public MediaDTO getMediaById(Long mediaId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found with ID: " + mediaId));

        validateMemberAccess(media.getFolder().getGroup().getId());

        return toDTO(media);
    }

    @CacheEvict(value = {
        CacheConstants.MEDIA_BY_FOLDER,
        CacheConstants.MEDIA_COUNT_BY_FOLDER,
        CacheConstants.MEDIA_BY_ID,
        CacheConstants.MEDIA_BY_GROUP,
        CacheConstants.FOLDERS_BY_ID,
        CacheConstants.FOLDERS_ALL,
        CacheConstants.GROUP_BY_ID,
        CacheConstants.GROUPS_ALL
    }, allEntries = true)
    public String createMedia(Media media){
        Folder folder = folderReposiory.findById(media.getFolder().getId())
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        User currentUser = userService.getCurrentUser();
        Long groupId = folder.getGroup().getId();

        GroupMembersDTO member = null;
        if (groupMembersService.existByUserAndGroup(currentUser.getId(), groupId)) {
            member = groupMembersService.getByUserAndGroup(currentUser.getId(), groupId);
        }

        boolean isGroupOwner = (folder.getGroup().getUser() != null && folder.getGroup().getUser().getId().equals(currentUser.getId()))
                || (member != null && member.isAccepted() && member.getRole() == Role.OWNER);

        if (!isGroupOwner) {
            if (member == null || !member.isAccepted()) {
                return "Access Denied: You are not an active member of this group";
            }
            if (member.getRole() == Role.VIEWER) {
                return "Access Denied: Viewers do not have permission to add media to this folder";
            }
        }

        media.setUplodedBy(currentUser);
        mediaRepository.save(media);
        return "data uploded successfully";
    }

    @CacheEvict(value = {
        CacheConstants.MEDIA_BY_FOLDER,
        CacheConstants.MEDIA_COUNT_BY_FOLDER,
        CacheConstants.MEDIA_BY_ID,
        CacheConstants.MEDIA_BY_GROUP,
        CacheConstants.FOLDERS_BY_ID,
        CacheConstants.FOLDERS_ALL,
        CacheConstants.GROUP_BY_ID,
        CacheConstants.GROUPS_ALL
    }, allEntries = true)
    public String deleteMedia(Long mediaId){
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(()-> new RuntimeException("data does not exist"));

        User currentUser = userService.getCurrentUser();
        Long groupId = media.getFolder().getGroup().getId();

        GroupMembersDTO member = null;
        if (groupMembersService.existByUserAndGroup(currentUser.getId(), groupId)) {
            member = groupMembersService.getByUserAndGroup(currentUser.getId(), groupId);
        }

        boolean isGroupOwner = (media.getFolder().getGroup().getUser() != null && media.getFolder().getGroup().getUser().getId().equals(currentUser.getId()))
                || (member != null && member.isAccepted() && member.getRole() == Role.OWNER);
        boolean isAdmin = member != null && member.isAccepted() && member.getRole() == Role.ADMIN;
        boolean isUploader = media.getUplodedBy() != null && media.getUplodedBy().getId().equals(currentUser.getId());

        if (member == null || !member.isAccepted() || member.getRole() == Role.VIEWER) {
            return "Access Denied: You are not authorized to delete media in this group";
        }

        if (!isGroupOwner && !isAdmin && !isUploader) {
            return "Access Denied: Only Group Owners, Admins, or the original uploader can delete this media";
        }

        if (media.getDriveFileId() != null && !media.getDriveFileId().isBlank()) {
            User driveUser = getDriveUserForMedia(media);
            if (driveUser != null && driveUser.isDriveConnected()) {
                try {
                    googleDriveService.deleteFileOrFolder(driveUser, media.getDriveFileId());
                } catch (Exception ignored) {}
            }
        }

        mediaRepository.delete(media);
        return "Data deleted successfully";
    }

    @Cacheable(value = CacheConstants.MEDIA_COUNT_BY_FOLDER, key = "#folderId")
    public Long getCountOfMediaInFolder(Long folderId){
        Folder folder = folderReposiory.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found with ID: " + folderId));
        validateMemberAccess(folder.getGroup().getId());
        return mediaRepository.countByFolderId(folderId);
    }

    @Cacheable(value = CacheConstants.MEDIA_BY_FOLDER, key = "#folderId")
    public List<MediaDTO> getAllMediaByFolder(Long folderId){
        Folder folder = folderReposiory.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found with ID: " + folderId));

        validateMemberAccess(folder.getGroup().getId());

        List<Media> medias = mediaRepository.findAllByFolderId(folderId);
        return medias.stream().map(this::toDTO).toList();
    }

    @Cacheable(value = CacheConstants.MEDIA_BY_GROUP, key = "#groupId")
    public List<MediaDTO> getAllMediaByGroup(Long groupId){
        validateMemberAccess(groupId);
        List<Media> medias = mediaRepository.findAllByGroupId(groupId);
        return medias.stream().map(this::toDTO).toList();
    }

    private void validateMemberAccess(Long groupId) {
        User currentUser = userService.getCurrentUser();
        GroupMembersDTO member = null;
        if (groupMembersService.existByUserAndGroup(currentUser.getId(), groupId)) {
            member = groupMembersService.getByUserAndGroup(currentUser.getId(), groupId);
        }

        if (member == null || !member.isAccepted()) {
            throw new RuntimeException("Access Denied: You must be an accepted member of this group to view its media");
        }
    }

    private User getDriveUserForMedia(Media media) {
        if (media.getFolder() != null && media.getFolder().getOwner() != null && media.getFolder().getOwner().isDriveConnected()) {
            return media.getFolder().getOwner();
        }
        if (media.getFolder() != null && media.getFolder().getGroup() != null && media.getFolder().getGroup().getUser() != null && media.getFolder().getGroup().getUser().isDriveConnected()) {
            return media.getFolder().getGroup().getUser();
        }
        if (media.getUplodedBy() != null && media.getUplodedBy().isDriveConnected()) {
            return media.getUplodedBy();
        }
        User currentUser = userService.getCurrentUser();
        if (currentUser.isDriveConnected()) {
            return currentUser;
        }
        throw new RuntimeException("No connected Google Drive account found to access media: " + media.getFileName());
    }

    public Media toEntity(MediaDTO dto){
        return mediaMapper.toEntity(dto);
    }

    public MediaDTO toDTO(Media entity){
        return mediaMapper.toDTO(entity);
    }
}
