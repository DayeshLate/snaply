package com.danny.snaply_backend.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import com.danny.snaply_backend.dto.JoinRequestDTO;
import com.danny.snaply_backend.entity.JoinRequest;
import com.danny.snaply_backend.repository.JoinRequestRepository;

import lombok.RequiredArgsConstructor;


@Service 
@RequiredArgsConstructor
public class JoinRequestService {
    
    private final JoinRequestRepository joinRequestRepository;
    private final UserService userService;

    public List<JoinRequestDTO> getRequestByUserId(){
        Long user = userService.getCurrentUser().getId();
        Optional<List<JoinRequest>> joinRequestByUser = joinRequestRepository.findByUserId(user.toString());
        if(joinRequestByUser.isEmpty()){
            return Collections.emptyList();
        }
        return joinRequestByUser.get().stream().map(this::toDTO).toList();

    }

    public List<JoinRequestDTO> getRequestByGroupId(String groupId){
        Optional<List<JoinRequest>> joinRequestByGroup = joinRequestRepository.findByGroupId(groupId);
        if(joinRequestByGroup.isEmpty()){
            return Collections.emptyList();
        }
        return joinRequestByGroup.get().stream().map(this::toDTO).toList();
    }
    public JoinRequestDTO getRequestById(String id){
        JoinRequest request = joinRequestRepository.findById(id)
            .orElseThrow(()-> new RuntimeException("Request not found"));
        return toDTO(request);
    }

    public JoinRequestDTO toDTO(JoinRequest entity){
        return JoinRequestDTO.builder()
            .id(entity.getId())
            .groupId(entity.getGroupId())
            .userId(entity.getUserId())
            .requestAt(entity.getRequestedAt())
            .respondedAt(entity.getRespondedAt())
            .status(entity.getStatus())
            .build();
    }

    public JoinRequest toEntity(JoinRequestDTO dto){
        return JoinRequest.builder()
            .id(dto.getId())
            .groupId(dto.getGroupId())
            .userId(dto.getUserId())
            .status(dto.getStatus())
            .requestedAt(dto.getRequestAt())
            .respondedAt(dto.getRespondedAt())
            .build();
    }

}
