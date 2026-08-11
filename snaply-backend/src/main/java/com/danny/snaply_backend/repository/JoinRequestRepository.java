package com.danny.snaply_backend.repository;

import com.danny.snaply_backend.entity.JoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JoinRequestRepository
        extends JpaRepository<JoinRequest, String> {

    Optional<JoinRequest> findByGroupIdAndUserId(
            String groupId,
            String userId
    );

    

    List<JoinRequest> findByGroupIdAndStatus(
            String groupId,
            JoinRequest.Status status
    );
}
