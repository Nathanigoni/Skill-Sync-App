import api from './api'

export const skillsService = {
  async extractSkills() {
    const response = await api.post('/skills/extract')
    return response.data
  },

  async getMySkills() {
    const response = await api.get('/skills/me')
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