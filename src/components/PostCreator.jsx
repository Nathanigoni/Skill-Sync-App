import React, { useState, useRef } from 'react';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import { Image, X, Send, Type, FileText, Code, ChevronDown } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';

const POST_TYPES = [
  { key: 'text', icon: Type, label: 'Text', color: 'from-blue-500 to-blue-600' },
  { key: 'image', icon: Image, label: 'Image', color: 'from-green-500 to-green-600' },
  { key: 'article', icon: FileText, label: 'Article', color: 'from-purple-500 to-purple-600' },
  { key: 'code', icon: Code, label: 'Code', color: 'from-orange-500 to-orange-600' }
];

const PostCreator = () => {
  const { user } = useAuth();
  const { createPost, syncingWithBackend } = usePosts();
  
  const [activeTab, setActiveTab] = useState('text');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Text post states
  const [textContent, setTextContent] = useState('');
  const [textTags, setTextTags] = useState('');

  // Image post states
  const [imageContent, setImageContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageTags, setImageTags] = useState('');
  const fileInputRef = useRef(null);

  // Article post states
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleTags, setArticleTags] = useState('');

  // Code post states
  const [codeDescription, setCodeDescription] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('');
  const [codeTags, setCodeTags] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      switch (activeTab) {
        case 'text':
          if (!textContent.trim()) {
            alert('Please enter some content');
            return;
          }
          await createPost(
            textContent,
            null,
            'TEXT',
            {
              tags: textTags.split(',').map(tag => tag.trim()).filter(tag => tag)
            }
          );
          setTextContent('');
          setTextTags('');
          break;

        case 'image':
          if (!imageContent.trim() && !imagePreview) {
            alert('Please add content or an image');
            return;
          }
          await createPost(
            imageContent,
            imagePreview,
            'IMAGE',
            {
              tags: imageTags.split(',').map(tag => tag.trim()).filter(tag => tag)
            }
          );
          setImageContent('');
          setImagePreview(null);
          setImageTags('');
          if (fileInputRef.current) fileInputRef.current.value = '';
          break;

        case 'article':
          if (!articleTitle.trim() || !articleContent.trim()) {
            alert('Please enter both title and content');
            return;
          }
          await createPost(
            articleContent,
            null,
            'ARTICLE',
            {
              articleTitle,
              tags: articleTags.split(',').map(tag => tag.trim()).filter(tag => tag)
            }
          );
          setArticleTitle('');
          setArticleContent('');
          setArticleTags('');
          break;

        case 'code':
          if (!codeDescription.trim() || !codeSnippet.trim()) {
            alert('Please enter description and code');
            return;
          }
          await createPost(
            codeDescription,
            null,
            'CODE',
            {
              codeSnippet,
              language: codeLanguage,
              tags: codeTags.split(',').map(tag => tag.trim()).filter(tag => tag)
            }
          );
          setCodeDescription('');
          setCodeSnippet('');
          setCodeLanguage('');
          setCodeTags('');
          break;

        default:
          break;
      }

      // Collapse the form after successful post
      setIsExpanded(false);
      
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="p-6 bg-gradient-to-r from-[#1C0F13] to-[#6E7E85] text-white text-center mb-6">
        <p className="text-lg">Sign in to share your developer journey with the community!</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm mb-6 overflow-hidden">
      {/* Creator Header - Always visible */}
      <div 
        className="p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-10 h-10 bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] rounded-full flex items-center justify-center">
          <span className="text-[#1C0F13] font-bold text-sm">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-gray-500">
            {isExpanded ? 'Close editor' : `What's on your mind, ${user?.name?.split(' ')[0] || 'Developer'}?`}
          </p>
        </div>
        <ChevronDown className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} size={20} />
      </div>

      {/* Expanded Post Creator Form */}
      {isExpanded && (
        <form onSubmit={handleSubmit} className="border-t border-gray-100">
          {/* Post Type Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50">
            {POST_TYPES.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === key 
                    ? 'text-[#1C0F13] bg-white border-b-2 border-[#B7CECE]' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* Text Post Form */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Share your thoughts, ideas, or experiences..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7CECE] focus:border-transparent resize-none min-h-[120px]"
                  rows="4"
                />
                <Input
                  value={textTags}
                  onChange={(e) => setTextTags(e.target.value)}
                  placeholder="Add tags (comma separated) e.g., react, javascript, webdev"
                  className="border-gray-200"
                />
              </div>
            )}

            {/* Image Post Form */}
            {activeTab === 'image' && (
              <div className="space-y-4">
                <textarea
                  value={imageContent}
                  onChange={(e) => setImageContent(e.target.value)}
                  placeholder="Describe your image(s)..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7CECE] focus:border-transparent resize-none"
                  rows="2"
                />
                
                {!imagePreview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#B7CECE] hover:bg-gray-50 transition-colors"
                  >
                    <Image size={32} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600 font-medium">Click to upload an image</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-colors"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />

                <Input
                  value={imageTags}
                  onChange={(e) => setImageTags(e.target.value)}
                  placeholder="Add tags (comma separated)"
                  className="border-gray-200"
                />
              </div>
            )}

            {/* Article Post Form */}
            {activeTab === 'article' && (
              <div className="space-y-4">
                <Input
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  placeholder="Article title"
                  className="border-gray-200 font-medium"
                />
                <textarea
                  value={articleContent}
                  onChange={(e) => setArticleContent(e.target.value)}
                  placeholder="Write your article content..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7CECE] focus:border-transparent resize-none min-h-[150px]"
                  rows="6"
                />
                <Input
                  value={articleTags}
                  onChange={(e) => setArticleTags(e.target.value)}
                  placeholder="Add tags (comma separated)"
                  className="border-gray-200"
                />
              </div>
            )}

            {/* Code Post Form */}
            {activeTab === 'code' && (
              <div className="space-y-4">
                <textarea
                  value={codeDescription}
                  onChange={(e) => setCodeDescription(e.target.value)}
                  placeholder="Describe your code..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7CECE] focus:border-transparent resize-none"
                  rows="2"
                />
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="Paste your code here..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#B7CECE] focus:border-transparent font-mono text-sm resize-none"
                  rows="6"
                />
                <div className="flex gap-4">
                  <Input
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    placeholder="Language (e.g., JavaScript)"
                    className="flex-1 border-gray-200"
                  />
                  <Input
                    value={codeTags}
                    onChange={(e) => setCodeTags(e.target.value)}
                    placeholder="Tags (comma separated)"
                    className="flex-1 border-gray-200"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button 
                type="submit"
                disabled={loading || syncingWithBackend}
                className="bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] text-[#1C0F13] font-semibold hover:shadow-md transition-all px-6"
              >
                <Send size={16} className="mr-2" />
                {loading ? 'Posting...' : syncingWithBackend ? 'Syncing...' : 'Post'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Card>
  );
};

export default PostCreator;
