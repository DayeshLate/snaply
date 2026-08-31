package com.danny.snaply_backend.service;

import java.util.List;
import java.util.Optional;


import org.springframework.stereotype.Service;

import com.danny.snaply_backend.dto.GroupMembersDTO;
import com.danny.snaply_backend.entity.GroupMembers;
import com.danny.snaply_backend.entity.Role;
import com.danny.snaply_backend.repository.GroupMembersRepository;

@Service
public class GroupMembersService {
    
    private GroupMembersRepository groupMembersRepository;

    public GroupMembersService(GroupMembersRepository groupMembersRepository){
        this.groupMembersRepository = groupMembersRepository;
    }

    public List<GroupMembersDTO> getByGroupmembersByRole(long groupId, Role role){
        List<GroupMembers>  members = groupMembersRepository.findByGroupIdAndRole(groupId, role);
        return members.stream().map(this::toDTO).toList();
    }

    public List<GroupMembersDTO> getMembersOfGroup(Long groupId){
        List<GroupMembers> members = groupMembersRepository.findByGroupId(groupId);
        return members.stream().map(this::toDTO).toList();
    }

    public boolean existByUserAndGroup(Long userId, Long groupId){
       return groupMembersRepository.existsByGroupIdAndUserId(groupId, userId);
    }

    public GroupMembersDTO getByUserAndGroup(Long userId,Long groupId){
        GroupMembers member = groupMembersRepository.findByUserIdAndGroupId(userId, groupId);
        return toDTO(member);
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
