package com.danny.snaply_backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "groups")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Group {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @Column(name = "drive_folder_id", nullable = false)
    private String driveFolderId;

    @Column(name = "groupdp")
    private String groupdp;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @JoinColumn(name = "group_created_by", nullable = false)
    private User user;
    
    public void createTime(){
        this.createdAt = LocalDateTime.now();
    }

}