package com.skillsync.repository;

import com.skillsync.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    // Existing methods
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Add this new method for the scheduler
    List<User> findByGithubUsernameIsNotNull();
}