package com.danny.snaply_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danny.snaply_backend.entity.Media;

public interface MediaRepository extends JpaRepository<Media,Long>{
    
}
