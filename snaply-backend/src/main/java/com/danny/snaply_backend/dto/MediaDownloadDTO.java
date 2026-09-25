package com.danny.snaply_backend.dto;

public record MediaDownloadDTO(
        String fileName,
        String mimeType,
        byte[] data
) {}
