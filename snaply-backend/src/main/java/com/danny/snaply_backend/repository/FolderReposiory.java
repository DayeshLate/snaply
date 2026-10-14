package com.danny.snaply_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.danny.snaply_backend.entity.Folder;

public interface FolderReposiory extends JpaRepository<Folder,Long> {
    List<Folder> findByGroupId(Long groupId);

    Page<Folder> findByGroupId(Long groupId, Pageable pageable);

    List<Folder> findByParentFolderId(Long parentFolderId);

    Optional<Folder> findByIdAndGroupId(Long folderId, Long groupId);

    Optional<Folder> findByGroupIdAndParentFolderIdIsNull(Long groupId);

    Optional<Folder> findByDriveFolderId(String driveFolderId);

    List<Folder> findByGroupIdIn(List<Long> groupIds);

    Page<Folder> findByGroupIdIn(List<Long> groupIds, Pageable pageable);

    List<Folder> findByOwnerId(Long ownerId);

    Page<Folder> findByOwnerId(Long ownerId, Pageable pageable);
}
