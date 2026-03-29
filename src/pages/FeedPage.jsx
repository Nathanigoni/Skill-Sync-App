import React, { useEffect, useMemo } from 'react'
import { TrendingUp, Users, RefreshCw } from 'lucide-react'
import { usePosts } from '../context/PostContext'
import { useAuth } from '../context/AuthContext'
import PostCreator from '../components/PostCreator'
import Post from '../components/Post'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
 
const FeedPage = () => {
  const { posts, loading, refreshPosts, syncingWithBackend } = usePosts()
  const { user } = useAuth()
 
  useEffect(() => {
    refreshPosts()
  }, [refreshPosts])
 
  const { totalPosts, totalLikes, totalComments, activeUsers } = useMemo(() => {
    const today = new Date().toDateString()
    return {
      totalPosts: posts.length,
      totalLikes: posts.reduce((sum, post) => sum + (post.likes || 0), 0),
      totalComments: posts.reduce((sum, post) => sum + (post.comments || 0), 0),
      activeUsers: new Set(
        posts
          .filter((post) => new Date(post.createdAt).toDateString() === today)
          .map((post) => post.userId)
      ).size,
    }
  }, [posts])
 
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">Community Feed</h1>
          <p className="text-zinc-400">Connect with other developers and share your journey</p>
        </div>
        <Button
          onClick={refreshPosts}
          disabled={syncingWithBackend}
          className="bg-zinc-900 text-zinc-100 hover:bg-zinc-800 border border-zinc-800"
        >
          <RefreshCw className={`mr-2 ${syncingWithBackend ? 'animate-spin' : ''}`} size={16} />
          Refresh
        </Button>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PostCreator />
 
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-400 border-t-zinc-950 mx-auto mb-4"></div>
              <p className="text-zinc-400">Loading posts...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => <Post key={post.id} post={post} />)
              ) : (
                <Card className="text-center py-12 border border-zinc-800 bg-zinc-900">
                  <TrendingUp size={48} className="mx-auto mb-4 text-zinc-500" />
                  <h3 className="text-xl font-semibold text-zinc-100 mb-2">No posts yet</h3>
                  <p className="text-zinc-400 mb-6">
                    {user ? 'Be the first to share your developer journey!' : 'Sign in to see posts from the community'}
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>
 
        <div className="space-y-6">
          <Card className="p-6 border border-zinc-800 bg-zinc-900">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                <Users className="text-zinc-100" size={20} />
              </div>
              <h3 className="font-semibold text-zinc-100">Community Stats</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Total Posts</span>
                <span className="font-semibold text-zinc-100">{totalPosts}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Total Likes</span>
                <span className="font-semibold text-zinc-100">{totalLikes}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Total Comments</span>
                <span className="font-semibold text-zinc-100">{totalComments}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-zinc-400">Active Today</span>
                <span className="font-semibold text-zinc-100">{activeUsers}</span>
              </div>
            </div>
          </Card>
 
          <Card className="p-6 border border-zinc-800 bg-zinc-900">
            <h3 className="font-semibold text-zinc-100 mb-4">Trending Topics</h3>
            <div className="space-y-2">
              {['React', 'JavaScript', 'WebDev', 'Career', 'OpenSource'].map((topic) => (
                <div key={topic} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300 hover:text-indigo-400 cursor-pointer">#{topic}</span>
                  <span className="text-xs text-zinc-500">1.2k posts</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
 
export default FeedPage
