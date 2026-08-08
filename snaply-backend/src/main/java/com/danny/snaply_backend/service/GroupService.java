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

    public GroupDTO getGroup(long id){
    Group group = groupRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Group not found"));
    return toDTO(group);
    }
    public String deleteGroup(long id){
        Group group = groupRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Group not found"));
        if (!group.getUser().getId().equals(userService.getCurrentUser().getId())) {
            return "You can't delete this group";
        }
        groupRepository.delete(group);
        return "Group deleted successfully";
    }

    public List<GroupDTO> getAllGroups(){
        List<Group> groups = groupRepository.findByUserId(userService.getCurrentUser().getId()) ;
        return groups.stream()
            .map(this::toDTO)
            .toList();
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
            .groupMembers(dto.getGroupMembers() == null
                            ? List.of()
                            : dto.getGroupMembers()
                            .stream()
                            .map(groupMembersService :: toEntity)
                            .toList())
            .build();
    }
}
