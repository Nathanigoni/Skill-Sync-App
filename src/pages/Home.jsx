import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { feedService } from '../services/feed'
import { BarChart3, Heart, MessageCircle, Share, Type, Image, FileText, Code, MoreHorizontal } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

// FIX: Removed all duplicate post state and handlers that conflicted with PostContext.
// Home now uses PostContext (via usePosts) as the single source of truth for posts,
// identical to Feed.jsx — no more two separate systems running in parallel.

const Home = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('text')
  const [loading, setLoading] = useState(false)

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
            <h3 className="text-xl font-semibold text-zinc-400 mb-2">{post.articleTitle}</h3>
            <p className="text-zinc-200 whitespace-pre-wrap line-clamp-3">{post.articleContent}</p>
            <button className="text-zinc-400 hover:text-zinc-300 text-sm mt-2">
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Main Content */}
      <div className="flex w-full">
        {/* Middle Column - Feed & Post Creation */}
        <div className="w-full max-w-[600px] border-r border-zinc-800 min-h-screen pb-20">
          {/* Create Post Card - Only show if user is logged in */}
            {user && (
              <div className="p-4 border-b border-zinc-800">
                <div className="flex space-x-4 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-zinc-900 to-zinc-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {user?.profile?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    {/* Post Type Tabs */}
                    <div className="flex space-x-4 mb-4">
                      {[
                        { key: 'text', icon: Type, label: 'Text' },
                        { key: 'image', icon: Image, label: 'Image' },
                        { key: 'article', icon: FileText, label: 'Article' },
                        { key: 'code', icon: Code, label: 'Code' }
                      ].map(({ key, icon: Icon, label }) => (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key)}
                          className={`flex items-center space-x-1 pb-2 border-b-2 transition-colors ${
                            activeTab === key 
                              ? 'border-zinc-400 text-zinc-400' 
                              : 'border-transparent text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          <Icon size={16} />
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Text Post Form */}
                    {activeTab === 'text' && (
                      <div className="space-y-3">
                        <textarea
                          value={textContent}
                          onChange={(e) => setTextContent(e.target.value)}
                          placeholder="What is happening?!"
                          className="w-full bg-transparent text-xl text-white focus:outline-none resize-none placeholder-zinc-500"
                          rows="3"
                        />
                        <Input
                          value={textTags}
                          onChange={(e) => setTextTags(e.target.value)}
                          placeholder="Add tags (comma separated)"
                          className="bg-zinc-950 border-none text-zinc-400 placeholder-zinc-600 px-0"
                        />
                        <div className="flex justify-between items-center border-t border-zinc-800 pt-3">
                          <div className="flex space-x-2 text-zinc-400">
                            <button className="p-2 hover:bg-zinc-400/10 rounded-full transition-colors"><Image size={20} /></button>
                            <button className="p-2 hover:bg-zinc-400/10 rounded-full transition-colors"><Code size={20} /></button>
                          </div>
                          <Button 
                            onClick={handleCreateTextPost} 
                            disabled={loading || !textContent.trim()}
                            className="bg-zinc-500 hover:bg-zinc-400 text-white rounded-full px-6 font-bold disabled:opacity-50"
                          >
                            {loading ? 'Posting...' : 'Post'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Image Post Form */}
                    {activeTab === 'image' && (
                      <div className="space-y-3">
                        <textarea
                          value={imageContent}
                          onChange={(e) => setImageContent(e.target.value)}
                          placeholder="Describe your images..."
                          className="w-full bg-transparent text-xl text-white focus:outline-none resize-none placeholder-zinc-500"
                          rows="2"
                        />
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-500 file:text-white hover:file:bg-zinc-400 cursor-pointer"
                        />
                        <Input
                          value={imageTags}
                          onChange={(e) => setImageTags(e.target.value)}
                          placeholder="Add tags (comma separated)"
                          className="bg-zinc-950 border-none text-zinc-400 placeholder-zinc-600 px-0"
                        />
                        <div className="flex justify-end border-t border-zinc-800 pt-3">
                          <Button 
                            onClick={handleCreateImagePost} 
                            disabled={loading || (!imageContent.trim() && imageFiles.length === 0)}
                            className="bg-zinc-500 hover:bg-zinc-400 text-white rounded-full px-6 font-bold disabled:opacity-50"
                          >
                            {loading ? 'Posting...' : 'Post'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Article Post Form */}
                    {activeTab === 'article' && (
                      <div className="space-y-3">
                        <Input
                          value={articleTitle}
                          onChange={(e) => setArticleTitle(e.target.value)}
                          placeholder="Article title"
                          className="bg-transparent border-none text-xl font-bold text-white placeholder-zinc-500 px-0"
                        />
                        <textarea
                          value={articleContent}
                          onChange={(e) => setArticleContent(e.target.value)}
                          placeholder="Write your article..."
                          className="w-full bg-transparent text-lg text-white focus:outline-none resize-none placeholder-zinc-500"
                          rows="4"
                        />
                        <Input
                          value={articleTags}
                          onChange={(e) => setArticleTags(e.target.value)}
                          placeholder="Add tags (comma separated)"
                          className="bg-zinc-950 border-none text-zinc-400 placeholder-zinc-600 px-0"
                        />
                        <div className="flex justify-end border-t border-zinc-800 pt-3">
                          <Button 
                            onClick={handleCreateArticlePost} 
                            disabled={loading || !articleTitle.trim() || !articleContent.trim()}
                            className="bg-zinc-500 hover:bg-zinc-400 text-white rounded-full px-6 font-bold disabled:opacity-50"
                          >
                            {loading ? 'Publishing...' : 'Publish'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Code Post Form */}
                    {activeTab === 'code' && (
                      <div className="space-y-3">
                        <textarea
                          value={codeContent}
                          onChange={(e) => setCodeContent(e.target.value)}
                          placeholder="Describe your code..."
                          className="w-full bg-transparent text-xl text-white focus:outline-none resize-none placeholder-zinc-500"
                          rows="2"
                        />
                        <textarea
                          value={codeSnippet}
                          onChange={(e) => setCodeSnippet(e.target.value)}
                          placeholder="Paste your code here..."
                          className="w-full p-4 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl focus:outline-none font-mono text-sm resize-none placeholder-zinc-600"
                          rows="4"
                        />
                        <div className="flex gap-4">
                          <Input
                            value={codeLanguage}
                            onChange={(e) => setCodeLanguage(e.target.value)}
                            placeholder="Language"
                            className="flex-1 bg-transparent border-b border-zinc-800 rounded-none px-0 text-white placeholder-zinc-600 focus:border-zinc-400"
                          />
                          <Input
                            value={codeTags}
                            onChange={(e) => setCodeTags(e.target.value)}
                            placeholder="Tags"
                            className="flex-1 bg-transparent border-b border-zinc-800 rounded-none px-0 text-white placeholder-zinc-600 focus:border-zinc-400"
                          />
                        </div>
                        <div className="flex justify-end border-t border-zinc-800 pt-3">
                          <Button 
                            onClick={handleCreateCodePost} 
                            disabled={loading || !codeContent.trim() || !codeSnippet.trim()}
                            className="bg-zinc-500 hover:bg-zinc-400 text-white rounded-full px-6 font-bold disabled:opacity-50"
                          >
                            {loading ? 'Posting...' : 'Post'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Feed */}
            <div className="divide-y divide-zinc-800">
              {posts.length === 0 ? (
                <div className="p-8 text-center text-zinc-500">
                  {user ? 'No posts yet. Be the first to share something!' : 'Sign in to see posts from the community'}
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="p-4 hover:bg-zinc-900/50 transition-colors duration-200 cursor-pointer">
                    <div className="flex space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-zinc-800 to-zinc-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {post.userName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 mb-1">
                          <h3 className="font-bold text-white truncate hover:underline">{post.userName}</h3>
                          {post.userGithubUsername && (
                            <span className="text-zinc-500 text-sm truncate">@{post.userGithubUsername}</span>
                          )}
                          <span className="text-zinc-600 text-sm">·</span>
                          <span className="text-zinc-500 text-sm hover:underline">
                            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        
                        {renderPostContent(post)}
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3 mt-2">
                            {post.tags.map(tag => (
                              <span key={tag} className="text-zinc-400 hover:underline text-sm">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex justify-between text-zinc-500 mt-3 max-w-md">
                          <button className="flex items-center space-x-2 hover:text-zinc-200 transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-zinc-400/10 transition-colors">
                              <MessageCircle size={18} />
                            </div>
                            <span className="text-sm">{post.comments || 0}</span>
                          </button>
                          <button className="flex items-center space-x-2 hover:text-green-500 transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                              <Share size={18} />
                            </div>
                            <span className="text-sm">{post.shares || 0}</span>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                            className="flex items-center space-x-2 hover:text-pink-500 transition-colors group"
                          >
                            <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                              <Heart size={18} />
                            </div>
                            <span className="text-sm">{post.likes || 0}</span>
                          </button>
                          <button className="flex items-center space-x-2 hover:text-zinc-200 transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-zinc-400/10 transition-colors">
                              <BarChart3 size={18} />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Search & Trending */}
          <div className="hidden lg:block w-[350px] pl-8 py-2 space-y-4">
            {/* Search Bar */}
            <div className="sticky top-[72px] z-10 bg-zinc-950 pb-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-zinc-500 group-focus-within:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="block w-full pl-11 pr-4 py-3 bg-zinc-900 border border-transparent rounded-full text-white placeholder-zinc-500 focus:bg-zinc-950 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
                />
              </div>
            </div>

            {/* Relevant People */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              <h2 className="font-extrabold text-xl p-4 text-white">Relevant people</h2>
              
              {[
                { name: 'Alex Chen', handle: '@alexc_dev', initials: 'AC', color: 'from-blue-600 to-blue-400', bio: 'Full-stack engineer building the future of web.' },
                { name: 'Sarah Jenkins', handle: '@sarahcodes', initials: 'SJ', color: 'from-purple-600 to-purple-400', bio: 'React & Node.js enthusiast. Open source contributor.' },
                { name: 'David Kumar', handle: '@davidk_tech', initials: 'DK', color: 'from-emerald-600 to-emerald-400', bio: 'Cloud architect, AWS hero. Writing about serverless.' },
                { name: 'Elena Rodriguez', handle: '@elenacodes', initials: 'ER', color: 'from-rose-600 to-rose-400', bio: 'UI/UX designer & Frontend dev. Creating beautiful experiences.' }
              ].map((person, idx) => (
                <div key={idx} className="p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer border-b border-zinc-800/50 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${person.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold">{person.initials}</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-1">
                          <h3 className="font-bold text-white hover:underline text-sm">{person.name}</h3>
                          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.79-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.46.74 2.746 1.867 3.45-.066.305-.102.62-.102.95 0 2.21 1.71 3.998 3.918 3.998.47 0 .92-.084 1.336-.25C9.182 21.585 10.49 22.5 12 22.5s2.816-.917 3.337-2.25c.416.165.866.25 1.336.25 2.21 0 3.918-1.79 3.918-4 0-.33-.036-.645-.102-.95 1.127-.704 1.867-1.99 1.867-3.45zm-10.81 3.25l-3.25-3.25 1.414-1.414 1.836 1.836 5.836-5.836 1.414 1.414-7.25 7.25z"/></svg>
                        </div>
                        <p className="text-zinc-500 text-sm">{person.handle}</p>
                      </div>
                    </div>
                    <button className="bg-white text-black font-bold py-1.5 px-4 rounded-full text-sm hover:bg-zinc-200 transition-colors">
                      Follow
                    </button>
                  </div>
                  <div className="text-sm text-white">
                    {person.bio}
                  </div>
                </div>
              ))}
            </div>

            {/* What's happening */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
              <h2 className="font-extrabold text-xl p-4 text-white">What's happening</h2>
              
              {[
                { category: 'Technology · Trending', title: 'React 19' },
                { category: 'Programming · Trending', title: 'TypeScript 5.5' },
                { category: 'Web Development · Trending', title: 'Next.js App Router' },
                { category: 'Artificial Intelligence · Trending', title: 'OpenAI GPT-5' }
              ].map((topic, idx) => (
                <div key={idx} className="p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-zinc-500 text-xs">{topic.category}</p>
                      <p className="font-bold text-white mt-0.5">{topic.title}</p>
                    </div>
                    <MoreHorizontal size={16} className="text-zinc-500" />
                  </div>
                </div>
              ))}
              
              <div className="p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer">
                <p className="text-zinc-400 hover:underline text-sm">Show more</p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="px-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Cookie Policy</a>
              <a href="#" className="hover:underline">Accessibility</a>
              <a href="#" className="hover:underline">Ads info</a>
              <a href="#" className="hover:underline flex items-center">More <MoreHorizontal size={12} className="ml-1" /></a>
              <span>© 2026 X Corp.</span>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Home
