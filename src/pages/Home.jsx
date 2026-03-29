import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { feedService } from '../services/feed'
import { Code2, BarChart3, Users, ArrowRight, Star, Heart, MessageCircle, Share, MoreHorizontal, Send, Image, FileText, Type, Code } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Home = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('text')
  const [loading, setLoading] = useState(false)

  // Post states
  const [textContent, setTextContent] = useState('')
  const [textTags, setTextTags] = useState('')
  const [imageContent, setImageContent] = useState('')
  const [imageFiles, setImageFiles] = useState([])
  const [imageTags, setImageTags] = useState('')
  const [articleTitle, setArticleTitle] = useState('')
  const [articleContent, setArticleContent] = useState('')
  const [articleTags, setArticleTags] = useState('')
  const [codeContent, setCodeContent] = useState('')
  const [codeSnippet, setCodeSnippet] = useState('')
  const [codeLanguage, setCodeLanguage] = useState('')
  const [codeTags, setCodeTags] = useState('')

  useEffect(() => {
    loadFeed()
  }, [])

  const loadFeed = async () => {
    try {
      const data = await feedService.getGlobalFeed()
      setPosts(data)
    } catch (error) {
      console.error('Error loading feed:', error)
    }
  }

  const handleCreateTextPost = async () => {
    if (!textContent.trim()) return
    setLoading(true)

    try {
      await feedService.createTextPost({
        content: textContent,
        tags: textTags.split(',').map(tag => tag.trim()).filter(tag => tag)
      })
      setTextContent('')
      setTextTags('')
      loadFeed()
    } catch (error) {
      console.error('Error creating text post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateImagePost = async () => {
    if (!imageContent.trim() && imageFiles.length === 0) return
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('content', imageContent)
      formData.append('tags', imageTags.split(',').map(tag => tag.trim()).filter(tag => tag).join(','))

      imageFiles.forEach(file => {
        formData.append('images', file)
      })

      await feedService.createImagePost(formData)
      setImageContent('')
      setImageFiles([])
      setImageTags('')
      loadFeed()
    } catch (error) {
      console.error('Error creating image post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateArticlePost = async () => {
    if (!articleTitle.trim() || !articleContent.trim()) return
    setLoading(true)

    try {
      await feedService.createArticlePost({
        articleTitle,
        articleContent,
        tags: articleTags.split(',').map(tag => tag.trim()).filter(tag => tag)
      })
      setArticleTitle('')
      setArticleContent('')
      setArticleTags('')
      loadFeed()
    } catch (error) {
      console.error('Error creating article post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCodePost = async () => {
    if (!codeContent.trim() || !codeSnippet.trim()) return
    setLoading(true)

    try {
      await feedService.createCodePost({
        content: codeContent,
        codeSnippet,
        language: codeLanguage,
        tags: codeTags.split(',').map(tag => tag.trim()).filter(tag => tag)
      })
      setCodeContent('')
      setCodeSnippet('')
      setCodeLanguage('')
      setCodeTags('')
      loadFeed()
    } catch (error) {
      console.error('Error creating code post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      await feedService.likePost(postId)
      loadFeed()
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleFileSelect = (e) => {
    setImageFiles(Array.from(e.target.files))
  }

  const renderPostContent = (post) => {
    switch (post.postType) {
      case 'TEXT':
        return <p className="text-zinc-200 mb-3 whitespace-pre-wrap">{post.content}</p>
      
      case 'IMAGE':
        return (
          <>
            {post.content && <p className="text-zinc-200 mb-3 whitespace-pre-wrap">{post.content}</p>}
            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {post.images.map((image, index) => (
                  <img 
                    key={index}
                    src={`http://localhost:8080${image}`}
                    alt={`Post image ${index + 1}`}
                    className="rounded-2xl w-full h-48 object-cover"
                  />
                ))}
              </div>
            )}
          </>
        )
      
      case 'ARTICLE':
        return (
          <div className="mb-3">
            <h3 className="text-xl font-semibold text-indigo-400 mb-2">{post.articleTitle}</h3>
            <p className="text-zinc-200 whitespace-pre-wrap line-clamp-3">{post.articleContent}</p>
            <button className="text-indigo-400 hover:text-indigo-300 text-sm mt-2">
              Read full article →
            </button>
          </div>
        )
      
      case 'CODE':
        return (
          <>
            {post.content && <p className="text-zinc-200 mb-3 whitespace-pre-wrap">{post.content}</p>}
            {post.codeSnippet && (
              <pre className="bg-zinc-950 p-4 rounded-2xl text-sm overflow-x-auto mb-3 text-zinc-200">
                <code>{post.codeSnippet}</code>
                {post.language && (
                  <div className="text-right text-xs text-zinc-400 mt-2">
                    {post.language}
                  </div>
                )}
              </pre>
            )}
          </>
        )
      
      default:
        return <p className="text-zinc-200 mb-3 whitespace-pre-wrap">{post.content}</p>
    }
  }

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
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Main Content Grid */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* Left Column - Hero & Features */}
          <div className="lg:col-span-1 space-y-8">
            {/* Hero Section */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <h1 className="text-3xl font-bold mb-4 leading-tight">
                Showcase Your
                <span className="text-indigo-400 block">Developer Journey</span>
              </h1>
              <p className="text-indigo-300 mb-6 leading-relaxed">
                A smart portfolio platform that automatically detects your skills from GitHub and connects you with the developer community.
              </p>
              {!user && (
                <div className="space-y-3">
                  <Link to="/register" className="block w-full">
                    <Button className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold">
                      Start Building Your Portfolio
                    </Button>
                  </Link>
                  {/* <Link to="/login" className="block w-full">
                    <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                      See Demo
                    </Button>
                  </Link> */}
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-indigo-400 mb-1">{stat.number}</div>
                    <div className="text-indigo-300 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-lg font-bold mb-4">Why SkillSync?</h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-indigo-300 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="text-zinc-100" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
                      <p className="text-indigo-300 text-xs mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Feed & Post Creation */}
          <div className="lg:col-span-2">
            {/* Create Post Card - Only show if user is logged in */}
            {user && (
              <Card className="p-6 bg-zinc-900 border-zinc-800 mb-6">
                <div className="flex space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-zinc-900 to-zinc-400 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user?.profile?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    {/* Post Type Tabs */}
                    <div className="flex space-x-2 mb-4 border-b border-zinc-800">
                      {[
                        { key: 'text', icon: Type, label: 'Text' },
                        { key: 'image', icon: Image, label: 'Image' },
                        { key: 'article', icon: FileText, label: 'Article' },
                        { key: 'code', icon: Code, label: 'Code' }
                      ].map(({ key, icon: Icon, label }) => (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key)}
                          className={`flex items-center space-x-1 px-3 py-2 border-b-2 transition-colors ${
                            activeTab === key 
                              ? 'border-indigo-400 text-indigo-400' 
                              : 'border-transparent text-zinc-400 hover:text-indigo-300'
                          }`}
                        >
                          <Icon size={16} />
                          <span className="text-sm">{label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Text Post Form */}
                    {activeTab === 'text' && (
                      <div className="space-y-4">
                        <textarea
                          value={textContent}
                          onChange={(e) => setTextContent(e.target.value)}
                          placeholder="What's on your mind?"
                          className="w-full p-3 bg-zinc-950 border border-zinc-800 text-white rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none placeholder-zinc-400"
                          rows="3"
                        />
                        <Input
                          value={textTags}
                          onChange={(e) => setTextTags(e.target.value)}
                          placeholder="Add tags (comma separated)"
                          className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-400"
                        />
                        <div className="flex justify-end">
                          <Button 
                            onClick={handleCreateTextPost} 
                            disabled={loading}
                            className="bg-indigo-500 hover:bg-indigo-400 text-white"
                          >
                            <Send size={16} className="mr-2" />
                            {loading ? 'Posting...' : 'Post'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Image Post Form */}
                    {activeTab === 'image' && (
                      <div className="space-y-4">
                        <textarea
                          value={imageContent}
                          onChange={(e) => setImageContent(e.target.value)}
                          placeholder="Describe your images..."
                          className="w-full p-3 bg-zinc-950 border border-zinc-800 text-white rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none placeholder-zinc-400"
                          rows="2"
                        />
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="w-full p-2 bg-zinc-950 border border-zinc-800 text-white rounded-2xl file:bg-indigo-400 file:text-zinc-100 file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4"
                        />
                        <Input
                          value={imageTags}
                          onChange={(e) => setImageTags(e.target.value)}
                          placeholder="Add tags (comma separated)"
                          className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-400"
                        />
                        <div className="flex justify-end">
                          <Button 
                            onClick={handleCreateImagePost} 
                            disabled={loading}
                            className="bg-indigo-500 hover:bg-indigo-400 text-white"
                          >
                            <Send size={16} className="mr-2" />
                            {loading ? 'Posting...' : 'Post'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Article Post Form */}
                    {activeTab === 'article' && (
                      <div className="space-y-4">
                        <Input
                          value={articleTitle}
                          onChange={(e) => setArticleTitle(e.target.value)}
                          placeholder="Article title"
                          className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-400"
                        />
                        <textarea
                          value={articleContent}
                          onChange={(e) => setArticleContent(e.target.value)}
                          placeholder="Write your article..."
                          className="w-full p-3 bg-zinc-950 border border-zinc-800 text-white rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none placeholder-zinc-400"
                          rows="4"
                        />
                        <Input
                          value={articleTags}
                          onChange={(e) => setArticleTags(e.target.value)}
                          placeholder="Add tags (comma separated)"
                          className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-400"
                        />
                        <div className="flex justify-end">
                          <Button 
                            onClick={handleCreateArticlePost} 
                            disabled={loading}
                            className="bg-indigo-500 hover:bg-indigo-400 text-white"
                          >
                            <Send size={16} className="mr-2" />
                            {loading ? 'Publishing...' : 'Publish'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Code Post Form */}
                    {activeTab === 'code' && (
                      <div className="space-y-4">
                        <textarea
                          value={codeContent}
                          onChange={(e) => setCodeContent(e.target.value)}
                          placeholder="Describe your code..."
                          className="w-full p-3 bg-zinc-950 border border-zinc-800 text-white rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none placeholder-zinc-400"
                          rows="2"
                        />
                        <textarea
                          value={codeSnippet}
                          onChange={(e) => setCodeSnippet(e.target.value)}
                          placeholder="Paste your code here..."
                          className="w-full p-3 bg-zinc-950 border border-zinc-800 text-white rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent font-mono text-sm resize-none placeholder-zinc-400"
                          rows="4"
                        />
                        <div className="flex gap-2">
                          <Input
                            value={codeLanguage}
                            onChange={(e) => setCodeLanguage(e.target.value)}
                            placeholder="Programming language"
                            className="flex-1 bg-zinc-950 border-zinc-800 text-white placeholder-zinc-400"
                          />
                          <Input
                            value={codeTags}
                            onChange={(e) => setCodeTags(e.target.value)}
                            placeholder="Tags (comma separated)"
                            className="flex-1 bg-zinc-950 border-zinc-800 text-white placeholder-zinc-400"
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button 
                            onClick={handleCreateCodePost} 
                            disabled={loading}
                            className="bg-indigo-500 hover:bg-indigo-400 text-white"
                          >
                            <Send size={16} className="mr-2" />
                            {loading ? 'Posting...' : 'Post'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Feed */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              {/* Feed Header */}
              <div className="p-4 border-b border-zinc-800">
                <h2 className="text-xl font-bold">Developer Community Feed</h2>
                <p className="text-indigo-300 text-sm mt-1">
                  {user ? 'See what developers are building and sharing' : 'Sign in to join the conversation'}
                </p>
              </div>

              {/* Posts Feed */}
              <div className="divide-y divide-zinc-800">
                {posts.length === 0 ? (
                  <div className="p-8 text-center text-indigo-300">
                    {user ? 'No posts yet. Be the first to share something!' : 'Sign in to see posts from the community'}
                  </div>
                ) : (
                  posts.map(post => (
                    <div key={post.id} className="p-4 hover:bg-zinc-950 transition-colors duration-200">
                      <div className="flex space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-zinc-900 to-zinc-400 rounded-2xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {post.userName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-white">{post.userName}</h3>
                            <span className="text-zinc-400 text-sm">@{post.userGithubUsername}</span>
                            <span className="text-zinc-800 text-sm">•</span>
                            <span className="text-zinc-400 text-sm">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <span className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs capitalize">
                              {post.postType?.toLowerCase()}
                            </span>
                          </div>
                          
                          {renderPostContent(post)}
                          
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {post.tags.map(tag => (
                                <span key={tag} className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded-xl text-xs">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex space-x-6 text-zinc-400">
                            <button 
                              onClick={() => handleLike(post.id)}
                              className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                            >
                              <Heart size={18} />
                              <span>{post.likes || 0}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-indigo-400 transition-colors">
                              <MessageCircle size={18} />
                              <span>{post.comments || 0}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-indigo-400 transition-colors">
                              <Share size={18} />
                              <span>{post.shares || 0}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CTA Section for non-logged in users */}
            {!user && (
              <div className="mt-6 bg-zinc-900 rounded-2xl p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Ready to Join the Community?</h3>
                <p className="text-zinc-200 mb-4">Create your profile and start sharing your developer journey today.</p>
                <Link to="/register">
                  <Button className="bg-blue-600 text-white hover:bg-blue-500 font-semibold">
                    <Star className="mr-2" size={16} />
                    Join SkillSync Free
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home