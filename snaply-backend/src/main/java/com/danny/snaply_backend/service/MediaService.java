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
        boolean isGroupOwner = folder.getGroup().getUser().getId().equals(currentUser.getId());
        boolean isFolderOwner = folder.getOwner().getId().equals(currentUser.getId());

        if (!isGroupOwner && !isFolderOwner) {
            if (!groupMembersService.existByUserAndGroup(currentUser.getId(), groupId)) {
                throw new RuntimeException("You are not a member of this group");
            }
            GroupMembersDTO member = groupMembersService.getByUserAndGroup(currentUser.getId(), groupId);
            if (member.getRole() == Role.VIEWER) {
                throw new RuntimeException("Viewers do not have permission to upload files");
            }
        }

        // Determine which Google Drive account to store the file into
        User driveUser = folder.getOwner().isDriveConnected() ? folder.getOwner()
                : (folder.getGroup().getUser().isDriveConnected() ? folder.getGroup().getUser()
                : (currentUser.isDriveConnected() ? currentUser : null));

        if (driveUser == null || !driveUser.isDriveConnected()) {
            throw new RuntimeException("No connected Google Drive account found to store this file. Please connect your Google Drive first.");
        }

        String targetDriveFolder = folder.getDriveFolderId() != null ? folder.getDriveFolderId()
                : (folder.getGroup().getDriveFolderId() != null ? folder.getGroup().getDriveFolderId()
                : driveUser.getDriveRootFolderId());

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

        if (media.getDriveFileId() == null || media.getDriveFileId().isBlank()) {
            throw new RuntimeException("Media does not have an associated Google Drive file ID");
        }

        User driveUser = getDriveUserForMedia(media);
        byte[] fileBytes = googleDriveService.downloadFile(driveUser, media.getDriveFileId());

        return new MediaDownloadDTO(media.getFileName(), media.getMimeType(), fileBytes);
    }

    public MediaDTO getMediaById(Long mediaId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found with ID: " + mediaId));
        return toDTO(media);
    }

    @CacheEvict(value = {
        CacheConstants.MEDIA_BY_FOLDER,
        CacheConstants.MEDIA_COUNT_BY_FOLDER,
        CacheConstants.FOLDERS_BY_ID,
        CacheConstants.FOLDERS_ALL,
        CacheConstants.GROUP_BY_ID,
        CacheConstants.GROUPS_ALL
    }, allEntries = true)
    public String createMedia(Media media){
        FolderDTO folder = folderService.getFolderById(media.getFolder().getId());
        
        if(!folder.getUser().getId().equals(userService.getCurrentUser().getId())){
            return "You cant add the data into this folder because you are not the owner of this folder";
        }
        media.setUplodedBy(userService.getCurrentUser());
        mediaRepository.save(media);
        return "data uploded successfully";
    }

    @CacheEvict(value = {
        CacheConstants.MEDIA_BY_FOLDER,
        CacheConstants.MEDIA_COUNT_BY_FOLDER,
        CacheConstants.FOLDERS_BY_ID,
        CacheConstants.FOLDERS_ALL,
        CacheConstants.GROUP_BY_ID,
        CacheConstants.GROUPS_ALL
    }, allEntries = true)
    public String deleteMedia(Long mediaId){
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(()-> new RuntimeException("data does not exist"));

        User currentUser = userService.getCurrentUser();
        boolean isUploader = media.getUplodedBy().getId().equals(currentUser.getId());
        boolean isFolderOwner = media.getFolder().getOwner().getId().equals(currentUser.getId());
        boolean isGroupOwner = media.getFolder().getGroup().getUser().getId().equals(currentUser.getId());

        if (!isUploader && !isFolderOwner && !isGroupOwner) {
            return "You cant delete the data into this folder because you are not authorized";
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
        return mediaRepository.countByFolderId(folderId);
    }

    @Cacheable(value = CacheConstants.MEDIA_BY_FOLDER, key = "#folderId")
    public List<MediaDTO> getAllMediaByFolder(Long folderId){
        List<Media> medias = mediaRepository.findAllByFolderId(folderId);
        return medias.stream().map(this::toDTO).toList();
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
