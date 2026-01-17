import api from './api'

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    console.log('Raw login response:', response) // Debug log
    
    // Adjust based on your actual API response structure
    // If your API returns { success: true, data: { ... }, token: '...' }
    return {
      ...response.data.data, // user data
      token: response.data.data?.token || response.data.token
    }
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    console.log('Raw register response:', response) // Debug log
    
    // Adjust based on your actual API response structure
    return {
      ...response.data.data, // user data
      token: response.data.data?.token || response.data.token
    }
  },

  async getCurrentUser() {
    const response = await api.get('/users/me')
    console.log('Raw current user response:', response) // Debug log
    return response.data.data // Return just the user data
  },

  logout() {
    localStorage.removeItem('token')
  }
}