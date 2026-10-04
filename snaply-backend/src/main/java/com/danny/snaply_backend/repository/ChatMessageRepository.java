package com.danny.snaply_backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.danny.snaply_backend.entity.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query("SELECT cm FROM ChatMessage cm LEFT JOIN FETCH cm.sender LEFT JOIN FETCH cm.media WHERE cm.group.id = :groupId ORDER BY cm.createdAt ASC")
    List<ChatMessage> findByGroupIdOrderByCreatedAtAsc(@Param("groupId") Long groupId);

    @Query("SELECT cm FROM ChatMessage cm LEFT JOIN FETCH cm.sender LEFT JOIN FETCH cm.media WHERE cm.group.id = :groupId ORDER BY cm.createdAt DESC")
    List<ChatMessage> findByGroupIdOrderByCreatedAtDesc(@Param("groupId") Long groupId);

    Page<ChatMessage> findByGroupIdOrderByCreatedAtDesc(Long groupId, Pageable pageable);

    long countByGroupId(Long groupId);

    void deleteByGroupId(Long groupId);
}
