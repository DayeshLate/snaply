package com.danny.snaply_backend.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.danny.snaply_backend.config.CacheConstants;
import com.danny.snaply_backend.dto.GroupMembersDTO;
import com.danny.snaply_backend.entity.GroupMembers;
import com.danny.snaply_backend.entity.Role;
import com.danny.snaply_backend.repository.GroupMembersRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GroupMembersService {
    
    private final GroupMembersRepository groupMembersRepository;

    @Cacheable(value = CacheConstants.GROUP_MEMBERS_BY_ROLE, key = "#groupId + ':' + #role.name()")
    public List<GroupMembersDTO> getByGroupmembersByRole(long groupId, Role role){
        List<GroupMembers>  members = groupMembersRepository.findByGroupIdAndRole(groupId, role);
        return members.stream().map(this::toDTO).toList();
    }

    @Cacheable(value = CacheConstants.GROUP_MEMBERS_BY_GROUP, key = "#groupId")
    public List<GroupMembersDTO> getMembersOfGroup(Long groupId){
        List<GroupMembers> members = groupMembersRepository.findByGroupId(groupId);
        return members.stream().map(this::toDTO).toList();
    }

    @Cacheable(value = CacheConstants.GROUP_MEMBER_EXISTS_BY_USER_AND_GROUP, key = "#groupId + ':' + #userId")
    public boolean existByUserAndGroup(Long userId, Long groupId){
       return groupMembersRepository.existsByGroupIdAndUserId(groupId, userId);
    }

    @Cacheable(value = CacheConstants.GROUP_MEMBERS_BY_USER_AND_GROUP, key = "#groupId + ':' + #userId")
    public GroupMembersDTO getByUserAndGroup(Long userId,Long groupId){
        GroupMembers member = groupMembersRepository.findByUserIdAndGroupId(userId, groupId);
        return toDTO(member);
    }

    @CacheEvict(value = {
        CacheConstants.GROUP_MEMBERS_BY_GROUP,
        CacheConstants.GROUP_MEMBERS_BY_ROLE,
        CacheConstants.GROUP_MEMBERS_BY_USER_AND_GROUP,
        CacheConstants.GROUP_MEMBER_EXISTS_BY_USER_AND_GROUP
    }, allEntries = true)
    public GroupMembersDTO save(GroupMembers groupMembers) {
        return toDTO(groupMembersRepository.save(groupMembers));
    }

    public GroupMembersDTO toDTO(GroupMembers groupMembers){
        return GroupMembersDTO.builder()
            .id(groupMembers.getId())
            .role(groupMembers.getRole())
            .group(groupMembers.getGroup())
            .user(groupMembers.getUser())
            .joinedAt(groupMembers.getJoinedAt())
            .isAccepted(groupMembers.isAccepted())
            .build();
    }

    public GroupMembers toEntity(GroupMembersDTO groupMembersDTO){
        return GroupMembers.builder()
            .id(groupMembersDTO.getId())
            .role(groupMembersDTO.getRole())
            .group(groupMembersDTO.getGroup())
            .user(groupMembersDTO.getUser())
            .joinedAt(groupMembersDTO.getJoinedAt())
            .isAccepted(groupMembersDTO.isAccepted())
            .build();
    }
}
