package com.danny.snaply_backend.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserDriveAccount {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private String id;

    @Column(nullable = false)
    private String driveRootFolderId;

    @Column(nullable = false)
    private String googleEmail;

    private String accessToken;

    private String refreshToken;

    @Column(nullable = false)
    private Long tokenExpiry;

    @Column(nullable = false)
    @Builder.Default
    private boolean connected=false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "ownerDriveAccount", cascade = jakarta.persistence.CascadeType.ALL, fetch = FetchType.LAZY,orphanRemoval = true)
    private List<Group> groups = new ArrayList<>();

    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    public void createTime(){
        this.createdAt = LocalDateTime.now();
    }
}
