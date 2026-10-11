import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import GroupsPage from '../pages/GroupsPage';
import GroupDetailsPage from '../pages/GroupDetailsPage';
import AlbumsPage from '../pages/AlbumsPage';
import SharedMediaPage from '../pages/SharedMediaPage';
import MessagesPage from '../pages/MessagesPage';
import NotificationsPage from '../pages/NotificationsPage';
import SettingsPage from '../pages/SettingsPage';
import ProfilePage from '../pages/ProfilePage';
import JoinInvitePage from '../pages/JoinInvitePage';
import NotFoundPage from '../pages/NotFoundPage';

import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/invite/:inviteCode" element={<JoinInvitePage />} />

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/:groupId" element={<GroupDetailsPage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/shared" element={<SharedMediaPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
