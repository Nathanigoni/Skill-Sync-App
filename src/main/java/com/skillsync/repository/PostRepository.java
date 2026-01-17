package com.skillsync.repository;

import com.skillsync.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByTagsContainingOrderByCreatedAtDesc(String tag);
    List<Post> findByUserGithubUsernameOrderByCreatedAtDesc(String githubUsername);
}