package com.danny.snaply_backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponseDTO {

    private Long id;

    private Long groupId;

    private Long senderId;

    private String senderName;

    private String senderEmail;

    private String senderProfilePicture;

    private String message;

    private Long mediaId;

    private String mediaUrl;

    private String mediaFileName;

    private String mediaMimeType;

    private LocalDateTime createdAt;
}
