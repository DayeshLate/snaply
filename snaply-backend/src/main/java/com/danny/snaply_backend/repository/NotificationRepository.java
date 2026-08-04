package com.danny.snaply_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.danny.snaply_backend.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification,Long>{
    
}
