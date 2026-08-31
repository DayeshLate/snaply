package com.danny.snaply_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danny.snaply_backend.entity.Folder;

public interface FolderReposiory extends JpaRepository<Folder,Long> {
    List<Folder> findByGroupId(Long groupId);

    List<Folder> findByParentFolderId(Long parentFolderId);

    Optional<Folder> findByIdAndGroupId(Long folderId, Long groupId);

    Optional<Folder> findByGroupIdAndParentFolderIdIsNull(Long groupId);

    Optional<Folder> findByDriveFolderId(String driveFolderId);
}
