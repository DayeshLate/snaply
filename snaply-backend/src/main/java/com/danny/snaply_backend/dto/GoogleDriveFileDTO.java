package com.danny.snaply_backend.dto;

import java.math.BigInteger;

public record GoogleDriveFileDTO(
        String id,
        String name,
        String mimeType,
        BigInteger size,
        String webViewLink,
        String webContentLink
) {}
