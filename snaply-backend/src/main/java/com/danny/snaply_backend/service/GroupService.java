package com.danny.snaply_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.danny.snaply_backend.dto.GroupDTO;
import com.danny.snaply_backend.entity.Group;
import com.danny.snaply_backend.entity.GroupMembers;
import com.danny.snaply_backend.repository.GroupRepository;

@Service
public class GroupService {
    
    private GroupRepository groupRepository;
    private UserService userService;
    private GroupMembersService groupMembersService;


    public GroupService(GroupRepository groupRepository,GroupMembersService groupMembersService, UserService userService){
        this.groupRepository = groupRepository;
        this.groupMembersService = groupMembersService;         
        this.userService = userService;
    }

    public GroupDTO createGroup(GroupDTO groupDTO){
        Group group = toEntity(groupDTO);
        group.setUser(userService.getCurrentUser());
        Group savedGroup = groupRepository.save(group);
        return toDTO(savedGroup);

    }

    public String deleteGroup(GroupDTO groupDTO){
        if(userService.getCurrentUser().getId() != groupDTO.getUser().getId()){
            return "you can't delete this Group";
        }else{
            groupRepository.delete(toEntity(groupDTO));
            return "Group deleted successfully";
        }
    }

    public GroupDTO toDTO(Group group){
        return GroupDTO.builder()
            .id(group.getId())
            .name(group.getName())
            .description(group.getDescription())
            .createdAt(group.getCreatedAt())
            .driveFolderId(group.getDriveFolderId())
            .groupMembers(group.getGroupMembers() == null ? List.of() 
                        :group.getGroupMembers() 
                        .stream()
                        .map(groupMembersService :: toDTO)
                        .toList())       
            .build();
    }
    
    public Group toEntity(GroupDTO dto){
        return Group.builder()
            .id(dto.getId())
            .name(dto.getName())
            .description(dto.getDescription())
            .createdAt(dto.getCreatedAt())
            .driveFolderId(dto.getDriveFolderId())
            .groupMembers(dto.getGroupMembers()
                            .stream()
                            .map(groupMembersService :: toEntity)
                            .toList())
            .build();
    }
}
