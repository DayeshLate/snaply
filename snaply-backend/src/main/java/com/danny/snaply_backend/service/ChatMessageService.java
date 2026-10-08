package com.danny.snaply_backend.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.danny.snaply_backend.config.CacheConstants;
import com.danny.snaply_backend.dto.ChatMessageRequestDTO;
import com.danny.snaply_backend.dto.ChatMessageResponseDTO;
import com.danny.snaply_backend.entity.ChatMessage;
import com.danny.snaply_backend.entity.Group;
import com.danny.snaply_backend.entity.GroupMembers;
import com.danny.snaply_backend.entity.Media;
import com.danny.snaply_backend.entity.Role;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.repository.ChatMessageRepository;
import com.danny.snaply_backend.repository.GroupMembersRepository;
import com.danny.snaply_backend.repository.GroupRepository;
import com.danny.snaply_backend.repository.MediaRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final GroupRepository groupRepository;
    private final GroupMembersRepository groupMembersRepository;
    private final MediaRepository mediaRepository;
    private final UserService userService;

    @CacheEvict(value = CacheConstants.CHAT_MESSAGES_BY_GROUP, key = "#groupId")
    public ChatMessageResponseDTO sendMessage(Long groupId, ChatMessageRequestDTO request) {
        User currentUser = userService.getCurrentUser();
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found with ID: " + groupId));

        validateMemberAccess(groupId, currentUser);

        String messageText = request.getMessage() != null ? request.getMessage().trim() : null;
        Long mediaId = request.getMediaId();

        if ((messageText == null || messageText.isBlank()) && mediaId == null) {
            throw new RuntimeException("Message cannot be empty without a media attachment");
        }

        Media media = null;
        if (mediaId != null) {
            media = mediaRepository.findById(mediaId)
                    .orElseThrow(() -> new RuntimeException("Media not found with ID: " + mediaId));

            if (media.getFolder() == null || media.getFolder().getGroup() == null
                    || !media.getFolder().getGroup().getId().equals(groupId)) {
                throw new RuntimeException("Media attachment does not belong to this group");
            }
        }

        ChatMessage chatMessage = ChatMessage.builder()
                .group(group)
                .sender(currentUser)
                .message(messageText)
                .media(media)
                .build();

        ChatMessage saved = chatMessageRepository.save(chatMessage);
        log.info("Chat message {} sent by user {} in group {}", saved.getId(), currentUser.getEmail(), groupId);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = CacheConstants.CHAT_MESSAGES_BY_GROUP, key = "#groupId")
    public List<ChatMessageResponseDTO> getGroupMessages(Long groupId) {
        User currentUser = userService.getCurrentUser();
        validateMemberAccess(groupId, currentUser);
        return chatMessageRepository.findByGroupIdOrderByCreatedAtAsc(groupId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<ChatMessageResponseDTO> getGroupMessagesPaginated(Long groupId, int page, int size) {
        User currentUser = userService.getCurrentUser();
        validateMemberAccess(groupId, currentUser);
        Pageable pageable = PageRequest.of(page, size);
        return chatMessageRepository.findByGroupIdOrderByCreatedAtDesc(groupId, pageable)
                .map(this::toDTO);
    }

    @CacheEvict(value = CacheConstants.CHAT_MESSAGES_BY_GROUP, allEntries = true)
    public String deleteMessage(Long messageId) {
        User currentUser = userService.getCurrentUser();
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found with ID: " + messageId));

        Long groupId = message.getGroup().getId();
        boolean isSender = message.getSender() != null && message.getSender().getId().equals(currentUser.getId());
        boolean isGroupOwner = message.getGroup().getUser() != null && message.getGroup().getUser().getId().equals(currentUser.getId());

        GroupMembers member = groupMembersRepository.findByUserIdAndGroupId(currentUser.getId(), groupId);
        boolean isGroupAdmin = member != null && member.isAccepted() && member.getRole() == Role.ADMIN;

        if (!isSender && !isGroupOwner && !isGroupAdmin) {
            throw new RuntimeException("Access Denied: Only the message sender, group owner, or group admin can delete this message");
        }

        chatMessageRepository.delete(message);
        return "Message deleted successfully";
    }

    private void validateMemberAccess(Long groupId, User currentUser) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found with ID: " + groupId));

        boolean isOwner = group.getUser() != null && group.getUser().getId().equals(currentUser.getId());
        boolean isMember = groupMembersRepository.existsByGroupIdAndUserId(groupId, currentUser.getId());

        if (!isOwner && !isMember) {
            throw new RuntimeException("Access Denied: You are not a member of this group");
        }

        if (!isOwner) {
            GroupMembers member = groupMembersRepository.findByUserIdAndGroupId(currentUser.getId(), groupId);
            if (member == null || !member.isAccepted()) {
                throw new RuntimeException("Access Denied: You are not an active member of this group");
            }
        }
    }

    public ChatMessageResponseDTO toDTO(ChatMessage message) {
        if (message == null) return null;
        Media media = message.getMedia();
        User sender = message.getSender();
        return ChatMessageResponseDTO.builder()
                .id(message.getId())
                .groupId(message.getGroup() != null ? message.getGroup().getId() : null)
                .senderId(sender != null ? sender.getId() : null)
                .senderName(sender != null ? sender.getName() : null)
                .senderEmail(sender != null ? sender.getEmail() : null)
                .senderProfilePicture(sender != null ? sender.getProfilePicture() : null)
                .message(message.getMessage())
                .mediaId(media != null ? media.getId() : null)
                .mediaUrl(media != null ? media.getFileUrl() : null)
                .mediaFileName(media != null ? media.getFileName() : null)
                .mediaMimeType(media != null ? media.getMimeType() : null)
                .createdAt(message.getCreatedAt())
                .build();
    }
}
