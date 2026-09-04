package com.danny.snaply_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "google_id", unique = true)
    private String googleId;

    @Column(nullable = false)
    private String name;
   
    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "google_email", unique = true)
    private String googleEmail;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "email_verified", nullable = false)
    @Builder.Default
    private boolean emailVerified = true;

    @Column(name = "refresh_token")
    private String refreshToken;

    @Column(name = "drive_root_folder_id")
    private String driveRootFolderId;

    @Column(name = "group_folders")
    @OneToMany(mappedBy = "owner", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnore
    @Builder.Default
    private List<Folder> folder = new ArrayList<>();

    @Column(name = "is_drive_connected")
    @Builder.Default
    private boolean isDriveConnected = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.USER;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Group> groups = new ArrayList<>();

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<GroupMembers> groupMemberships = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Notification> notifications = new ArrayList<>();

    @OneToMany(mappedBy = "uplodedBy", cascade = CascadeType.ALL, fetch = FetchType.LAZY,orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<Media> media = new ArrayList<>();

    @Builder.Default
    private boolean enabled = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Role {
        USER,
        ADMIN
    }
}