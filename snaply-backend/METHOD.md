# 1. User
Service
UserResponseDto register(UserRequestDto request);

UserResponseDto login(LoginRequestDto request);

UserResponseDto getUserById(UUID userId);

List<UserResponseDto> getAllUsers();

UserResponseDto updateUser(UUID userId, UpdateUserDto request);

void deleteUser(UUID userId);

UserResponseDto updateProfileImage(UUID userId, MultipartFile image);

void connectGoogleDrive(UUID userId, GoogleDriveDto dto);

void disconnectGoogleDrive(UUID userId);

UserResponseDto refreshToken(String refreshToken);

UserResponseDto getCurrentUser();
Controller
POST /users/register

POST /users/login

GET /users/me

GET /users

GET /users/{id}

PUT /users/{id}

DELETE /users/{id}

POST /users/{id}/profile-image

POST /users/{id}/drive/connect

DELETE /users/{id}/drive/disconnect

POST /users/refresh-token

# 2. Group
Service
GroupResponseDto createGroup(CreateGroupDto dto);

GroupResponseDto getGroup(UUID groupId);

List<GroupResponseDto> getAllGroups();

List<GroupResponseDto> getGroupsByUser(UUID userId);

GroupResponseDto updateGroup(UUID groupId, UpdateGroupDto dto);

void deleteGroup(UUID groupId);

void assignDriveFolder(UUID groupId, String driveFolderId);
Controller
POST /groups

GET /groups

GET /groups/{id}

GET /groups/user/{userId}

PUT /groups/{id}

DELETE /groups/{id}


# 3. Group Members
Service
GroupMemberResponseDto addMember(AddMemberDto dto);

void removeMember(UUID groupId, UUID userId);

GroupMemberResponseDto updateMemberRole(UUID groupId,
                                        UUID userId,
                                        Role role);

List<GroupMemberResponseDto> getMembers(UUID groupId);

List<GroupResponseDto> getJoinedGroups(UUID userId);

boolean isMember(UUID groupId, UUID userId);

boolean isAdmin(UUID groupId, UUID userId);
Controller
POST /group-members

DELETE /group-members/{groupId}/{userId}

PUT /group-members/{groupId}/{userId}/role

GET /group-members/group/{groupId}

GET /group-members/user/{userId}


# 4. Folder
Service
FolderResponseDto createFolder(CreateFolderDto dto);

FolderResponseDto renameFolder(UUID folderId,
                               RenameFolderDto dto);

void deleteFolder(UUID folderId);

FolderResponseDto getFolder(UUID folderId);

List<FolderResponseDto> getRootFolders(UUID groupId);

List<FolderResponseDto> getChildFolders(UUID parentFolderId);

FolderResponseDto moveFolder(UUID folderId,
                             UUID newParentId);
Controller
POST /folders

GET /folders/{id}

GET /folders/group/{groupId}

GET /folders/{parentId}/children

PUT /folders/{id}

PUT /folders/{id}/move

DELETE /folders/{id}


# 5. Media
Service
MediaResponseDto uploadMedia(MediaUploadDto dto);

MediaResponseDto getMedia(UUID mediaId);

List<MediaResponseDto> getGroupMedia(UUID groupId);

List<MediaResponseDto> getFolderMedia(UUID folderId);

MediaResponseDto renameMedia(UUID mediaId,
                             RenameMediaDto dto);

void moveMedia(UUID mediaId,
               UUID folderId);

void deleteMedia(UUID mediaId);

String generateDownloadLink(UUID mediaId);

List<MediaResponseDto> searchMedia(String keyword);
Controller
POST /media/upload

GET /media/{id}

GET /media/group/{groupId}

GET /media/folder/{folderId}

PUT /media/{id}

PUT /media/{id}/move

DELETE /media/{id}

GET /media/{id}/download

GET /media/search


# 6. Media Embedding
Service
MediaEmbeddingResponseDto createEmbedding(UUID mediaId);

MediaEmbeddingResponseDto getEmbedding(UUID mediaId);

List<SearchResultDto> semanticSearch(SearchRequestDto dto);

void regenerateEmbedding(UUID mediaId);

void deleteEmbedding(UUID mediaId);
Controller
POST /embeddings

GET /embeddings/{mediaId}

POST /embeddings/search

PUT /embeddings/{mediaId}

DELETE /embeddings/{mediaId}

# 7. Chat Messages
Service
ChatMessageResponseDto sendMessage(ChatMessageDto dto);

List<ChatMessageResponseDto> getGroupMessages(UUID groupId);

ChatMessageResponseDto updateMessage(UUID messageId,
                                     UpdateMessageDto dto);

void deleteMessage(UUID messageId);

List<ChatMessageResponseDto> searchMessages(UUID groupId,
                                            String keyword);

List<ChatMessageResponseDto> getMessagesWithMedia(UUID groupId);
Controller
POST /chat/messages

GET /chat/messages/group/{groupId}

PUT /chat/messages/{id}

DELETE /chat/messages/{id}

GET /chat/messages/search


# 8. Notification
Service
NotificationResponseDto createNotification(NotificationDto dto);

List<NotificationResponseDto> getNotifications(UUID userId);

NotificationResponseDto getNotification(UUID notificationId);

void markAsRead(UUID notificationId);

void markAllAsRead(UUID userId);

void deleteNotification(UUID notificationId);

long getUnreadCount(UUID userId);
Controller
POST /notifications

GET /notifications/user/{userId}

GET /notifications/{id}

PUT /notifications/{id}/read

PUT /notifications/user/{userId}/read-all

DELETE /notifications/{id}

GET /notifications/user/{userId}/unread-count
Additional services you'll likely need



# Besides the entity-specific services, this application would typically include:

AuthenticationService
Register
Login
Refresh token
Logout
Forgot password
Reset password
Verify email
GoogleDriveService
Create Drive folder
Upload file
Download file
Delete file
Move file
Rename file
Generate shareable link
AIService
Generate embeddings
Semantic search
Summarize content
Answer questions over uploaded media
RedisCacheService (or use Spring Cache annotations in existing services)
Cache user
Cache group
Evict caches
Refresh caches
WebSocketService
Send chat messages in real time
Broadcast notifications
Group presence/status

This gives you a solid, feature-oriented API surface for your schema while keeping responsibilities separated across services.























If you already have a GroupMemberMapper

Even better:

public Group toEntity(GroupDTO dto) {

    Group group = Group.builder()
            .id(dto.getId())
            .name(dto.getName())
            .description(dto.getDescription())
            .createdAt(dto.getCreatedAt())
            .driveFolderId(dto.getDriveFolderId())
            .build();

    if (dto.getGroupMembers() != null) {
        List<GroupMember> members = dto.getGroupMembers()
                .stream()
                .map(groupMemberMapper::toEntity)
                .peek(member -> member.setGroup(group))
                .toList();

        group.setGroupMembers(members);
    }

    return group;
}
If GroupMember has a User

Typically you'll need to fetch the user:

User user = userRepository.findById(memberDto.getUserId())
        .orElseThrow(() -> new RuntimeException("User not found"));