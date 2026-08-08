package com.danny.snaply_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.danny.snaply_backend.dto.GroupDTO;
import com.danny.snaply_backend.service.GroupService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/group")
@RequiredArgsConstructor
public class GroupController{

    private final GroupService groupService;

    @PostMapping("/create")
    public ResponseEntity<GroupDTO> createGroup(@RequestBody GroupDTO groupDTO){
        GroupDTO createdGroup = groupService.createGroup(groupDTO);
        return ResponseEntity.ok(createdGroup); 
    }

    @GetMapping("/get")
    public ResponseEntity<GroupDTO> getGroup(@RequestParam long id){
        GroupDTO group = groupService.getGroup(id);
        return ResponseEntity.ok(group);
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteGroup(@PathVariable long id){
        String str = groupService.deleteGroup(id);
        return ResponseEntity.ok(str);
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllGroups(){
        return ResponseEntity.ok(groupService.getAllGroups());
    }
    

}