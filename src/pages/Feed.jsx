import React, { useEffect } from 'react';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import PostCreator from '../components/PostCreator';
import Post from '../components/Post';
import { TrendingUp, Users, RefreshCw } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Feed = () => {
  const { posts, loading, refreshPosts, syncingWithBackend } = usePosts();
  const { user } = useAuth();

  // FIX: Include refreshPosts in the dependency array to avoid stale closure
  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  const totalPosts = posts.length;
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0);

  const today = new Date().toDateString();
  const activeUsers = new Set(
    posts
      .filter(post => new Date(post.createdAt).toDateString() === today)
      .map(post => post.userId)
  ).size;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Feed</h1>
            <p className="text-gray-600">Connect with other developers and share your journey</p>
          </div>
          <Button
            onClick={refreshPosts}
            disabled={syncingWithBackend}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0"
          >
            <RefreshCw className={`mr-2 ${syncingWithBackend ? 'animate-spin' : ''}`} size={16} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2">
          <PostCreator />

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B7CECE] border-t-[#1C0F13] mx-auto mb-4"></div>
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map(post => (
                  <Post key={post.id} post={post} />
                ))
              ) : (
                <Card className="text-center py-12">
                  <TrendingUp size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-600 mb-6">
                    {user ? 'Be the first to share your developer journey!' : 'Sign in to see posts from the community'}
                  </p>
                  {!user && (
                    <Button
                      onClick={() => window.location.href = '/login'}
                      className="bg-[#B7CECE] hover:bg-[#BBBAC6] text-[#1C0F13]"
                    >
                      Sign In to Join
                    </Button>
                  )}
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] rounded-lg">
                <Users className="text-[#1C0F13]" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900">Community Stats</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Posts</span>
                <span className="font-semibold text-gray-900">{totalPosts}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Likes</span>
                <span className="font-semibold text-gray-900">{totalLikes}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Comments</span>
                <span className="font-semibold text-gray-900">{totalComments}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Active Today</span>
                <span className="font-semibold text-gray-900">{activeUsers}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">💡 Tips for Great Posts</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="text-[#B7CECE] font-bold">•</span>
                <span>Share your project milestones and achievements</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#B7CECE] font-bold">•</span>
                <span>Ask for code reviews and technical feedback</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#B7CECE] font-bold">•</span>
                <span>Share learning resources and tutorials you found helpful</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#B7CECE] font-bold">•</span>
                <span>Celebrate your wins - big or small!</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#B7CECE] font-bold">•</span>
                <span>Ask technical questions to get community help</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">🔥 Trending Topics</h3>
            <div className="space-y-2">
              {['React', 'JavaScript', 'WebDev', 'Career', 'OpenSource'].map(topic => (
                <div key={topic} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 hover:text-[#B7CECE] cursor-pointer">
                    #{topic}
                  </span>
                  <span className="text-xs text-gray-400">1.2k posts</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Feed;
