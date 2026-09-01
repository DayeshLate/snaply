package com.danny.snaply_backend.config;

public final class CacheConstants {

    public static final String USERS_BY_EMAIL = "usersByEmail";
    public static final String USERS_BY_GOOGLE_ID = "usersByGoogleId";
    public static final String ALBUMS = "albums";
    public static final String PHOTOS = "photos";
    public static final String FOLDERS_BY_ID = "foldersById";
    public static final String FOLDERS_ALL = "foldersAll";
    public static final String GROUP_MEMBERS_BY_GROUP = "groupMembersByGroup";
    public static final String GROUP_MEMBERS_BY_ROLE = "groupMembersByRole";
    public static final String GROUP_MEMBERS_BY_USER_AND_GROUP = "groupMembersByUserAndGroup";
    public static final String GROUP_MEMBER_EXISTS_BY_USER_AND_GROUP = "groupMemberExistsByUserAndGroup";
    public static final String AUTH_VERIFICATION = "auth:verification:";
    public static final String AUTH_SESSION = "auth:session:";
    public static final String AUTH_COOKIE = "snaply_access_token";

    private CacheConstants() {}
}