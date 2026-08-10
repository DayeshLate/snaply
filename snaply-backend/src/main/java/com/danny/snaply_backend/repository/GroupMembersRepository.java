package com.danny.snaply_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danny.snaply_backend.entity.GroupMembers;

public interface GroupMembersRepository extends JpaRepository<GroupMembers,Long> {
    
    boolean existsByGroupIdAndUserId(
            String groupId,
            String userId
    );

    List<GroupMembers> findByGroupId(String groupId);

    boolean existsByGroupIdAndUserId(Long groupId, Long userId);
}
