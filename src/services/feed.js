import api from './api';

export const feedService = {
  async createTextPost(postData) {
    try {
      const response = await api.post('/feed/post/text', postData);
      // FIX: Backend now wraps in ApiResponse — extract .data.data
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating text post:', error);
      throw error;
    }
  },

  async createImagePost(formData) {
    try {
      const response = await api.post('/feed/post/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // FIX: Backend now wraps in ApiResponse — extract .data.data
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating image post:', error);
      throw error;
    }
  },

  async createArticlePost(postData) {
    try {
      const response = await api.post('/feed/post/article', postData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating article post:', error);
      throw error;
    }
  },

  async createCodePost(postData) {
    try {
      const response = await api.post('/feed/post/code', postData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error creating code post:', error);
      throw error;
    }
  },

  async getGlobalFeed() {
    try {
      const response = await api.get('/feed/global');
      // Backend now consistently returns ApiResponse<List<Post>>
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching global feed:', error);
      return [];
    }
  },

  async likePost(postId) {
    try {
      const response = await api.post(`/feed/${postId}/like`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  async viewPost(postId) {
    try {
      const response = await api.post(`/feed/${postId}/view`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error viewing post:', error);
      return null;
    }
  },

  // FIX: processImageUrl now reads base URL from env variable so it works
  // in both dev and production — not hardcoded to localhost:8080.
  // In your .env file set: VITE_API_BASE_URL=http://localhost:8080
  processImageUrl(imageUrl) {
    if (!imageUrl) return null;
    // Already a full URL or base64 — return as-is
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    // Relative path — prepend the backend base URL from env
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    // Ensure no double-slash between base and path
    const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${baseUrl}${cleanPath}`;
  }
};
