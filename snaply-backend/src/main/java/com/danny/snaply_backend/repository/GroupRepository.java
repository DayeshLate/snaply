package com.danny.snaply_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danny.snaply_backend.entity.Group;

public interface GroupRepository extends JpaRepository<Group,Long>{
    
}
