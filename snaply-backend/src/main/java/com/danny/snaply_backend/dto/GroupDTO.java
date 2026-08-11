package com.danny.snaply_backend.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.danny.snaply_backend.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupDTO {


    public Long id;

    public String name;

    public String description;

    public String driveFolderId;

    public String groupDp;

    public LocalDateTime createdAt;

    public List<GroupMembersDTO> groupMembers = new ArrayList<>();

    public User user;

    public String inviteCode;

}
