import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { feedService } from '../services/feed';

const PostContext = createContext();

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncingWithBackend, setSyncingWithBackend] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const savedPosts = localStorage.getItem('skillSync_posts');
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts);
      } catch (error) {
        console.error('Error loading posts from localStorage:', error);
      }
    }
    fetchBackendPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Always save to localStorage — even empty array — so deletions persist
  useEffect(() => {
    localStorage.setItem('skillSync_posts', JSON.stringify(posts));
  }, [posts]);

  // ─── Helper: resolve the display image URL from a backend post ──────────────
  // Backend stores filenames only (e.g. "abc123.jpg").
  // FeedService.enrichPostWithImageUrls() prepends baseUrl to produce
  // "http://localhost:8080/api/images/abc123.jpg" which is what we want.
  // processImageUrl handles any remaining edge cases (relative paths, nulls).
  const resolveImageUrl = (post) => {
    const raw = (post.images && post.images[0]) || post.image || null;
    return raw ? feedService.processImageUrl(raw) : null;
  };

  const transformPost = (post) => ({
    ...post,
    // Normalise: set both `image` (single) and `images` (array) so Post.jsx
    // can find the URL regardless of which field it checks
    image: resolveImageUrl(post),
    images: post.images
      ? post.images.map(url => feedService.processImageUrl(url))
      : [],
    likedBy: post.likedBy || [],
    commentList: post.commentList || [],
  });

  const fetchBackendPosts = useCallback(async () => {
    try {
      setLoading(true);
      const backendPosts = await feedService.getGlobalFeed();
      if (backendPosts && backendPosts.length > 0) {
        const transformedPosts = backendPosts.map(transformPost);
        setPosts(prev => {
          const allPosts = [...transformedPosts, ...prev];
          const uniquePosts = Array.from(
            new Map(allPosts.map(p => [p.id, p])).values()
          );
          return uniquePosts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        });
      }
    } catch (error) {
      console.error('Error fetching backend posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = async (content, imageData = null, postType = 'TEXT', additionalData = {}) => {
    if (!user) throw new Error('You must be logged in to post');

    // Optimistic local post — show immediately with base64 preview
    const newPost = {
      id: `local_${Date.now()}`,
      content,
      // For optimistic display use the raw base64 directly
      image: imageData,
      images: imageData ? [imageData] : [],
      postType,
      ...additionalData,
      userId: user.id,
      userEmail: user.email,
      userName: user.name || user.email.split('@')[0],
      userGithubUsername: user.githubUsername || 'developer',
      userAvatar:
        user.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=B7CECE&color=1C0F13`,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      likedBy: [],
      commentList: [],
    };

    setPosts(prev => [newPost, ...prev]);

    try {
      setSyncingWithBackend(true);

      let backendPost = null;

      if (postType === 'IMAGE' && imageData) {
        const formData = new FormData();
        formData.append('content', content || '');
        if (additionalData.tags) {
          formData.append('tags', additionalData.tags.join(','));
        }
        // Convert base64 preview to a real Blob for multipart upload
        const blob = await fetch(imageData).then(res => res.blob());
        formData.append('images', blob, 'image.jpg');
        backendPost = await feedService.createImagePost(formData);

      } else if (postType === 'TEXT') {
        backendPost = await feedService.createTextPost({
          content,
          tags: additionalData.tags || [],
        });
      } else if (postType === 'ARTICLE') {
        backendPost = await feedService.createArticlePost({
          articleTitle: additionalData.articleTitle,
          articleContent: content,
          tags: additionalData.tags || [],
        });
      } else if (postType === 'CODE') {
        backendPost = await feedService.createCodePost({
          content,
          codeSnippet: additionalData.codeSnippet,
          language: additionalData.language,
          tags: additionalData.tags || [],
        });
      }

      // Replace the optimistic post with the real backend post (with proper image URL)
      if (backendPost) {
        const transformed = transformPost(backendPost);
        // If backend didn't return an image URL, fall back to the local base64
        if (!transformed.image && imageData) {
          transformed.image = imageData;
          transformed.images = [imageData];
        }
        setPosts(prev =>
          prev.map(p => (p.id === newPost.id ? transformed : p))
        );
      }
    } catch (error) {
      console.error('Error syncing post with backend:', error);
      // Keep the optimistic post — image still shows as base64
    } finally {
      setSyncingWithBackend(false);
    }

    return newPost;
  };

  const likePost = async (postId) => {
    if (!user) throw new Error('You must be logged in to like posts');

    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const hasLiked = post.likedBy?.includes(user.id);
          return {
            ...post,
            likes: (post.likes || 0) + (hasLiked ? -1 : 1),
            likedBy: hasLiked
              ? (post.likedBy || []).filter(id => id !== user.id)
              : [...(post.likedBy || []), user.id],
          };
        }
        return post;
      })
    );

    try {
      await feedService.likePost(postId);
    } catch (error) {
      console.error('Error liking post on backend:', error);
    }
  };

  const addComment = async (postId, comment) => {
    if (!user) throw new Error('You must be logged in to comment');

    const newComment = {
      id: `comment_${Date.now()}`,
      content: comment,
      userId: user.id,
      userName: user.name || user.email.split('@')[0],
      userAvatar:
        user.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=B7CECE&color=1C0F13`,
      createdAt: new Date().toISOString(),
    };

    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: (post.comments || 0) + 1,
            commentList: [...(post.commentList || []), newComment],
          };
        }
        return post;
      })
    );
  };

  const deletePost = async (postId) => {
    if (!user) throw new Error('You must be logged in to delete posts');
    const post = posts.find(p => p.id === postId);
    if (post && post.userId !== user.id) {
      throw new Error('You can only delete your own posts');
    }
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const value = {
    posts,
    loading,
    syncingWithBackend,
    createPost,
    likePost,
    addComment,
    deletePost,
    refreshPosts: fetchBackendPosts,
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};
