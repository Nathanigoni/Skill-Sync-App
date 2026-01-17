import api from './api'

export const feedService = {
  async createTextPost(postData) {
    const response = await api.post('/feed/post/text', postData)
    return response.data
  },

  async createImagePost(formData) {
    const response = await api.post('/feed/post/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  async createArticlePost(postData) {
    const response = await api.post('/feed/post/article', postData)
    return response.data
  },

  async createCodePost(postData) {
    const response = await api.post('/feed/post/code', postData)
    return response.data
  },

  async getGlobalFeed() {
    const response = await api.get('/feed/global')
    return response.data
  },

  async likePost(postId) {
    const response = await api.post(`/feed/${postId}/like`)
    return response.data
  },

  async viewPost(postId) {
    const response = await api.post(`/feed/${postId}/view`)
    return response.data
  }
}