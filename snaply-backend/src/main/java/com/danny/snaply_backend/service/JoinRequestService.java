package com.danny.snaply_backend.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.danny.snaply_backend.config.CacheConstants;
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

    @Cacheable(value = CacheConstants.JOIN_REQUEST_BY_USER, key = "@userService.getCurrentUser().id")
    public List<JoinRequestDTO> getRequestByUserId(){
        Long userId = userService.getCurrentUser().getId();
        Optional<List<JoinRequest>> joinRequestByUser = joinRequestRepository.findByUserId(userId.toString());
        if(joinRequestByUser.isEmpty()){
            return Collections.emptyList();
        }
        return joinRequestByUser.get().stream().map(this::toDTO).toList();

    }

    @Cacheable(value = CacheConstants.JOIN_REQUEST_BY_GROUP, key = "#groupId")
    public List<JoinRequestDTO> getRequestByGroupId(String groupId){
        User currentUser = userService.getCurrentUser();
        Long gId = Long.parseLong(groupId);
        Group group = groupRepository.findById(gId)
                .orElseThrow(() -> new RuntimeException("Group not found with ID: " + groupId));

        boolean isOwner = group.getUser() != null && group.getUser().getId().equals(currentUser.getId());
        GroupMembersDTO member = groupMembersService.existByUserAndGroup(currentUser.getId(), gId)
                ? groupMembersService.getByUserAndGroup(currentUser.getId(), gId)
                : null;
        boolean isAdmin = member != null && member.isAccepted() && member.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Access Denied: Only group owner or admin can view join requests");
        }

        Optional<List<JoinRequest>> joinRequestByGroup = joinRequestRepository.findByGroupId(groupId);
        if(joinRequestByGroup.isEmpty()){
            return Collections.emptyList();
        }
        return joinRequestByGroup.get().stream().map(this::toDTO).toList();
    }

    @Cacheable(value = CacheConstants.JOIN_REQUEST_BY_ID, key = "#id")
    public JoinRequestDTO getRequestById(String id){
        JoinRequest request = joinRequestRepository.findById(id)
            .orElseThrow(()-> new RuntimeException("Request not found"));

        User currentUser = userService.getCurrentUser();
        Long currentUserId = currentUser.getId();
        boolean isRequester = request.getUserId().equals(String.valueOf(currentUserId));

        Long gId = Long.parseLong(request.getGroupId());
        Group group = groupRepository.findById(gId).orElse(null);
        boolean isOwner = group != null && group.getUser() != null && group.getUser().getId().equals(currentUserId);
        GroupMembersDTO member = groupMembersService.existByUserAndGroup(currentUserId, gId)
                ? groupMembersService.getByUserAndGroup(currentUserId, gId)
                : null;
        boolean isAdmin = member != null && member.isAccepted() && member.getRole() == Role.ADMIN;

        if (!isRequester && !isOwner && !isAdmin) {
            throw new RuntimeException("Access Denied: You do not have permission to view this join request");
        }

        return toDTO(request);
    }

    @CacheEvict(value = {
        CacheConstants.JOIN_REQUEST_BY_ID,
        CacheConstants.JOIN_REQUEST_BY_USER,
        CacheConstants.JOIN_REQUEST_BY_GROUP,
        CacheConstants.GROUP_BY_ID,
        CacheConstants.GROUPS_ALL
    }, allEntries = true)
    public GroupMembersDTO acceptJoinRequest(String requestId) {
        JoinRequest request = joinRequestRepository
                .findById(requestId)
                .orElseThrow(() -> new RuntimeException("Join request not found"));

        Long groupId = Long.valueOf(request.getGroupId());
        Long userId = Long.valueOf(request.getUserId());

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        Long currentUserId = userService.getCurrentUser().getId();
        GroupMembers currentMember = groupMembersRepository.findByUserIdAndGroupId(currentUserId, groupId);
        boolean isOwner = (group.getUser() != null && group.getUser().getId().equals(currentUserId))
                || (currentMember != null && currentMember.isAccepted() && currentMember.getRole() == Role.OWNER);
        boolean isAdmin = currentMember != null && currentMember.isAccepted() && currentMember.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Access Denied: Only group owner or admin can accept requests");
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

        return groupMembersService.save(member);
    }

    @CacheEvict(value = {
        CacheConstants.JOIN_REQUEST_BY_ID,
        CacheConstants.JOIN_REQUEST_BY_USER,
        CacheConstants.JOIN_REQUEST_BY_GROUP
    }, allEntries = true)
    public JoinRequest rejectRequest(String requestId) {
        JoinRequest request = joinRequestRepository
                .findById(requestId)
                .orElseThrow(() -> new RuntimeException("Join request not found"));

        Long groupId = Long.valueOf(request.getGroupId());

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        Long currentUserId = userService.getCurrentUser().getId();
        GroupMembers currentMember = groupMembersRepository.findByUserIdAndGroupId(currentUserId, groupId);
        boolean isOwner = (group.getUser() != null && group.getUser().getId().equals(currentUserId))
                || (currentMember != null && currentMember.isAccepted() && currentMember.getRole() == Role.OWNER);
        boolean isAdmin = currentMember != null && currentMember.isAccepted() && currentMember.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Access Denied: Only group owner or admin can reject requests");
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
