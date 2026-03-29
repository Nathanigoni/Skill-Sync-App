import api from './api'

export const skillsService = {
  async extractSkills() {
    const username = localStorage.getItem('githubUsername')
    const response = await api.post('/skills/extract', username ? { username } : undefined)
    return response.data
  },

  async getMySkills() {
    const username = localStorage.getItem('githubUsername')
    const response = await api.get(username ? `/skills/me?username=${encodeURIComponent(username)}` : '/skills/me')
    return response.data.data
  },

  async getUserSkills(userId) {
    const response = await api.get(`/skills/user/${userId}`)
    return response.data.data
  },

  async verifySkill(skillId, verified) {
    const response = await api.put(`/skills/${skillId}/verify?verified=${verified}`)
    return response.data.data
  },

  async deleteSkill(skillId) {
    const response = await api.delete(`/skills/${skillId}`)
    return response.data
  }
}
