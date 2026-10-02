package com.danny.snaply_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.danny.snaply_backend.entity.Media;

public interface MediaRepository extends JpaRepository<Media,Long>{
    List<Media> findByFolderId(Long folderId);

    List<Media> findByUplodedBy(Long userId);

    Optional<Media> findByIdAndFolderId(Long mediaId, Long folderId);

    Optional<Media> findByDriveFileId(String driveFileId);

    boolean existsByDriveFileId(String driveFileId);

    List<Media> findAllByFolderId(Long folderId);

    Long countByFolderId(Long folderId);

    @Query("SELECT m FROM Media m WHERE m.folder.group.id = :groupId")
    List<Media> findAllByGroupId(@Param("groupId") Long groupId);
}
