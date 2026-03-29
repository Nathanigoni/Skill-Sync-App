import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { feedService } from '../services/feed';
import { Heart, MessageCircle, Share, Send, Image, FileText, Type, Code } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('text');
  const [loading, setLoading] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [textTags, setTextTags] = useState('');
  const [imageContent, setImageContent] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imageTags, setImageTags] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleTags, setArticleTags] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('');
  const [codeTags, setCodeTags] = useState('');

  // FIX: Include refreshPosts in the dependency array to avoid stale closure
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
        return <p className="text-[#E2E2E2] mb-3 whitespace-pre-wrap">{post.content}</p>
      
      case 'IMAGE':
        return (
          <>
            {post.content && <p className="text-[#E2E2E2] mb-3 whitespace-pre-wrap">{post.content}</p>}
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
            <h3 className="text-xl font-semibold text-[#B7CECE] mb-2">{post.articleTitle}</h3>
            <p className="text-[#E2E2E2] whitespace-pre-wrap line-clamp-3">{post.articleContent}</p>
            <button className="text-[#B7CECE] hover:text-[#BBBAC6] text-sm mt-2">
              Read full article →
            </button>
          </div>
        )
      
      case 'CODE':
        return (
          <>
            {post.content && <p className="text-[#E2E2E2] mb-3 whitespace-pre-wrap">{post.content}</p>}
            {post.codeSnippet && (
              <pre className="bg-[#151517] p-4 rounded-2xl text-sm overflow-x-auto mb-3 text-[#E2E2E2]">
                <code>{post.codeSnippet}</code>
                {post.language && (
                  <div className="text-right text-xs text-[#6E7E85] mt-2">
                    {post.language}
                  </div>
                )}
              </pre>
            )}
          </>
        )
      
      default:
        return <p className="text-[#E2E2E2] mb-3 whitespace-pre-wrap">{post.content}</p>
    }
  }

  return (
    <div className="min-h-screen bg-[#151517] text-white">
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        {/* Create Post Card */}
        <Card className="p-6 bg-[#1C0F13] border-[#2F3336]">
          <div className="flex space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#1C0F13] to-[#6E7E85] rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.profile?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              {/* Post Type Tabs */}
              <div className="flex space-x-2 mb-4 border-b border-[#2F3336]">
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
                        ? 'border-[#B7CECE] text-[#B7CECE]' 
                        : 'border-transparent text-[#6E7E85] hover:text-[#BBBAC6]'
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
                    className="w-full p-3 bg-[#151517] border border-[#2F3336] text-white rounded-2xl focus:ring-2 focus:ring-[#B7CECE] focus:border-transparent resize-none placeholder-[#6E7E85]"
                    rows="3"
                  />
                  <Input
                    value={textTags}
                    onChange={(e) => setTextTags(e.target.value)}
                    placeholder="Add tags (comma separated)"
                    className="bg-[#151517] border-[#2F3336] text-white placeholder-[#6E7E85]"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleCreateTextPost} 
                      disabled={loading}
                      className="bg-[#B7CECE] hover:bg-[#BBBAC6] text-[#1C0F13]"
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
                    className="w-full p-3 bg-[#151517] border border-[#2F3336] text-white rounded-2xl focus:ring-2 focus:ring-[#B7CECE] focus:border-transparent resize-none placeholder-[#6E7E85]"
                    rows="2"
                  />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full p-2 bg-[#151517] border border-[#2F3336] text-white rounded-2xl file:bg-[#B7CECE] file:text-[#1C0F13] file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4"
                  />
                  <Input
                    value={imageTags}
                    onChange={(e) => setImageTags(e.target.value)}
                    placeholder="Add tags (comma separated)"
                    className="bg-[#151517] border-[#2F3336] text-white placeholder-[#6E7E85]"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleCreateImagePost} 
                      disabled={loading}
                      className="bg-[#B7CECE] hover:bg-[#BBBAC6] text-[#1C0F13]"
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
                    className="bg-[#151517] border-[#2F3336] text-white placeholder-[#6E7E85]"
                  />
                  <textarea
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    placeholder="Write your article..."
                    className="w-full p-3 bg-[#151517] border border-[#2F3336] text-white rounded-2xl focus:ring-2 focus:ring-[#B7CECE] focus:border-transparent resize-none placeholder-[#6E7E85]"
                    rows="6"
                  />
                  <Input
                    value={articleTags}
                    onChange={(e) => setArticleTags(e.target.value)}
                    placeholder="Add tags (comma separated)"
                    className="bg-[#151517] border-[#2F3336] text-white placeholder-[#6E7E85]"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleCreateArticlePost} 
                      disabled={loading}
                      className="bg-[#B7CECE] hover:bg-[#BBBAC6] text-[#1C0F13]"
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
                    className="w-full p-3 bg-[#151517] border border-[#2F3336] text-white rounded-2xl focus:ring-2 focus:ring-[#B7CECE] focus:border-transparent resize-none placeholder-[#6E7E85]"
                    rows="2"
                  />
                  <textarea
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="Paste your code here..."
                    className="w-full p-3 bg-[#151517] border border-[#2F3336] text-white rounded-2xl focus:ring-2 focus:ring-[#B7CECE] focus:border-transparent font-mono text-sm resize-none placeholder-[#6E7E85]"
                    rows="6"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={codeLanguage}
                      onChange={(e) => setCodeLanguage(e.target.value)}
                      placeholder="Programming language"
                      className="flex-1 bg-[#151517] border-[#2F3336] text-white placeholder-[#6E7E85]"
                    />
                    <Input
                      value={codeTags}
                      onChange={(e) => setCodeTags(e.target.value)}
                      placeholder="Tags (comma separated)"
                      className="flex-1 bg-[#151517] border-[#2F3336] text-white placeholder-[#6E7E85]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleCreateCodePost} 
                      disabled={loading}
                      className="bg-[#B7CECE] hover:bg-[#BBBAC6] text-[#1C0F13]"
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

        {/* Feed Posts */}
        <div className="space-y-4">
          {posts.map(post => (
            <Card key={post.id} className="p-6 bg-[#1C0F13] border-[#2F3336]">
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#1C0F13] to-[#6E7E85] rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {post.userName?.charAt(0) || 'U'}
                  </span>
                  <span className="text-xs text-gray-400">1.2k posts</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-white">{post.userName}</h3>
                    <span className="text-[#6E7E85] text-sm">@{post.userGithubUsername}</span>
                    <span className="text-[#2F3336] text-sm">•</span>
                    <span className="text-[#6E7E85] text-sm">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 bg-[#6E7E85] text-white rounded-full text-xs capitalize">
                      {post.postType?.toLowerCase()}
                    </span>
                  </div>
                  
                  {renderPostContent(post)}
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.map(tag => (
                        <span key={tag} className="bg-[#6E7E85] text-white px-2 py-1 rounded-xl text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex space-x-6 text-[#6E7E85]">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                    >
                      <Heart size={18} />
                      <span>{post.likes || 0}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-[#B7CECE] transition-colors">
                      <MessageCircle size={18} />
                      <span>{post.comments || 0}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-[#B7CECE] transition-colors">
                      <Share size={18} />
                      <span>{post.shares || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
