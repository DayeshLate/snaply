package com.danny.snaply_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danny.snaply_backend.dto.GroupMembersDTO;
import com.danny.snaply_backend.dto.JoinRequestDTO;
import com.danny.snaply_backend.entity.JoinRequest;
import com.danny.snaply_backend.service.JoinRequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/JoinRequest")
@RequiredArgsConstructor
public class JoinRequestController {
    private final JoinRequestService joinRequestService;

    @GetMapping("/getAll")
    public ResponseEntity<List<JoinRequestDTO>> getAllByUser(){
        List<JoinRequestDTO> list = joinRequestService.getRequestByUserId();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/getByGroup/{groupId}")
    public ResponseEntity<List<JoinRequestDTO>> getRequestByGroup(@PathVariable Long groupId){
        List<JoinRequestDTO> list = joinRequestService.getRequestByGroupId(groupId.toString());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<JoinRequestDTO> getById(@PathVariable String id){
        JoinRequestDTO request = joinRequestService.getRequestById(id);
        return ResponseEntity.ok(request);
    }

    @PostMapping("/{requestId}/accept")
    public ResponseEntity<GroupMembersDTO> acceptRequestById(@PathVariable("requestId") String requestId){
        GroupMembersDTO member = joinRequestService.acceptJoinRequest(requestId);
        return ResponseEntity.ok(member);
    }

    @PostMapping("/{requestId}/reject")
    public ResponseEntity<JoinRequestDTO> rejectRequestById(@PathVariable("requestId") String requestId){
        JoinRequest request = joinRequestService.rejectRequest(requestId);
        return ResponseEntity.ok(joinRequestService.toDTO(request));
    }
}
