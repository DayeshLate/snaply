package com.danny.snaply_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.danny.snaply_backend.entity.Group;

public interface GroupRepository extends JpaRepository<Group,Long>{
    Optional<List<Group>> findByUserId(Long userId);

    Optional<Group> findByInviteCode(String inviteCode);

    boolean existsByInviteCode(String inviteCode);
}
