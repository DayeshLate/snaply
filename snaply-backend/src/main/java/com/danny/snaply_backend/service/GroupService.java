package com.danny.snaply_backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.danny.snaply_backend.config.CacheConstants;
import com.danny.snaply_backend.dto.GroupDTO;
import com.danny.snaply_backend.dto.GroupMembersDTO;
import com.danny.snaply_backend.entity.Folder;
import com.danny.snaply_backend.entity.Group;
import com.danny.snaply_backend.entity.GroupMembers;
import com.danny.snaply_backend.entity.JoinRequest;
import com.danny.snaply_backend.entity.Role;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.repository.GroupMembersRepository;
import com.danny.snaply_backend.repository.GroupRepository;
import com.danny.snaply_backend.repository.JoinRequestRepository;
import com.danny.snaply_backend.repository.FolderReposiory;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class GroupService {

        private final GroupRepository groupRepository;
        private final FolderReposiory folderReposiory;
        private final FolderMapper folderMapper;
        private final UserService userService;
        private final GroupMembersService groupMembersService;
        private final GroupMembersRepository groupMembersRepository;
        private final JoinRequestRepository joinRequestRepository;
        private final GoogleDriveService googleDriveService;
        private final NotificationService notificationService;

        @CacheEvict(value = {CacheConstants.GROUP_BY_ID, CacheConstants.GROUPS_ALL}, allEntries = true)
    public GroupDTO createGroup(GroupDTO groupDTO) {

        String inviteCode;
        do {
            inviteCode = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 10)
                    .toUpperCase();
        } while (groupRepository.existsByInviteCode(inviteCode));

        Group group = toEntity(groupDTO);
        User currentUser = userService.getCurrentUser();

        group.setUser(currentUser);
        group.setInviteCode(inviteCode);

        if (currentUser.isDriveConnected()) {
            try {
                String snaplyRootId = googleDriveService.getOrCreateSnaplyRootFolder(currentUser);
                String groupDriveId = googleDriveService.createFolder(currentUser, group.getName(), snaplyRootId);
                group.setDriveFolderId(groupDriveId);
            } catch (Exception e) {
                // Graceful fallback: group is created even if Drive API call fails
            }
        }

        Group savedGroup = groupRepository.saveAndFlush(group);

        Folder folder = Folder.builder()
                .name("General")
                .group(savedGroup)
                .owner(currentUser)
                .build();

        if (currentUser.isDriveConnected() && savedGroup.getDriveFolderId() != null) {
            try {
                String folderDriveId = googleDriveService.createFolder(currentUser, folder.getName(), savedGroup.getDriveFolderId());
                folder.setDriveFolderId(folderDriveId);
            } catch (Exception e) {
                // Graceful fallback
            }
        }
        folderReposiory.save(folder);

        GroupMembers owner = GroupMembers.builder()
                .group(savedGroup)
                .user(currentUser)
                .role(Role.OWNER)
                .isAccepted(true)
                .build();

        groupMembersRepository.save(owner);

        return toDTO(savedGroup);
    }

    public boolean existGroupById(Long groupId){
       return groupRepository.existsById(groupId);
    }


    public Group getGroupById(Long groupId){
        return groupRepository.findById(groupId)
                .orElseThrow(()-> new RuntimeException("group not found"));
    }


    @CacheEvict(value = {
        CacheConstants.GROUP_BY_ID,
        CacheConstants.GROUPS_ALL,
        CacheConstants.GROUP_MEMBERS_BY_GROUP,
        CacheConstants.GROUP_MEMBERS_BY_ROLE,
        CacheConstants.GROUP_MEMBERS_BY_USER_AND_GROUP,
        CacheConstants.GROUP_MEMBER_EXISTS_BY_USER_AND_GROUP,
        CacheConstants.JOIN_REQUEST_BY_USER,
        CacheConstants.JOIN_REQUEST_BY_GROUP
    }, allEntries = true)
    public GroupMembersDTO addMemberByEmail(long groupId, String email, Role role) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        String normalizedEmail = email.trim().toLowerCase();

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found with ID: " + groupId));

        User currentUser = userService.getCurrentUser();
        Long currentUserId = currentUser.getId();

        GroupMembers currentMember = groupMembersRepository.findByUserIdAndGroupId(currentUserId, groupId);
        boolean isOwner = (group.getUser() != null && group.getUser().getId().equals(currentUserId))
                || (currentMember != null && currentMember.isAccepted() && currentMember.getRole() == Role.OWNER);
        boolean isAdmin = currentMember != null && currentMember.isAccepted() && currentMember.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Access Denied: Only Group OWNER or ADMIN can add members");
        }

        Role assignedRole = (role != null) ? role : Role.EDITOR;
        if (!isOwner && (assignedRole == Role.ADMIN || assignedRole == Role.OWNER)) {
            throw new RuntimeException("Access Denied: Only the Group OWNER can add members as ADMIN or OWNER");
        }

        User targetUser = userService.findByEmailDirect(normalizedEmail)
                .or(() -> userService.findByEmail(normalizedEmail))
                .orElseThrow(() -> new RuntimeException("User with email '" + email + "' not found. Make sure they have registered an account."));

        if (group.getUser() != null && group.getUser().getId().equals(targetUser.getId())) {
            throw new RuntimeException("User is already the owner of this group");
        }

        GroupMembers existingMembership = groupMembersRepository.findByUserIdAndGroupId(targetUser.getId(), groupId);
        GroupMembers memberToSave;

        if (existingMembership != null) {
            if (existingMembership.isAccepted()) {
                throw new RuntimeException("User is already a member of this group");
            }
            existingMembership.setAccepted(true);
            existingMembership.setRole(assignedRole);
            memberToSave = existingMembership;
        } else {
            memberToSave = GroupMembers.builder()
                    .group(group)
                    .user(targetUser)
                    .role(assignedRole)
                    .isAccepted(true)
                    .build();
        }

        GroupMembers savedMember = groupMembersRepository.save(memberToSave);

        try {
            joinRequestRepository.findByGroupIdAndUserId(String.valueOf(groupId), String.valueOf(targetUser.getId()))
                    .ifPresent(req -> {
                        req.setStatus(JoinRequest.Status.ACCEPTED);
                        joinRequestRepository.save(req);
                    });
        } catch (Exception ignored) {}

        try {
            notificationService.sendNotification(
                    targetUser,
                    "Added to " + group.getName(),
                    currentUser.getName() + " added you to the group '" + group.getName() + "' as " + assignedRole.name()
            );
        } catch (Exception ignored) {}

        return groupMembersService.toDTO(savedMember);
    }

    @CacheEvict(value = {
        CacheConstants.GROUP_BY_ID,
        CacheConstants.GROUPS_ALL,
        CacheConstants.GROUP_MEMBERS_BY_GROUP,
        CacheConstants.GROUP_MEMBERS_BY_ROLE,
        CacheConstants.GROUP_MEMBERS_BY_USER_AND_GROUP,
        CacheConstants.GROUP_MEMBER_EXISTS_BY_USER_AND_GROUP
    }, allEntries = true)
    public String removeGroupMember(long groupMemberId, long groupId) {
        Long currentUserId = userService.getCurrentUser().getId();
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        GroupMembers currentMember = groupMembersRepository.findByUserIdAndGroupId(currentUserId, groupId);
        boolean isOwner = (group.getUser() != null && group.getUser().getId().equals(currentUserId))
                || (currentMember != null && currentMember.isAccepted() && currentMember.getRole() == Role.OWNER);
        boolean isAdmin = currentMember != null && currentMember.isAccepted() && currentMember.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            return "You do not have permission to remove members from this group";
        }

        GroupMembers targetMember = groupMembersRepository.findByUserIdAndGroupId(groupMemberId, groupId);
        if (targetMember == null) {
            targetMember = groupMembersRepository.findByIdAndGroupId(groupMemberId, groupId);
        }
        if (targetMember == null) {
            return "Member not found in this group";
        }

        if (targetMember.getRole() == Role.OWNER || (group.getUser() != null && group.getUser().getId().equals(targetMember.getUser().getId()))) {
            return "Cannot remove the group owner";
        }

        if (!isOwner && targetMember.getRole() == Role.ADMIN) {
            return "Admins cannot remove another Admin";
        }

        groupMembersRepository.delete(targetMember);
        return "Member deleted successfully";
    }

        @Transactional
        @Cacheable(value = CacheConstants.GROUP_BY_ID, key = "#id")
    public GroupDTO getGroup(long id) {

        Group group = groupRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Group not found")
                );

        if (group.getInviteCode() == null || group.getInviteCode().isBlank()) {
            String newCode;
            do {
                newCode = UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
            } while (groupRepository.existsByInviteCode(newCode));
            group.setInviteCode(newCode);
            group = groupRepository.saveAndFlush(group);
        }

        Long currentUserId = userService.getCurrentUser().getId();

        boolean isGroupOwner = group.getUser() != null && group.getUser().getId().equals(currentUserId);
        boolean isGroupMember = group.getGroupMembers() != null &&
                group.getGroupMembers().stream()
                        .filter(GroupMembers::isAccepted)
                        .anyMatch(member -> member.getUser() != null && member.getUser().getId().equals(currentUserId));

        if (!isGroupOwner && !isGroupMember) {
                throw new RuntimeException("You are not allowed to access this group");
        }

        return toDTO(group);
    }

        @Transactional
        @CacheEvict(value = {
                CacheConstants.JOIN_REQUEST_BY_USER,
                CacheConstants.JOIN_REQUEST_BY_GROUP
        }, allEntries = true)
        public JoinRequest requestToJoin(String inviteCode) {
        if (inviteCode == null || inviteCode.isBlank()) {
                throw new RuntimeException("Invite code cannot be empty");
        }

        String cleanCode = inviteCode.trim();
        if (cleanCode.contains("/")) {
                cleanCode = cleanCode.substring(cleanCode.lastIndexOf('/') + 1).trim();
        }

        final String lookupCode = cleanCode;
        Group group = groupRepository
                .findByInviteCodeIgnoreCase(lookupCode)
                .orElseGet(() -> groupRepository.findByInviteCode(lookupCode)
                        .orElseThrow(() -> new RuntimeException("Invalid invite code: " + lookupCode)));

        Long userId = userService.getCurrentUser().getId();

        if (group.getUser() != null && group.getUser().getId().equals(userId)) {
                throw new RuntimeException(
                        "You are already the owner of this group"
                );
        }

        GroupMembers currentMembership =
                groupMembersRepository.findByUserIdAndGroupId(userId, group.getId());

        if (currentMembership != null && currentMembership.isAccepted()) {
                throw new RuntimeException(
                        "You are already a member of this group"
                );
        }

        var existingRequest =
                joinRequestRepository.findByGroupIdAndUserId(
                        String.valueOf(group.getId()),
                        String.valueOf(userId)
                );

        if (existingRequest.isPresent()) {

                JoinRequest request = existingRequest.get();

                if (request.getStatus() == JoinRequest.Status.PENDING) {
                throw new RuntimeException(
                        "Join request already pending"
                );
                }

                request.setStatus(JoinRequest.Status.PENDING);
                request.setRespondedAt(null);

                return joinRequestRepository.save(request);
        }

        JoinRequest request = JoinRequest.builder()
                .groupId(String.valueOf(group.getId()))
                .userId(String.valueOf(userId))
                .status(JoinRequest.Status.PENDING)
                .build();

        return joinRequestRepository.save(request);
        }

        @CacheEvict(value = {CacheConstants.GROUP_BY_ID, CacheConstants.GROUPS_ALL}, allEntries = true)
    public String deleteGroup(long id) {

        Group group = groupRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Group not found")
                );

        Long currentUserId =
                userService.getCurrentUser().getId();

        if (!group.getUser().getId().equals(currentUserId)) {
            return "You can't delete this group";
        }

        if (group.getDriveFolderId() != null && group.getUser().isDriveConnected()) {
            try {
                googleDriveService.deleteFileOrFolder(group.getUser(), group.getDriveFolderId());
            } catch (Exception ignored) {}
        }

        groupRepository.delete(group);

        return "Group deleted successfully";
    }

    @CacheEvict(value = {
        CacheConstants.GROUP_BY_ID,
        CacheConstants.GROUPS_ALL,
        CacheConstants.GROUP_MEMBERS_BY_GROUP,
        CacheConstants.GROUP_MEMBERS_BY_ROLE,
        CacheConstants.GROUP_MEMBERS_BY_USER_AND_GROUP,
        CacheConstants.GROUP_MEMBER_EXISTS_BY_USER_AND_GROUP
    }, allEntries = true)
    public String changeRole(long targetUserIdOrMemberId, long groupId, Role role) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found with ID: " + groupId));

        long currentUserId = userService.getCurrentUser().getId();

        GroupMembers currentMember = groupMembersRepository.findByUserIdAndGroupId(currentUserId, groupId);
        boolean isOwner = (group.getUser() != null && group.getUser().getId().equals(currentUserId))
                || (currentMember != null && currentMember.isAccepted() && currentMember.getRole() == Role.OWNER);
        boolean isAdmin = currentMember != null && currentMember.isAccepted() && currentMember.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Access Denied: Only Group OWNER or ADMIN can change member roles");
        }

        GroupMembers targetMember = groupMembersRepository.findByUserIdAndGroupId(targetUserIdOrMemberId, groupId);
        if (targetMember == null) {
            targetMember = groupMembersRepository.findByIdAndGroupId(targetUserIdOrMemberId, groupId);
        }
        if (targetMember == null || !targetMember.isAccepted()) {
            throw new RuntimeException("Target user is not an active member of this group");
        }

        if (targetMember.getRole() == Role.OWNER || (group.getUser() != null && group.getUser().getId().equals(targetMember.getUser().getId()))) {
            throw new RuntimeException("Cannot change the role of the group owner");
        }

        if (!isOwner) {
            if (role == Role.OWNER || role == Role.ADMIN) {
                throw new RuntimeException("Access Denied: Only the Group OWNER can promote members to ADMIN or OWNER");
            }
            if (targetMember.getRole() == Role.ADMIN) {
                throw new RuntimeException("Access Denied: Admins cannot change the role of another Admin");
            }
        }

        targetMember.setRole(role);
        groupMembersRepository.save(targetMember);
        return "Member role updated to " + role + " successfully";
    }

    @Transactional(readOnly = true)
    @Cacheable(value = CacheConstants.GROUPS_ALL, key = "@userService.getCurrentUser().id")
    public List<GroupDTO> getAllGroups() {

        Long currentUserId = userService.getCurrentUser().getId();

        return groupMembersRepository.findByUserId(currentUserId).stream()
                .filter(GroupMembers::isAccepted)
                .map(GroupMembers::getGroup)
                .map(g -> {
                    if (g.getInviteCode() == null || g.getInviteCode().isBlank()) {
                        String newCode;
                        do {
                            newCode = UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
                        } while (groupRepository.existsByInviteCode(newCode));
                        g.setInviteCode(newCode);
                        return groupRepository.saveAndFlush(g);
                    }
                    return g;
                })
                .map(this::toDTO)
                .toList();
    }

    public GroupDTO toDTO(Group group) {
        if (group == null) return null;
        Long oId = null;
        String oName = null;
        String oEmail = null;
        if (group.getUser() != null) {
            oId = group.getUser().getId();
            oName = group.getUser().getName();
            oEmail = group.getUser().getEmail();
        }

        return GroupDTO.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .createdAt(group.getCreatedAt())
                .driveFolderId(group.getDriveFolderId())
                .ownerId(oId)
                .ownerName(oName)
                .ownerEmail(oEmail)
                .groupMembers(
                        group.getGroupMembers() == null
                                ? List.of()
                                : group.getGroupMembers()
                                        .stream()
                                        .map(groupMembersService::toDTO)
                                        .toList()
                )
                .folderDTOs(
                    group.getFolder() == null
                            ? new ArrayList<>()
                            : group.getFolder()
                                            .stream()
                                            .map(folderMapper::toDTO)
                                            .toList()
            )
                .user(group.getUser())
                .inviteCode(group.getInviteCode())
                .build();
    }

    public Group toEntity(GroupDTO dto) {

        return Group.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .createdAt(dto.getCreatedAt())
                .driveFolderId(dto.getDriveFolderId())
                .groupMembers(
                        dto.getGroupMembers() == null
                                ? List.of()
                                : dto.getGroupMembers()
                                        .stream()
                                        .map(groupMembersService::toEntity)
                                        .toList()
                )
                .folder(
                    dto.getFolderDTOs() == null
                            ? new ArrayList<>()
                            : dto.getFolderDTOs()
                                    .stream()
                                    .map(folderMapper::toEntity)
                                    .toList()
            )
                .build();
    }
}