package com.danny.snaply_backend.controller;

import com.danny.snaply_backend.dto.GroupDTO;
import com.danny.snaply_backend.entity.GroupMembers;
import com.danny.snaply_backend.entity.JoinRequest;
import com.danny.snaply_backend.service.GroupMembersService;
import com.danny.snaply_backend.service.GroupService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/group")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;
    private final GroupMembersService groupMembersService;

    @PostMapping("/create")
    public ResponseEntity<GroupDTO> createGroup(
            @RequestBody GroupDTO groupDTO
    ) {

        GroupDTO createdGroup =
                groupService.createGroup(groupDTO);

        return ResponseEntity.ok(createdGroup);
    }


    @PostMapping("/join/{inviteCode}")
    public ResponseEntity<JoinRequest> requestToJoin(
            @PathVariable String inviteCode
    ) {

        JoinRequest request =
                groupService.requestToJoin(inviteCode);

        return ResponseEntity.ok(request);
    }

    @PostMapping("/requests/{requestId}/accept")
    public ResponseEntity<GroupMembers> acceptRequest(
            @PathVariable String requestId
    ) {

        GroupMembers member =groupMembersService.toEntity(groupService.acceptJoinRequest(requestId));

        return ResponseEntity.ok(member);
    }

    @PostMapping("/requests/{requestId}/reject")
    public ResponseEntity<JoinRequest> rejectRequest(
            @PathVariable String requestId
    ) {

        JoinRequest request =
                groupService.rejectRequest(requestId);

        return ResponseEntity.ok(request);
    }

    @PostMapping("/delete/{groupId}/member/{membarId}")
    public ResponseEntity<String> deleteMember(@PathVariable long groupId, @PathVariable long memberId){
        String response = groupService.removeGroupMember(memberId, groupId);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/get/{id}")
    public ResponseEntity<GroupDTO> getGroup(
            @PathVariable long id
    ) {

        GroupDTO group =
                groupService.getGroup(id);

        return ResponseEntity.ok(group);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteGroup(@PathVariable long id) {

        String result =groupService.deleteGroup(id);

        return ResponseEntity.ok(result);
    }


    @GetMapping("/getAll")
    public ResponseEntity<List<GroupDTO>> getAllGroups() {

        return ResponseEntity.ok(
                groupService.getAllGroups()
        );
    }
}