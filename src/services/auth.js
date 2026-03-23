import api from './api'

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    console.log('Raw login response:', response)

    const data = response.data?.data || response.data
    const token = data?.token || response.data?.token

    if (!token) {
      throw new Error('No token received from server')
    }

    // Return user data and token separately
    const { token: _token, ...userData } = data
    return { userData, token }
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    console.log('Raw register response:', response)

    const data = response.data?.data || response.data
    const token = data?.token || response.data?.token

    if (!token) {
      throw new Error('No token received from server')
    }

    const { token: _token, ...userInfo } = data
    return { userData: userInfo, token }
  },

  async getCurrentUser() {
    const response = await api.get('/users/me')
    console.log('Raw current user response:', response)
    return response.data.data
  },

  logout() {
    localStorage.removeItem('token')
  }
}