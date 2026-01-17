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

  async getGitHubStats() {
    try {
      const response = await api.get('/github/stats')
      return response.data.data
    } catch (error) {
      console.error('Error fetching GitHub stats:', error)
      return null
    }
  },

  async syncGitHubData() {
    const response = await api.post('/github/sync')
    return response.data
  }
}