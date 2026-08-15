package com.danny.snaply_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danny.snaply_backend.entity.Folder;

public interface FolderReposiory extends JpaRepository<Folder,Long> {
    
}
