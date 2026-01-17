package com.skillsync.service;

import com.skillsync.model.Post;
import com.skillsync.model.User;
import com.skillsync.repository.PostRepository;
import com.skillsync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public Post createTextPost(String userId, String content, List<String> tags) {
        User user = getUser(userId);

        Post post = Post.builder()
                .userId(userId)
                .content(content)
                .tags(tags)
                .postType(Post.PostType.TEXT)
                .likes(0)
                .shares(0)
                .comments(0)
                .views(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .userName(user.getProfile().getName())
                .userGithubUsername(user.getGithubUsername())
                .userAvatar(user.getProfile().getAvatar())
                .build();

        return postRepository.save(post);
    }

    public Post createImagePost(String userId, String content, List<MultipartFile> images, List<String> tags) {
        User user = getUser(userId);

        // Upload images and get URLs
        List<String> imageUrls = new ArrayList<>();
        if (images != null) {
            for (MultipartFile image : images) {
                String imageUrl = fileStorageService.storeFile(image);
                imageUrls.add(imageUrl);
            }
        }

        Post post = Post.builder()
                .userId(userId)
                .content(content)
                .images(imageUrls)
                .tags(tags)
                .postType(Post.PostType.IMAGE)
                .likes(0)
                .shares(0)
                .comments(0)
                .views(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .userName(user.getProfile().getName())
                .userGithubUsername(user.getGithubUsername())
                .userAvatar(user.getProfile().getAvatar())
                .build();

        return postRepository.save(post);
    }

    public Post createArticlePost(String userId, String title, String content, List<String> tags) {
        User user = getUser(userId);

        Post post = Post.builder()
                .userId(userId)
                .articleTitle(title)
                .articleContent(content)
                .tags(tags)
                .postType(Post.PostType.ARTICLE)
                .likes(0)
                .shares(0)
                .comments(0)
                .views(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .userName(user.getProfile().getName())
                .userGithubUsername(user.getGithubUsername())
                .userAvatar(user.getProfile().getAvatar())
                .build();

        return postRepository.save(post);
    }

    public Post createCodePost(String userId, String content, String codeSnippet, String language, List<String> tags) {
        User user = getUser(userId);

        Post post = Post.builder()
                .userId(userId)
                .content(content)
                .codeSnippet(codeSnippet)
                .language(language)
                .tags(tags)
                .postType(Post.PostType.CODE)
                .likes(0)
                .shares(0)
                .comments(0)
                .views(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .userName(user.getProfile().getName())
                .userGithubUsername(user.getGithubUsername())
                .userAvatar(user.getProfile().getAvatar())
                .build();

        return postRepository.save(post);
    }

    public List<Post> getGlobalFeed() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getUserFeed(String userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Post likePost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikes(post.getLikes() + 1);
        return postRepository.save(post);
    }

    public Post viewPost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setViews(post.getViews() + 1);
        return postRepository.save(post);
    }

    private User getUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}