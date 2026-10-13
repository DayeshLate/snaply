package com.danny.snaply_backend.service;

import java.io.IOException;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import jakarta.annotation.PostConstruct;
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

    private final Path localUploadDir = Paths.get("uploads", "media");

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(localUploadDir);
        } catch (IOException e) {
            log.error("Could not create local upload directory: {}", e.getMessage());
        }
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
        }

        // Determine which Google Drive account to store the file into (prefer group creator who has Snaply root folder)
        User driveUser = (folder.getGroup().getUser() != null && folder.getGroup().getUser().isDriveConnected())
                ? folder.getGroup().getUser()
                : (folder.getOwner() != null && folder.getOwner().isDriveConnected() ? folder.getOwner()
                : (currentUser.isDriveConnected() ? currentUser : null));

        String driveFileId = null;
        String fileUrl = null;
        String mimeType = file.getContentType();
        if (mimeType == null || mimeType.isBlank() || mimeType.equals("application/octet-stream")) {
            mimeType = determineMimeType(file.getOriginalFilename());
        }

        // Try Google Drive if user has a connected account
        if (driveUser != null && driveUser.isDriveConnected()) {
            try {
                String targetDriveFolder = folder.getDriveFolderId();
                if (targetDriveFolder == null || targetDriveFolder.isBlank()) {
                    targetDriveFolder = folder.getGroup().getDriveFolderId();
                }
                if (targetDriveFolder == null || targetDriveFolder.isBlank()) {
                    targetDriveFolder = googleDriveService.getOrCreateSnaplyRootFolder(driveUser);
                }

                GoogleDriveFileDTO driveFile = googleDriveService.uploadFile(driveUser, file, targetDriveFolder);
                driveFileId = driveFile.id();
                fileUrl = driveFile.webViewLink();
                if (driveFile.mimeType() != null && !driveFile.mimeType().isBlank()) {
                    mimeType = driveFile.mimeType();
                }
                log.info("Media '{}' uploaded to Google Drive folder '{}' by user '{}'", file.getOriginalFilename(), targetDriveFolder, currentUser.getEmail());
            } catch (Exception e) {
                log.warn("Google Drive upload failed: {}. Falling back to resilient local storage.", e.getMessage());
            }
        }

        // Resilient fallback to local storage
        if (driveFileId == null) {
            try {
                Files.createDirectories(localUploadDir);
                String cleanName = sanitizeFilename(file.getOriginalFilename());
                String uniqueName = System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + "_" + cleanName;
                Path targetPath = localUploadDir.resolve(uniqueName);
                Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
                driveFileId = "local:" + uniqueName;
                log.info("Media '{}' stored locally at '{}'", cleanName, targetPath);
            } catch (IOException e) {
                log.error("Failed to store media locally", e);
                throw new RuntimeException("Failed to store uploaded media: " + e.getMessage(), e);
            }
        }

        Media media = Media.builder()
                .fileName(file.getOriginalFilename() != null ? sanitizeFilename(file.getOriginalFilename()) : "unnamed_file")
                .mimeType(mimeType)
                .fileSize(BigInteger.valueOf(file.getSize()))
                .driveFileId(driveFileId)
                .fileUrl(fileUrl)
                .uplodedBy(currentUser)
                .folder(folder)
                .build();

        Media savedMedia = mediaRepository.save(media);
        log.info("Media record saved with ID '{}' in folder '{}'", savedMedia.getId(), folderId);
        return toDTO(savedMedia);
    }

    public MediaDownloadDTO downloadMedia(Long mediaId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found with ID: " + mediaId));

        validateMemberAccess(media.getFolder().getGroup().getId());

        if (media.getDriveFileId() == null || media.getDriveFileId().isBlank()) {
            throw new RuntimeException("Media does not have an associated file ID");
        }

        if (media.getDriveFileId().startsWith("local:")) {
            String localFilename = media.getDriveFileId().substring("local:".length());
            Path filePath = localUploadDir.resolve(localFilename);
            if (!Files.exists(filePath)) {
                throw new RuntimeException("Local media file not found on server: " + localFilename);
            }
            try {
                byte[] fileBytes = Files.readAllBytes(filePath);
                return new MediaDownloadDTO(media.getFileName(), media.getMimeType(), fileBytes);
            } catch (IOException e) {
                throw new RuntimeException("Failed to read local media file: " + e.getMessage(), e);
            }
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
        if (media == null || media.getFolder() == null || media.getFolder().getId() == null) {
            throw new RuntimeException("Valid folder is required for media");
        }
        media.setId(null);
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

        if (!isGroupOwner) {
            if (member == null || !member.isAccepted()) {
                throw new RuntimeException("Access Denied: You are not an active member of this group");
            }
        }

        if (!isGroupOwner && !isAdmin && !isUploader) {
            throw new RuntimeException("Access Denied: Only Group Owners, Admins, or the original uploader can delete this media");
        }

        if (media.getDriveFileId() != null && !media.getDriveFileId().isBlank()) {
            if (media.getDriveFileId().startsWith("local:")) {
                String localFilename = media.getDriveFileId().substring("local:".length());
                try {
                    Files.deleteIfExists(localUploadDir.resolve(localFilename));
                    log.info("Deleted local media file: {}", localFilename);
                } catch (Exception e) {
                    log.warn("Failed to delete local media file: {}", e.getMessage());
                }
            } else {
                try {
                    User driveUser = getDriveUserForMedia(media);
                    if (driveUser != null && driveUser.isDriveConnected()) {
                        googleDriveService.deleteFileOrFolder(driveUser, media.getDriveFileId());
                    }
                } catch (Exception ignored) {}
            }
        }

        mediaRepository.delete(media);
        return "Data deleted successfully";
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
    @Transactional
    public MediaDTO updateMedia(Long mediaId, String newFileName, Long targetFolderId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media not found with ID: " + mediaId));

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

        if (!isGroupOwner) {
            if (member == null || !member.isAccepted()) {
                throw new RuntimeException("Access Denied: You are not an active member of this group");
            }
        }

        if (!isGroupOwner && !isAdmin && !isUploader) {
            throw new RuntimeException("Access Denied: Only Group Owners, Admins, or the original uploader can edit this media");
        }

        if (newFileName != null && !newFileName.trim().isBlank()) {
            media.setFileName(newFileName.trim());
        }

        if (targetFolderId != null && !targetFolderId.equals(media.getFolder().getId())) {
            Folder newFolder = folderReposiory.findById(targetFolderId)
                    .orElseThrow(() -> new RuntimeException("Target folder not found with ID: " + targetFolderId));
            if (!newFolder.getGroup().getId().equals(groupId)) {
                throw new RuntimeException("Target folder belongs to a different group");
            }
            media.setFolder(newFolder);
        }

        Media savedMedia = mediaRepository.save(media);
        log.info("Media record '{}' (ID {}) updated by user '{}'", savedMedia.getFileName(), savedMedia.getId(), currentUser.getEmail());
        return toDTO(savedMedia);
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

    private String determineMimeType(String filename) {
        if (filename == null) return "application/octet-stream";
        String lower = filename.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".mp4")) return "video/mp4";
        if (lower.endsWith(".webm")) return "video/webm";
        if (lower.endsWith(".mov")) return "video/quicktime";
        if (lower.endsWith(".mkv")) return "video/x-matroska";
        if (lower.endsWith(".avi")) return "video/x-msvideo";
        return "application/octet-stream";
    }

    private String sanitizeFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            return "file";
        }
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_").trim();
    }

    public Media toEntity(MediaDTO dto){
        return mediaMapper.toEntity(dto);
    }

    public MediaDTO toDTO(Media entity){
        MediaDTO dto = mediaMapper.toDTO(entity);
        if (dto != null && (dto.getFileUrl() == null || dto.getFileUrl().contains("drive.google.com") || (dto.getDriveFileId() != null && dto.getDriveFileId().startsWith("local:")))) {
            dto.setFileUrl("/media/stream/" + entity.getId());
        }
        return dto;
    }
}
