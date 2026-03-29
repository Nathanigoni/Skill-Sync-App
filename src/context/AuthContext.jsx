import React, { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authService.getCurrentUser()
        .then(userData => {
          const storedGitHubUsername = localStorage.getItem('githubUsername')
          const nextUser =
            storedGitHubUsername && !userData?.githubUsername
              ? { ...userData, githubUsername: storedGitHubUsername }
              : userData
          setUser(nextUser)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const response = await authService.login(email, password)
    const userData = response
    const token = response?.token

    setUser(userData)
    if (token) {
      localStorage.setItem('token', token)
    }
    return response
  }

  const register = async (userData) => {
    const response = await authService.register(userData)
    const newUser = response
    const token = response?.token

    setUser(newUser)
    if (token) {
      localStorage.setItem('token', token)
    }
    return response
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('githubUsername')
  }

  const updateUser = (partial) => {
    setUser((prev) => {
      if (!prev || !partial) return prev
      const nextProfile = partial.profile ? { ...prev.profile, ...partial.profile } : prev.profile
      const nextUser = { ...prev, ...partial, profile: nextProfile }
      const nextGitHubUsername = nextUser?.githubUsername
      if (typeof nextGitHubUsername === 'string' && nextGitHubUsername.trim()) {
        localStorage.setItem('githubUsername', nextGitHubUsername.trim())
      }
      return nextUser
    })
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
