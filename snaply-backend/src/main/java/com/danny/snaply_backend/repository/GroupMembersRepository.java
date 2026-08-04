package com.danny.snaply_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danny.snaply_backend.entity.GroupMembers;

public interface GroupMembersRepository extends JpaRepository<GroupMembers,Long> {
    
}
