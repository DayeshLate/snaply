import {
  MOCK_USER,
  INITIAL_GROUPS,
  INITIAL_FOLDERS,
  INITIAL_MEDIA,
  INITIAL_MESSAGES,
  INITIAL_JOIN_REQUESTS,
  INITIAL_NOTIFICATIONS,
} from './mockData';

const STORAGE_KEY = 'snaply_mock_db_v1';

class MockStore {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }

    return {
      user: { ...MOCK_USER },
      groups: JSON.parse(JSON.stringify(INITIAL_GROUPS)),
      folders: JSON.parse(JSON.stringify(INITIAL_FOLDERS)),
      media: JSON.parse(JSON.stringify(INITIAL_MEDIA)),
      messages: JSON.parse(JSON.stringify(INITIAL_MESSAGES)),
      joinRequests: JSON.parse(JSON.stringify(INITIAL_JOIN_REQUESTS)),
      notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),
      driveConnected: true,
    };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      // ignore
    }
  }

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.load();
  }

  // Auth
  getUser() {
    return this.data.user;
  }

  // Groups
  getGroups() {
    return this.data.groups;
  }

  getGroup(id) {
    const numId = Number(id);
    const grp = this.data.groups.find((g) => g.id === numId);
    if (!grp) return null;
    // ensure folders have media
    const groupFolders = this.data.folders.filter((f) => f.groupId === numId);
    const membersList = (grp.groupMembers || grp.members || []).map((m) => ({
      ...m,
      userId: m.userId || m.user?.id,
      userName: m.userName || m.user?.name,
      userEmail: m.userEmail || m.user?.email,
    }));
    return {
      ...grp,
      members: membersList,
      groupMembers: membersList,
      folders: groupFolders.map((f) => ({
        ...f,
        media: this.data.media.filter((m) => m.folderId === f.id),
      })),
    };
  }

  createGroup({ name, description }) {
    const newId = Date.now();
    const newGroup = {
      id: newId,
      name,
      description: description || '',
      inviteCode: `SNAP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      role: 'OWNER',
      createdAt: new Date().toISOString(),
      user: this.data.user,
      members: [
        { id: Date.now(), user: this.data.user, role: 'OWNER', isAccepted: true },
      ],
      folders: [],
    };
    this.data.groups.unshift(newGroup);
    this.save();
    return newGroup;
  }

  deleteGroup(id) {
    const numId = Number(id);
    this.data.groups = this.data.groups.filter((g) => g.id !== numId);
    this.data.folders = this.data.folders.filter((f) => f.groupId !== numId);
    this.data.media = this.data.media.filter((m) => m.groupId !== numId);
    this.data.messages = this.data.messages.filter((msg) => msg.groupId !== numId);
    this.save();
    return { success: true };
  }

  removeMember(groupId, memberId) {
    const grp = this.data.groups.find((g) => g.id === Number(groupId));
    if (grp) {
      const targetId = Number(memberId);
      grp.members = (grp.members || []).filter((m) => m.id !== targetId && m.userId !== targetId);
      grp.groupMembers = grp.members;
      this.save();
    }
    return { success: true };
  }

  addMemberByEmail(groupId, email, role = 'EDITOR') {
    const grp = this.data.groups.find((g) => g.id === Number(groupId));
    if (!grp) throw new Error('Group not found');
    const normalizedEmail = email.trim().toLowerCase();

    const existing = (grp.members || grp.groupMembers || []).find(
      (m) =>
        (m.userEmail && m.userEmail.toLowerCase() === normalizedEmail) ||
        (m.user?.email && m.user.email.toLowerCase() === normalizedEmail)
    );
    if (existing) {
      throw new Error('User is already a member of this group');
    }

    const memberId = Date.now();
    const newMember = {
      id: memberId,
      userId: memberId + 100,
      userName: normalizedEmail.split('@')[0],
      userEmail: normalizedEmail,
      role: role || 'EDITOR',
      isAccepted: true,
      joinedAt: new Date().toISOString(),
      user: {
        id: memberId + 100,
        name: normalizedEmail.split('@')[0],
        email: normalizedEmail,
      },
    };

    if (!grp.members) grp.members = [];
    grp.members.push(newMember);
    grp.groupMembers = grp.members;
    this.save();
    return newMember;
  }

  changeRole(groupId, memberId, role) {
    const grp = this.data.groups.find((g) => g.id === Number(groupId));
    if (grp) {
      const targetId = Number(memberId);
      const m = (grp.members || []).find((mem) => mem.id === targetId || mem.userId === targetId);
      if (m) {
        m.role = role;
        grp.groupMembers = grp.members;
        this.save();
      }
    }
    return { success: true };
  }

  requestToJoin(inviteCode) {
    const grp = this.data.groups.find(
      (g) => g.inviteCode?.toLowerCase() === inviteCode?.toLowerCase()
    );
    const req = {
      id: `req-${Date.now()}`,
      groupId: grp ? String(grp.id) : '1',
      groupName: grp ? grp.name : 'Shared Memory Group',
      userName: this.data.user.name,
      userEmail: this.data.user.email,
      user: this.data.user,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
    };
    this.data.joinRequests.unshift(req);
    this.save();
    return req;
  }

  // Folders
  getFolders() {
    return this.data.folders.map((f) => ({
      ...f,
      media: this.data.media.filter((m) => m.folderId === f.id),
      group: this.data.groups.find((g) => g.id === f.groupId),
    }));
  }

  addFolder(groupId, name) {
    const newFolder = {
      id: Date.now(),
      groupId: Number(groupId),
      name,
      createdAt: new Date().toISOString(),
      media: [],
    };
    this.data.folders.push(newFolder);
    const grp = this.data.groups.find((g) => g.id === Number(groupId));
    if (grp) {
      if (!grp.folders) grp.folders = [];
      grp.folders.push(newFolder);
    }
    this.save();
    return newFolder;
  }

  deleteFolder(groupId, folderId) {
    const fId = Number(folderId);
    this.data.folders = this.data.folders.filter((f) => f.id !== fId);
    this.data.media = this.data.media.filter((m) => m.folderId !== fId);
    const grp = this.data.groups.find((g) => g.id === Number(groupId));
    if (grp && grp.folders) {
      grp.folders = grp.folders.filter((f) => f.id !== fId);
    }
    this.save();
    return { success: true };
  }

  // Media
  getMediaByFolder(folderId) {
    return this.data.media.filter((m) => m.folderId === Number(folderId));
  }

  getMediaByGroup(groupId) {
    return this.data.media.filter((m) => m.groupId === Number(groupId));
  }

  uploadMedia(file, folderId) {
    const folder = this.data.folders.find((f) => f.id === Number(folderId));
    const newMedia = {
      id: Date.now(),
      folderId: Number(folderId),
      groupId: folder ? folder.groupId : 1,
      fileName: file.name,
      fileSize: file.size,
      fileUrl: URL.createObjectURL(file),
      mimeType: file.type || 'image/jpeg',
      createdAt: new Date().toISOString(),
      uplodedBy: this.data.user.id,
    };
    this.data.media.unshift(newMedia);
    if (folder) {
      if (!folder.media) folder.media = [];
      folder.media.unshift(newMedia);
    }
    this.save();
    return newMedia;
  }

  deleteMedia(mediaId) {
    const mId = Number(mediaId);
    this.data.media = this.data.media.filter((m) => m.id !== mId);
    this.data.folders.forEach((f) => {
      if (f.media) f.media = f.media.filter((m) => m.id !== mId);
    });
    this.save();
    return { success: true };
  }

  // Messages
  getMessages(groupId) {
    return this.data.messages.filter((m) => m.groupId === Number(groupId));
  }

  sendMessage(groupId, { message, mediaId }) {
    const attachedMedia = mediaId
      ? this.data.media.find((m) => m.id === Number(mediaId))
      : null;

    const newMsg = {
      id: Date.now(),
      groupId: Number(groupId),
      senderId: this.data.user.id,
      senderName: this.data.user.name,
      message,
      mediaId: mediaId ? Number(mediaId) : null,
      media: attachedMedia,
      createdAt: new Date().toISOString(),
    };
    this.data.messages.push(newMsg);
    this.save();
    return newMsg;
  }

  deleteMessage(messageId) {
    this.data.messages = this.data.messages.filter(
      (m) => m.id !== Number(messageId)
    );
    this.save();
    return { success: true };
  }

  // Join Requests
  getJoinRequests(groupId) {
    return this.data.joinRequests.filter(
      (r) => r.groupId === String(groupId) && r.status === 'PENDING'
    );
  }

  getMyRequests() {
    return this.data.joinRequests;
  }

  acceptJoinRequest(requestId) {
    const req = this.data.joinRequests.find((r) => r.id === requestId);
    if (req) {
      req.status = 'ACCEPTED';
      const grp = this.data.groups.find((g) => String(g.id) === req.groupId);
      if (grp) {
        grp.members.push({
          id: Date.now(),
          user: req.user,
          role: 'VIEWER',
          isAccepted: true,
        });
      }
      this.save();
    }
    return { success: true };
  }

  rejectJoinRequest(requestId) {
    const req = this.data.joinRequests.find((r) => r.id === requestId);
    if (req) {
      req.status = 'REJECTED';
      this.save();
    }
    return { success: true };
  }

  // Notifications
  getNotifications() {
    return this.data.notifications;
  }

  getUnreadNotifications() {
    return this.data.notifications.filter((n) => !n.isRead);
  }

  getUnreadCount() {
    return this.data.notifications.filter((n) => !n.isRead).length;
  }

  markNotificationAsRead(id) {
    const notif = this.data.notifications.find((n) => n.id === Number(id));
    if (notif) {
      notif.isRead = true;
      this.save();
    }
    return { success: true };
  }

  markAllNotificationsAsRead() {
    this.data.notifications.forEach((n) => (n.isRead = true));
    this.save();
    return { success: true };
  }

  // Drive
  getDriveStatus() {
    return {
      connected: this.data.driveConnected,
      googleEmail: 'demo.user@gmail.com',
      googleId: 'google-demo-12345',
      driveRootFolderId: 'snaply-demo-root-folder',
    };
  }

  disconnectDrive() {
    this.data.driveConnected = false;
    this.save();
    return { success: true };
  }

  connectDrive() {
    this.data.driveConnected = true;
    this.save();
    return { connected: true };
  }
}

export const mockStore = new MockStore();

export function isDemoMode() {
  return localStorage.getItem('snaply_demo_mode') === 'true';
}

export function enableDemoMode() {
  localStorage.setItem('snaply_demo_mode', 'true');
  localStorage.setItem('snaply_token', 'demo-preview-token-123');
  localStorage.setItem('snaply_user', JSON.stringify(MOCK_USER));
}

export function disableDemoMode() {
  localStorage.removeItem('snaply_demo_mode');
  localStorage.removeItem('snaply_token');
  localStorage.removeItem('snaply_user');
}
