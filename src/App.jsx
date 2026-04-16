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
import Feed from './pages/FeedPage'
import Explore from './pages/Explore'
import Notifications from './pages/Notifications'
import Messages from './pages/Messages'
import Lists from './pages/Lists'
import ProtectedRoute from './components/shared/ProtectedRoute'

function ComingSoon({ title }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="border border-zinc-800 bg-zinc-900 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-zinc-100">{title}</h1>
        <p className="text-zinc-400 mt-2">This page is coming soon.</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <div className="min-h-screen bg-zinc-950">
            <Header />
            <div className="max-w-7xl mx-auto px-6 flex">
              <Sidebar />
              <main className="flex-1 min-w-0">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/feed"
                    element={
                      <ProtectedRoute>
                        <Feed />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/projects"
                    element={
                      <ProtectedRoute>
                        <Projects />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/skills"
                    element={
                      <ProtectedRoute>
                        <Skills />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/explore"
                    element={
                      <ProtectedRoute>
                        <Explore />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <ProtectedRoute>
                        <Notifications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/messages"
                    element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/bookmarks"
                    element={
                      <ProtectedRoute>
                        <ComingSoon title="Bookmarks" />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/lists"
                    element={
                      <ProtectedRoute>
                        <Lists />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Home />} />
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
