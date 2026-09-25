package com.danny.snaply_backend.dto;

public record GoogleDriveStatusDTO(
        boolean connected,
        String googleEmail,
        String googleId,
        String driveRootFolderId
) {}
