import React, { useState } from 'react';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, Share, Trash2, Code, Image as ImageIcon, FileText, Type } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const Post = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFullArticle, setShowFullArticle] = useState(false);
  const { likePost, addComment, deletePost } = usePosts();
  const { user } = useAuth();

  const isLiked = user && post.likedBy?.includes(user.id);
  const isOwner = user && post.userId === user.id;

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like posts');
      return;
    }
    try {
      await likePost(post.id);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await addComment(post.id, comment);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post.id);
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return `${mins}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getPostTypeIcon = () => {
    switch (post.postType) {
      case 'IMAGE': return <ImageIcon size={14} className="mr-1" />;
      case 'ARTICLE': return <FileText size={14} className="mr-1" />;
      case 'CODE': return <Code size={14} className="mr-1" />;
      default: return <Type size={14} className="mr-1" />;
    }
  };

  const renderPostContent = () => {
    switch (post.postType) {
      case 'IMAGE':
        // Get image URL - handle both single image and array formats for backward compatibility
        const imageUrl = post.image || (post.images && post.images[0]) || null;
        
        return (
          <>
            {post.content && (
              <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>
            )}
            {imageUrl && !imageError && (
              <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={imageUrl} 
                  alt="Post attachment" 
                  className="w-full max-h-96 object-contain bg-gray-50"
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    setImageError(true);
                  }}
                  onClick={() => window.open(imageUrl, '_blank')}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            )}
            {imageError && (
              <div className="mt-3 p-4 bg-gray-100 rounded-lg text-gray-500 text-center border border-gray-200">
                <ImageIcon size={24} className="mx-auto mb-2 opacity-50" />
                <p>Image failed to load</p>
              </div>
            )}
          </>
        );

      case 'ARTICLE':
        return (
          <div className="mb-3">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{post.articleTitle}</h3>
            <div className="text-gray-800 whitespace-pre-wrap">
              {showFullArticle ? (
                <p>{post.content}</p>
              ) : (
                <>
                  <p className="line-clamp-3">{post.content}</p>
                  {post.content && post.content.length > 200 && (
                    <button
                      onClick={() => setShowFullArticle(true)}
                      className="text-[#B7CECE] hover:text-[#BBBAC6] text-sm mt-2 font-medium"
                    >
                      Read full article →
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        );

      case 'CODE':
        return (
          <>
            {post.content && (
              <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>
            )}
            {post.codeSnippet && (
              <div className="mt-3 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                {post.language && (
                  <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                    {post.language}
                  </div>
                )}
                <pre className="p-4 text-sm overflow-x-auto text-gray-200 font-mono">
                  <code>{post.codeSnippet}</code>
                </pre>
              </div>
            )}
          </>
        );

      default: // TEXT
        return (
          <p className="text-gray-800 mb-3 whitespace-pre-wrap">{post.content}</p>
        );
    }
  };

  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
      <div className="p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={post.userAvatar} 
              alt={post.userName}
              className="w-10 h-10 rounded-full border-2 border-[#B7CECE]"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.userName)}&background=B7CECE&color=1C0F13`;
              }}
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">{post.userName}</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full flex items-center">
                  {getPostTypeIcon()}
                  {post.postType?.toLowerCase() || 'text'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{formatTime(post.createdAt)}</span>
                {post.userGithubUsername && (
                  <>
                    <span>•</span>
                    <span className="text-[#6E7E85]">@{post.userGithubUsername}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {isOwner && (
            <button 
              onClick={handleDelete}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500"
              title="Delete post"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {/* Post Content */}
        <div className="mb-4">
          {renderPostContent()}
        </div>

        {/* Post Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Post Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          {post.likes > 0 && (
            <span className="flex items-center space-x-1">
              <Heart size={14} className="text-red-500" />
              <span>{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
            </span>
          )}
          {post.comments > 0 && (
            <span className="flex items-center space-x-1">
              <MessageCircle size={14} />
              <span>{post.comments} {post.comments === 1 ? 'comment' : 'comments'}</span>
            </span>
          )}
        </div>

        {/* Post Actions */}
        <div className="flex border-t border-gray-100 pt-3">
          <button
            onClick={handleLike}
            className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-colors ${
              isLiked 
                ? 'text-red-500 hover:bg-red-50' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <Heart size={18} className={isLiked ? 'fill-current' : ''} />
            <span className="ml-2 font-medium">{isLiked ? 'Liked' : 'Like'}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex-1 flex items-center justify-center py-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <MessageCircle size={18} />
            <span className="ml-2 font-medium">Comment</span>
          </button>
          
          <button className="flex-1 flex items-center justify-center py-2 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
            <Share size={18} />
            <span className="ml-2 font-medium">Share</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {/* Add Comment */}
            {user && (
              <form onSubmit={handleAddComment} className="flex space-x-3 mb-4">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=B7CECE&color=1C0F13`} 
                  alt="Your avatar"
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=B7CECE&color=1C0F13`;
                  }}
                />
                <div className="flex-1 flex">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-l-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B7CECE] focus:border-transparent"
                  />
                  <Button 
                    type="submit"
                    disabled={!comment.trim() || isSubmitting}
                    className="bg-[#B7CECE] hover:bg-[#BBBAC6] text-[#1C0F13] font-medium rounded-l-none px-4"
                  >
                    {isSubmitting ? '...' : 'Post'}
                  </Button>
                </div>
              </form>
            )}

            {/* Comments List */}
            {post.commentList && post.commentList.length > 0 ? (
              <div className="space-y-3">
                {post.commentList.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <img 
                      src={comment.userAvatar} 
                      alt={comment.userName}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userName)}&background=B7CECE&color=1C0F13`;
                      }}
                    />
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="font-semibold text-sm text-gray-900">
                          {comment.userName}
                        </div>
                        <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 ml-1">
                        {formatTime(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm py-2">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Post;