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
          console.log('Loaded user:', userData) // Debug log
          setUser(userData)
        })
        .catch((error) => {
          console.error('Error loading user:', error)
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      console.log('Logging in...', email) // Debug log
      const response = await authService.login(email, password)
      console.log('Login response:', response) // Debug log
      
      // Fix: Extract user data and token correctly
      const userData = response; // response is already the data from authService
      const token = response.token; // Adjust based on your actual response structure
      
      setUser(userData)
      localStorage.setItem('token', token)
      return response
    } catch (error) {
      console.error('Login error in AuthContext:', error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      console.log('Registering...', userData) // Debug log
      const response = await authService.register(userData)
      console.log('Register response:', response) // Debug log
      
      // Fix: Extract user data and token correctly
      const newUser = response; // response is already the data from authService
      const token = response.token; // Adjust based on your actual response structure
      
      setUser(newUser)
      localStorage.setItem('token', token)
      return response
    } catch (error) {
      console.error('Register error in AuthContext:', error)
      throw error
    }
  }

  const logout = () => {
    console.log('Logging out...') // Debug log
    setUser(null)
    localStorage.removeItem('token')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}