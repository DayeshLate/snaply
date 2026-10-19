package com.danny.snaply_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.danny.snaply_backend.entity.Media;

public interface MediaRepository extends JpaRepository<Media,Long>{
    List<Media> findByFolderId(Long folderId);

    Page<Media> findByFolderId(Long folderId, Pageable pageable);

    List<Media> findByUplodedBy(Long userId);

    Optional<Media> findByIdAndFolderId(Long mediaId, Long folderId);

    Optional<Media> findByDriveFileId(String driveFileId);

    boolean existsByDriveFileId(String driveFileId);

    @Query("SELECT m FROM Media m LEFT JOIN FETCH m.folder f LEFT JOIN FETCH f.owner fo LEFT JOIN FETCH f.group g LEFT JOIN FETCH g.user gu LEFT JOIN FETCH m.uplodedBy u WHERE m.folder.id = :folderId")
    List<Media> findAllByFolderId(@Param("folderId") Long folderId);

    Page<Media> findAllByFolderId(Long folderId, Pageable pageable);

    Long countByFolderId(Long folderId);

    @Query("SELECT m FROM Media m LEFT JOIN FETCH m.folder f LEFT JOIN FETCH f.owner fo LEFT JOIN FETCH f.group g LEFT JOIN FETCH g.user gu LEFT JOIN FETCH m.uplodedBy u WHERE m.folder.group.id = :groupId")
    List<Media> findAllByGroupId(@Param("groupId") Long groupId);

    @Query("SELECT m FROM Media m WHERE m.folder.group.id = :groupId")
    Page<Media> findAllByGroupId(@Param("groupId") Long groupId, Pageable pageable);

    @Query("SELECT m FROM Media m WHERE m.uplodedBy.id = :userId")
    Page<Media> findAllByUploadedByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT m FROM Media m " +
           "LEFT JOIN FETCH m.folder f " +
           "LEFT JOIN FETCH f.owner fo " +
           "LEFT JOIN FETCH f.group g " +
           "LEFT JOIN FETCH g.user gu " +
           "LEFT JOIN FETCH m.uplodedBy u " +
           "WHERE m.id = :id")
    Optional<Media> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT m FROM Media m " +
           "LEFT JOIN FETCH m.folder f " +
           "LEFT JOIN FETCH f.owner fo " +
           "LEFT JOIN FETCH f.group g " +
           "LEFT JOIN FETCH g.user gu " +
           "LEFT JOIN FETCH m.uplodedBy u " +
           "WHERE m.id IN :ids")
    List<Media> findAllWithDetailsByIdIn(@Param("ids") List<Long> ids);
}
