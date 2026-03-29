import api from './api'

const unwrapApiData = (response) => {
  const data = response?.data
  return data?.data ?? data
}

const normalizeRegisterPayload = (userData) => {
  const githubUsername = userData?.githubUsername?.trim()
  const payload = {
    email: userData?.email?.trim(),
    password: userData?.password,
    name: userData?.name?.trim(),
  }

  if (githubUsername) {
    payload.githubUsername = githubUsername
    payload.github_username = githubUsername
  }

  return payload
}

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email: email?.trim(), password })
    const data = unwrapApiData(response)
    return {
      ...(typeof data === 'object' && data ? data : {}),
      token: data?.token || response.data?.token,
    }
  },

  async register(userData) {
    const response = await api.post('/auth/register', normalizeRegisterPayload(userData))
    const data = unwrapApiData(response)
    return {
      ...(typeof data === 'object' && data ? data : {}),
      token: data?.token || response.data?.token,
    }
  },

  async getCurrentUser() {
    const response = await api.get('/users/me')
    return unwrapApiData(response)
  },

  logout() {
    localStorage.removeItem('token')
  }
}
