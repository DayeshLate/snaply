package com.danny.snaply_backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.danny.snaply_backend.dto.GroupDTO;
import com.danny.snaply_backend.dto.GroupMembersDTO;
import com.danny.snaply_backend.entity.Folder;
import com.danny.snaply_backend.entity.Group;
import com.danny.snaply_backend.entity.GroupMembers;
import com.danny.snaply_backend.entity.JoinRequest;
import com.danny.snaply_backend.entity.Role;
import com.danny.snaply_backend.repository.GroupMembersRepository;
import com.danny.snaply_backend.repository.GroupRepository;
import com.danny.snaply_backend.repository.JoinRequestRepository;
import com.danny.snaply_backend.repository.UserRepository;
import com.danny.snaply_backend.repository.FolderReposiory;
import com.danny.snaply_backend.service.FolderMapper;

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
        private final UserRepository userRepository;

    public GroupDTO createGroup(GroupDTO groupDTO) {

        String inviteCode = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 10);

        Group group = toEntity(groupDTO);

        group.setUser(userService.getCurrentUser());
        group.setInviteCode(inviteCode);

        Group savedGroup = groupRepository.save(group);

        Folder folder = Folder.builder().name("Folder").group(savedGroup).build();
        folderReposiory.save(folder);
        

        GroupMembers owner = GroupMembers.builder()
                .group(savedGroup)
                .user(userService.getCurrentUser())
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


    public GroupMembersDTO acceptJoinRequest(String requestId) {

        JoinRequest request = joinRequestRepository
                .findById(requestId)
                .orElseThrow(() ->
                        new RuntimeException("Join request not found")
                );

        Long groupId = Long.valueOf(request.getGroupId());
        Long userId = Long.valueOf(request.getUserId());

        Group group = groupRepository
                .findById(groupId)
                .orElseThrow(() ->
                        new RuntimeException("Group not found")
                );

        Long creatorId = userService.getCurrentUser().getId();

        if (!group.getUser().getId().equals(creatorId)) {
            throw new RuntimeException(
                    "Only group creator can accept request"
            );
        }

        if (request.getStatus() != JoinRequest.Status.PENDING) {
            throw new RuntimeException("Request is not pending");
        }

        if (groupMembersRepository
                .existsByGroupIdAndUserId(groupId, userId)) {

            throw new RuntimeException(
                    "User is already a member of this group"
            );
        }

        var user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

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
                .orElseThrow(() ->
                        new RuntimeException("Join request not found")
                );

        Long groupId = Long.valueOf(request.getGroupId());

        Group group = groupRepository
                .findById(groupId)
                .orElseThrow(() ->
                        new RuntimeException("Group not found")
                );

        Long creatorId = userService.getCurrentUser().getId();

        if (!group.getUser().getId().equals(creatorId)) {
            throw new RuntimeException(
                    "Only group creator can reject requests"
            );
        }

        if (request.getStatus() != JoinRequest.Status.PENDING) {
            throw new RuntimeException("Request is not pending");
        }

        request.setStatus(JoinRequest.Status.REJECTED);
        request.setRespondedAt(LocalDateTime.now());

        return joinRequestRepository.save(request);
    }

    public String removeGroupMember(long groupMemberId,long groupId){
        Long currentUserId =userService.getCurrentUser().getId();
        Group group = groupRepository.findById(groupId)
                .orElseThrow(()-> new RuntimeException("Group not found"));
        if (!group.getUser().getId().equals(currentUserId)) {
            return "You can't delete memer of this group";
        }
        if(!groupMembersRepository.existsByIdAndGroupId(groupMemberId, groupId)){
                return "Member not present";
        }
        GroupMembers members = groupMembersRepository.findByIdAndGroupId(groupMemberId,groupId);
        if(members == null){
                return "Member not found in the this group";
        }

        groupMembersRepository.delete(members);
        return "Member deleted successfully";

    }

    @Transactional(readOnly = true)
    public GroupDTO getGroup(long id) {

        Group group = groupRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Group not found")
                );

        return toDTO(group);
    }

    @Transactional
        public JoinRequest requestToJoin(String inviteCode) {

        Group group = groupRepository
                .findByInviteCode(inviteCode)
                .orElseThrow(() ->
                        new RuntimeException("Invalid invite code")
                );

        Long userId = userService.getCurrentUser().getId();

        if (group.getUser().getId().equals(userId)) {
                throw new RuntimeException(
                        "You are already the owner of this group"
                );
        }

        if (groupMembersRepository.existsByGroupIdAndUserId(group.getId(),userId)) {
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

        groupRepository.delete(group);

        return "Group deleted successfully";
    }

    public String changeRole(long memeberId, long groupId, Role role){
        Group group = groupRepository.findById(groupId)
                .orElseThrow(()-> new RuntimeException("Group not found"));

        GroupMembers member = groupMembersRepository.findById(memeberId)
                        .orElseThrow(()-> new RuntimeException("Member not found"));

        long CurrentUser = userService.getCurrentUser().getId();
        if(!groupMembersRepository.existsByGroupIdAndUserId(groupId, memeberId)){
                throw new RuntimeException("User not found in the group");
        }

        GroupMembers groupMember = groupMembersRepository.findByIdAndGroupId(memeberId, groupId);

        List<GroupMembersDTO> owners = groupMembersService.getByGroupmembersByRole(groupId, Role.OWNER);
        boolean isOwner = owners.stream().anyMatch(owner -> owner.getUser().getId().equals(CurrentUser));
        if(!isOwner){
                throw new RuntimeException("You are not admin to change role !");
        }
        groupMember.setRole(Role.ADMIN);
        groupMembersRepository.save(groupMember);
        return "Role change successfully !";

    }

    @Transactional(readOnly = true)
    public List<GroupDTO> getAllGroups() {

        List<Group> groups = groupRepository
                .findByUserId(
                        userService.getCurrentUser().getId()
                )
                .orElse(List.of());

        return groups.stream()
                .map(this::toDTO)
                .toList();
    }

    public GroupDTO toDTO(Group group) {

        return GroupDTO.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .createdAt(group.getCreatedAt())
                .driveFolderId(group.getDriveFolderId())
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