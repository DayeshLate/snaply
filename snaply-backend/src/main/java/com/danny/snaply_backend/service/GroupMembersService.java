package com.danny.snaply_backend.service;

import org.springframework.stereotype.Service;

import com.danny.snaply_backend.dto.GroupMembersDTO;
import com.danny.snaply_backend.entity.Group;
import com.danny.snaply_backend.entity.GroupMembers;
import com.danny.snaply_backend.repository.GroupMembersRepository;

@Service
public class GroupMembersService {
    
    private GroupMembersRepository groupMembersRepository;

    public GroupMembersService(GroupMembersRepository groupMembersRepository){
        this.groupMembersRepository = groupMembersRepository;
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
