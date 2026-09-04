package com.danny.snaply_backend.service;

import org.springframework.stereotype.Service;

import com.danny.snaply_backend.repository.JoinRequestRepository;

import lombok.RequiredArgsConstructor;


@Service 
@RequiredArgsConstructor 
public class JoinRequest {
    
    private final JoinRequestRepository joinRequestRepository;
    private final JoinRequest jointRequest;



}
