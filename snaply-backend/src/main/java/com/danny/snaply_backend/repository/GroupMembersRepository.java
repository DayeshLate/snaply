package com.danny.snaply_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danny.snaply_backend.entity.GroupMembers;
import com.danny.snaply_backend.entity.Role;

public interface GroupMembersRepository extends JpaRepository<GroupMembers,Long> {
    
    boolean existsByGroupIdAndUserId(
            String groupId,
            String userId
    );

    List<GroupMembers> findByGroupId(Long groupId);

    boolean existsByGroupIdAndUserId(Long groupId, Long userId);

    boolean existsByIdAndGroupId(long id, long groupId);

    GroupMembers findByIdAndGroupId(long groupMemberId, long groupId);

    GroupMembers findByUserIdAndGroupId(Long userId, Long groupId);

    List<GroupMembers> findByGroupIdAndRole(Long groupId, Role role);
}
