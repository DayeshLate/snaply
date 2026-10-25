package com.danny.snaply_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.danny.snaply_backend.entity.Group;

public interface GroupRepository extends JpaRepository<Group,Long>{
    Optional<List<Group>> findByUserId(Long userId);

    Optional<Group> findByInviteCode(String inviteCode);

    @Query("SELECT g FROM Group g WHERE LOWER(TRIM(g.inviteCode)) = LOWER(TRIM(:inviteCode))")
    Optional<Group> findByInviteCodeIgnoreCase(@Param("inviteCode") String inviteCode);

    boolean existsByInviteCode(String inviteCode);

    boolean existsByIdAndUserId(Long id, Long userId);
}
