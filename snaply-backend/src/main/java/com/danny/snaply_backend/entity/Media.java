package com.danny.snaply_backend.entity;

import java.math.BigInteger;
import java.time.LocalDateTime;

import jakarta.annotation.Generated;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Media {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String mimeType;

    private BigInteger fileSize;

    private String driveFileId;

    private String fileUrl;

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uplodedBy",nullable = false)
    private User uplodedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id",nullable = false)
    private Folder folder;

    // folder uplodedBy

    @PrePersist
    public void createAt(){
        this.createdAt = LocalDateTime.now();
    }
}
