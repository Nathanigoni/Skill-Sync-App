import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PostProvider } from './context/PostContext' // Add this
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import Skills from './pages/Skills'
import Feed from './pages/Feed'
import ProtectedRoute from './components/shared/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <PostProvider> {/* Add this wrapper */}
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-brown-50">
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 p-6 lg:p-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/feed" element={
                    <ProtectedRoute>
                      <Feed />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/projects" element={
                    <ProtectedRoute>
                      <Projects />
                    </ProtectedRoute>
                  } />
                  <Route path="/analytics" element={
                    <ProtectedRoute>
                      <Analytics />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/skills" element={
                    <ProtectedRoute>
                      <Skills />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </PostProvider>
    </AuthProvider>
  )
}

export default App