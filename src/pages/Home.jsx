import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../context/PostContext'
import { Code2, BarChart3, Users } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Post from '../components/Post'
import PostCreator from '../components/PostCreator'

// FIX: Removed all duplicate post state and handlers that conflicted with PostContext.
// Home now uses PostContext (via usePosts) as the single source of truth for posts,
// identical to Feed.jsx — no more two separate systems running in parallel.

const Home = () => {
  const { user } = useAuth()
  const { posts, refreshPosts } = usePosts()

  useEffect(() => {
    refreshPosts()
  }, [refreshPosts])

  const features = [
    {
      icon: Code2,
      title: 'Smart Skills Detection',
      description: 'Automatically extracts your technical skills from GitHub repositories with proficiency levels.'
    },
    {
      icon: BarChart3,
      title: 'Portfolio Analytics',
      description: 'Track profile views, project engagement, and visitor insights in real-time.'
    },
    {
      icon: Users,
      title: 'Developer Community',
      description: 'Connect with other developers and showcase your journey together.'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Active Developers' },
    { number: '500K+', label: 'Skills Detected' },
    { number: '50K+', label: 'Projects Showcased' },
    { number: '99%', label: 'Satisfaction Rate' }
  ]

  return (
    <div className="min-h-screen bg-[#151517] text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#1C0F13] to-[#6E7E85] rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">SS</span>
            </div>
            <span className="text-xl font-bold text-white">SkillSync</span>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-[#E2E2E2] hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-[#E2E2E2] hover:text-white transition-colors">
                  Profile
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-[#E2E2E2] hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register">
                  <Button className="bg-[#B7CECE] hover:bg-[#BBBAC6] text-[#1C0F13]">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Grid */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {/* Left Column - Hero & Features */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#1C0F13] rounded-2xl p-6 border border-[#2F3336]">
              <h1 className="text-3xl font-bold mb-4 leading-tight">
                Showcase Your
                <span className="text-[#B7CECE] block">Developer Journey</span>
              </h1>
              <p className="text-[#BBBAC6] mb-6 leading-relaxed">
                A smart portfolio platform that automatically detects your skills from GitHub and connects you with the developer community.
              </p>
              {!user && (
                <div className="space-y-3">
                  <Link to="/register" className="block w-full">
                    <Button className="w-full bg-[#B7CECE] hover:bg-[#BBBAC6] text-[#1C0F13] font-semibold">
                      Start Building Your Portfolio
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-[#1C0F13] rounded-2xl p-6 border border-[#2F3336]">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-[#B7CECE] mb-1">{stat.number}</div>
                    <div className="text-[#BBBAC6] text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1C0F13] rounded-2xl p-6 border border-[#2F3336]">
              <h3 className="text-lg font-bold mb-4">Why SkillSync?</h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="text-[#1C0F13]" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
                      <p className="text-[#BBBAC6] text-xs mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Feed & Post Creation */}
          <div className="lg:col-span-2">
            {user ? (
              <PostCreator />
            ) : (
              <Card className="p-6 bg-[#1C0F13] border-[#2F3336] mb-6 text-center">
                <p className="text-white mb-4">Sign in to share your developer journey with the community</p>
                <Link to="/login">
                  <Button className="bg-[#B7CECE] hover:bg-[#BBBAC6] text-[#1C0F13]">
                    Sign In
                  </Button>
                </Link>
              </Card>
            )}

            <div className="bg-[#1C0F13] rounded-2xl border border-[#2F3336] overflow-hidden">
              <div className="p-4 border-b border-[#2F3336]">
                <h2 className="text-xl font-bold text-white">Developer Community Feed</h2>
                <p className="text-[#BBBAC6] text-sm mt-1">
                  {user ? 'See what developers are building and sharing' : 'Sign in to join the conversation'}
                </p>
              </div>

              <div className="divide-y divide-[#2F3336]">
                {posts.length === 0 ? (
                  <div className="p-8 text-center text-[#BBBAC6]">
                    {user ? 'No posts yet. Be the first to share something!' : 'Sign in to see posts from the community'}
                  </div>
                ) : (
                  posts.slice(0, 5).map(post => (
                    <Post key={post.id} post={post} />
                  ))
                )}
              </div>

              {posts.length > 5 && (
                <div className="p-4 border-t border-[#2F3336] text-center">
                  <Link to="/feed" className="text-[#B7CECE] hover:text-[#BBBAC6] transition-colors">
                    View all {posts.length} posts →
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home
