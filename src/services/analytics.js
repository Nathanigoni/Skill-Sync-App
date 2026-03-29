import api from './api'

export const analyticsService = {
  async getStats(days = 30) {
    const response = await api.get(`/analytics/stats?days=${days}`)
    return response.data.data
  },

  async trackEvent(eventData) {
    const response = await api.post('/analytics/event', eventData)
    return response.data
  },

  async getGitHubStats(username) {
    try {
      const trimmed = typeof username === 'string' ? username.trim() : ''
      const response = trimmed
        ? await api.get(`/github/stats/${trimmed}`)
        : await api.get('/github/stats')
      return response.data?.data ?? response.data
    } catch (error) {
      console.error('Error fetching GitHub stats:', error)
      return null
    }
  },

  async syncGitHubData(username) {
    const trimmed = typeof username === 'string' ? username.trim() : ''
    if (trimmed) {
      const response = await api.get(`/github/stats/${trimmed}`)
      return response.data?.data ?? response.data
    }

    const response = await api.post('/github/sync')
    return response.data?.data ?? response.data
  }
}
