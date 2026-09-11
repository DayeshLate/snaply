package com.danny.snaply_backend.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.danny.snaply_backend.config.CacheConstants;
import com.danny.snaply_backend.dto.FolderDTO;
import com.danny.snaply_backend.dto.MediaDTO;
import com.danny.snaply_backend.entity.Media;
import com.danny.snaply_backend.repository.MediaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;
    private final UserService userService;
    private final FolderService folderService;
    private final MediaMapper mediaMapper;

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
        
        if(folder.getUser() != userService.getCurrentUser()){
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

        FolderDTO folder = folderService.getFolderById(media.getFolder().getId());
        
        if(folder.getUser() != userService.getCurrentUser()){
            return "You cant delete the data into this folder because you are not the owner of this folder";
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
    
    
    public Media toEntity(MediaDTO dto){
        return mediaMapper.toEntity(dto);
    }

    public MediaDTO toDTO(Media entity){
        return mediaMapper.toDTO(entity);
    }
}
