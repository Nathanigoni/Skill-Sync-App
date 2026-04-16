import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    githubUsername: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await register(formData)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-400">Create Account</h1>
          <p className="text-zinc-400 mt-2">Start building your portfolio</p>
        </div>

        {error && (
          <div className="bg-red-900\/50 border border-red-800 text-red-400 px-4 py-3 rounded-2xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a password"
          />

          <Input
            label="GitHub Username (Optional)"
            type="text"
            name="githubUsername"
            value={formData.githubUsername}
            onChange={handleChange}
            placeholder="Your GitHub username"
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="text-zinc-400 hover:text-zinc-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Register