package com.danny.snaply_backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.danny.snaply_backend.dto.ChatMessageRequestDTO;
import com.danny.snaply_backend.dto.ChatMessageResponseDTO;
import com.danny.snaply_backend.service.ChatMessageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageService chatMessageService;

    @PostMapping("/{groupId}/send")
    public ResponseEntity<ChatMessageResponseDTO> sendMessage(
            @PathVariable Long groupId,
            @RequestBody ChatMessageRequestDTO request
    ) {
        ChatMessageResponseDTO response = chatMessageService.sendMessage(groupId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{groupId}/messages")
    public ResponseEntity<List<ChatMessageResponseDTO>> getGroupMessages(
            @PathVariable Long groupId
    ) {
        List<ChatMessageResponseDTO> messages = chatMessageService.getGroupMessages(groupId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/{groupId}/messages/paged")
    public ResponseEntity<Page<ChatMessageResponseDTO>> getGroupMessagesPaged(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        int boundedPage = Math.max(page, 0);
        int boundedSize = Math.min(Math.max(size, 1), 100);
        Page<ChatMessageResponseDTO> messages = chatMessageService.getGroupMessagesPaginated(groupId, boundedPage, boundedSize);
        return ResponseEntity.ok(messages);
    }

    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<String> deleteMessage(
            @PathVariable Long messageId
    ) {
        String result = chatMessageService.deleteMessage(messageId);
        return ResponseEntity.ok(result);
    }
}
