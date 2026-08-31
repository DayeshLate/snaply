package com.danny.snaply_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danny.snaply_backend.dto.FolderDTO;
import com.danny.snaply_backend.entity.Folder;
import com.danny.snaply_backend.service.FolderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/folder")
@RequiredArgsConstructor
public class FolderController {

    public final FolderService folderService;
    
    @GetMapping("/getAllFolders")
    public ResponseEntity<List<FolderDTO>> getAllFolders(){
        return ResponseEntity.ok(folderService.getAllFolders());
    }

    @PostMapping("/addFolder/{groupId}")
    public ResponseEntity<String> addFolderInGroup(@RequestBody Folder folder, @PathVariable Long groupId){
        String result = folderService.addFolderInGroup(groupId, folder);
        return ResponseEntity.ok(result);
    }

        
    @DeleteMapping("/deleteFolderByAdmin/{groupId}/{folderId}")
    public ResponseEntity<String> deleteFolderByAdmin(@PathVariable Long groupId,@PathVariable Long folderId){
        String result = folderService.deleteFolderByAdmin(groupId, folderId);
        return ResponseEntity.ok(result);
    }


    @DeleteMapping("/deleteFolderByOwner/{groupId}/{folderId}")
    public ResponseEntity<String> deleteFolderByOwner(@PathVariable Long groupId,@PathVariable Long folderId){
        String result = folderService.deleteFolderByOwner(groupId, folderId);
        return ResponseEntity.ok(result);
    }
}
