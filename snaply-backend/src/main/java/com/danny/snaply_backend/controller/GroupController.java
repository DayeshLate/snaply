package com.danny.snaply_backend.controller;

import com.danny.snaply_backend.dto.AddMemberRequest;
import com.danny.snaply_backend.dto.GroupDTO;
import com.danny.snaply_backend.dto.GroupMembersDTO;
import com.danny.snaply_backend.entity.GroupMembers;
import com.danny.snaply_backend.entity.JoinRequest;
import com.danny.snaply_backend.entity.Role;
import com.danny.snaply_backend.service.GroupMembersService;
import com.danny.snaply_backend.service.GroupService;
import com.danny.snaply_backend.service.JoinRequestService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/group", "/groups", "/api/group", "/api/groups"})
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;
    private final GroupMembersService groupMembersService;
    private final JoinRequestService joinRequestService;

    @PostMapping("/create")
    public ResponseEntity<GroupDTO> createGroup(
            @RequestBody GroupDTO groupDTO
    ) {

        GroupDTO createdGroup =
                groupService.createGroup(groupDTO);

        return ResponseEntity.ok(createdGroup);
    }


    @PostMapping({"/join/{inviteCode}", "/request/{inviteCode}", "/join", "/request"})
    public ResponseEntity<JoinRequest> requestToJoin(
            @PathVariable(value = "inviteCode", required = false) String pathInviteCode,
            @RequestParam(value = "code", required = false) String paramInviteCode,
            @RequestBody(required = false) JoinCodeRequest body
    ) {
        String code = pathInviteCode != null && !pathInviteCode.isBlank() ? pathInviteCode :
                      (paramInviteCode != null && !paramInviteCode.isBlank() ? paramInviteCode :
                      (body != null && body.code() != null ? body.code() : (body != null ? body.inviteCode() : null)));

        JoinRequest request =
                groupService.requestToJoin(code);

        return ResponseEntity.ok(request);
    }

    public record JoinCodeRequest(String code, String inviteCode) {}

    @PostMapping("/requests/{requestId}/accept")
    public ResponseEntity<GroupMembers> acceptRequest(
            @PathVariable String requestId
    ) {

        GroupMembers member = groupMembersService.toEntity(joinRequestService.acceptJoinRequest(requestId));

        return ResponseEntity.ok(member);
    }

    @PostMapping("/requests/{requestId}/reject")
    public ResponseEntity<JoinRequest> rejectRequest(
            @PathVariable String requestId
    ) {

        JoinRequest request =
                joinRequestService.rejectRequest(requestId);

        return ResponseEntity.ok(request);
    }

    @PostMapping({"/{groupId}/members/add", "/{groupId}/add-member"})
    public ResponseEntity<GroupMembersDTO> addMember(
            @PathVariable long groupId,
            @RequestBody(required = false) AddMemberRequest request,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Role role
    ) {
        String targetEmail = (request != null && request.getEmail() != null && !request.getEmail().isBlank())
                ? request.getEmail()
                : email;
        Role targetRole = (request != null && request.getRole() != null)
                ? request.getRole()
                : (role != null ? role : Role.EDITOR);

        if (targetEmail == null || targetEmail.isBlank()) {
            throw new IllegalArgumentException("Email is required to add a member");
        }

        GroupMembersDTO addedMember = groupService.addMemberByEmail(groupId, targetEmail.trim(), targetRole);
        return ResponseEntity.ok(addedMember);
    }

    @PostMapping("/delete/{groupId}/member/{memberId}")
    public ResponseEntity<String> deleteMember(@PathVariable long groupId, @PathVariable long memberId){
        String response = groupService.removeGroupMember(memberId, groupId);
        return ResponseEntity.ok(response);
    }


    @GetMapping({"/get/{id}", "/{id}"})
    public ResponseEntity<GroupDTO> getGroup(
            @PathVariable long id
    ) {

        GroupDTO group =
                groupService.getGroup(id);

        return ResponseEntity.ok(group);
    }


    @DeleteMapping({"/delete/{id}", "/{id}"})
    public ResponseEntity<String> deleteGroup(@PathVariable long id) {

        String result =groupService.deleteGroup(id);

        return ResponseEntity.ok(result);
    }


    @GetMapping({"/getAll", "/getAllGroups", ""})
    public ResponseEntity<List<GroupDTO>> getAllGroups() {

        return ResponseEntity.ok(
                groupService.getAllGroups()
        );
    }

    @PostMapping("/changeRole/{groupId}/{groupMember}")
    public ResponseEntity<String> changeRole(
            @PathVariable long groupId,
            @PathVariable long groupMember,
            @RequestParam Role role
    ) {
        return ResponseEntity.ok(groupService.changeRole(groupMember, groupId, role));
    }

    
}