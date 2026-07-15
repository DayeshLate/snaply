package com.danny.snaply_backend.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.danny.snaply_backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	Optional<User> findByGoogleId(String googleId);

	boolean existsByEmail(String email);

	boolean existsByGoogleId(String googleId);
}