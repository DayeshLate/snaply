package com.danny.snaply_backend.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.danny.snaply_backend.dto.GroupMembersDTO;
import com.danny.snaply_backend.dto.JoinRequestDTO;
import com.danny.snaply_backend.entity.Group;
import com.danny.snaply_backend.entity.GroupMembers;
import com.danny.snaply_backend.entity.JoinRequest;
import com.danny.snaply_backend.entity.Role;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.repository.GroupMembersRepository;
import com.danny.snaply_backend.repository.GroupRepository;
import com.danny.snaply_backend.repository.JoinRequestRepository;
import com.danny.snaply_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;


@Service 
@RequiredArgsConstructor
@Transactional
public class JoinRequestService {
    
    private final JoinRequestRepository joinRequestRepository;
    private final UserService userService;
    private final GroupRepository groupRepository;
    private final GroupMembersRepository groupMembersRepository;
    private final GroupMembersService groupMembersService;
    private final UserRepository userRepository;

    public List<JoinRequestDTO> getRequestByUserId(){
        Long user = userService.getCurrentUser().getId();
        Optional<List<JoinRequest>> joinRequestByUser = joinRequestRepository.findByUserId(user.toString());
        if(joinRequestByUser.isEmpty()){
            return Collections.emptyList();
        }
        return joinRequestByUser.get().stream().map(this::toDTO).toList();

    }

    public List<JoinRequestDTO> getRequestByGroupId(String groupId){
        Optional<List<JoinRequest>> joinRequestByGroup = joinRequestRepository.findByGroupId(groupId);
        if(joinRequestByGroup.isEmpty()){
            return Collections.emptyList();
        }
        return joinRequestByGroup.get().stream().map(this::toDTO).toList();
    }
    public JoinRequestDTO getRequestById(String id){
        JoinRequest request = joinRequestRepository.findById(id)
            .orElseThrow(()-> new RuntimeException("Request not found"));
        return toDTO(request);
    }

    public GroupMembersDTO acceptJoinRequest(String requestId) {
        JoinRequest request = joinRequestRepository
                .findById(requestId)
                .orElseThrow(() -> new RuntimeException("Join request not found"));

        Long groupId = Long.valueOf(request.getGroupId());
        Long userId = Long.valueOf(request.getUserId());

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        Long creatorId = userService.getCurrentUser().getId();

        if (!group.getUser().getId().equals(creatorId)) {
            throw new RuntimeException("Only group creator can accept request");
        }

        if (request.getStatus() != JoinRequest.Status.PENDING) {
            throw new RuntimeException("Request is not pending");
        }

        if (groupMembersRepository.existsByGroupIdAndUserId(groupId, userId)) {
            throw new RuntimeException("User is already a member of this group");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        GroupMembers member = GroupMembers.builder()
                .group(group)
                .user(user)
                .isAccepted(true)
                .role(Role.VIEWER)
                .build();

        request.setStatus(JoinRequest.Status.ACCEPTED);
        request.setRespondedAt(LocalDateTime.now());

        joinRequestRepository.save(request);

        return groupMembersService.toDTO(groupMembersRepository.save(member));
    }

    public JoinRequest rejectRequest(String requestId) {
        JoinRequest request = joinRequestRepository
                .findById(requestId)
                .orElseThrow(() -> new RuntimeException("Join request not found"));

        Long groupId = Long.valueOf(request.getGroupId());

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        Long creatorId = userService.getCurrentUser().getId();

        if (!group.getUser().getId().equals(creatorId)) {
            throw new RuntimeException("Only group creator can reject requests");
        }

        if (request.getStatus() != JoinRequest.Status.PENDING) {
            throw new RuntimeException("Request is not pending");
        }

        request.setStatus(JoinRequest.Status.REJECTED);
        request.setRespondedAt(LocalDateTime.now());

        return joinRequestRepository.save(request);
    }

    public JoinRequestDTO toDTO(JoinRequest entity){
        return JoinRequestDTO.builder()
            .id(entity.getId())
            .groupId(entity.getGroupId())
            .userId(entity.getUserId())
            .requestAt(entity.getRequestedAt())
            .respondedAt(entity.getRespondedAt())
            .status(entity.getStatus())
            .build();
    }

    public JoinRequest toEntity(JoinRequestDTO dto){
        return JoinRequest.builder()
            .id(dto.getId())
            .groupId(dto.getGroupId())
            .userId(dto.getUserId())
            .status(dto.getStatus())
            .requestedAt(dto.getRequestAt())
            .respondedAt(dto.getRespondedAt())
            .build();
    }

}
