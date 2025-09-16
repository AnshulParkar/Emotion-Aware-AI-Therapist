'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Heart, AlertTriangle, Flag, Clock, Users, Filter, Search, RefreshCw } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

// Interface for MongoDB posts
interface Post {
  _id: string;
  content: string;
  category: string;
  likes: number;
  replies: Reply[];
  anonymousId: string;
  createdAt: string;
  updatedAt: string;
}

interface Reply {
  _id: string;
  content: string;
  timestamp: string;
  isVolunteer: boolean;
  anonymousId: string;
}

const categories = [
  { id: 'all', name: 'All Posts', color: '#6B7280', bgClass: 'bg-gray-500', hoverClass: 'hover:bg-gray-600' },
  { id: 'general', name: 'General', color: '#64748B', bgClass: 'bg-slate-500', hoverClass: 'hover:bg-slate-600' },
  { id: 'academic-stress', name: 'Academic Stress', color: '#EF4444', bgClass: 'bg-red-500', hoverClass: 'hover:bg-red-600' },
  { id: 'social-emotional', name: 'Social & Emotional', color: '#3B82F6', bgClass: 'bg-blue-500', hoverClass: 'hover:bg-blue-600' },
  { id: 'time-management', name: 'Time Management', color: '#10B981', bgClass: 'bg-green-500', hoverClass: 'hover:bg-green-600' },
  { id: 'career-anxiety', name: 'Career Anxiety', color: '#F59E0B', bgClass: 'bg-yellow-500', hoverClass: 'hover:bg-yellow-600' },
  { id: 'relationships', name: 'Relationships', color: '#8B5CF6', bgClass: 'bg-purple-500', hoverClass: 'hover:bg-purple-600' },
  { id: 'health-wellness', name: 'Health & Wellness', color: '#06B6D4', bgClass: 'bg-cyan-500', hoverClass: 'hover:bg-cyan-600' }
];

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newReply, setNewReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/peer-support/posts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filterCategory, searchTerm]);

  // Generate anonymous ID for new posts (keeping for consistency)
  const generateAnonymousId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const letterPart = letters.charAt(Math.floor(Math.random() * letters.length));
    const numberPart = Array.from({length: 3}, () => numbers.charAt(Math.floor(Math.random() * numbers.length))).join('');
    return `Student_${letterPart}${numberPart}`;
  };

  // Format timestamp for MongoDB dates
  const formatTime = (timestamp: string | Date) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  // Handle new post submission
  const handlePostSubmit = async () => {
    if (!newPost.trim() || submitting) return;
    
    setSubmitting(true);
    try {
      const response = await fetch('/api/peer-support/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPost,
          category: selectedCategory
        })
      });
      
      if (response.ok) {
        setNewPost('');
        setShowNewPostForm(false);
        fetchPosts(); // Refresh posts
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (postId: string) => {
    if (!newReply.trim() || submitting) return;
    
    setSubmitting(true);
    try {
      const response = await fetch(`/api/peer-support/posts/${postId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newReply,
          isVolunteer: false
        })
      });
      
      if (response.ok) {
        setNewReply('');
        setReplyingTo(null);
        fetchPosts(); // Refresh posts
      } else {
        alert('Failed to add reply');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Failed to add reply');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle like
  const toggleLike = async (postId: string) => {
    const isCurrentlyLiked = likedPosts.has(postId);
    
    try {
      const response = await fetch(`/api/peer-support/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment: !isCurrentlyLiked })
      });
      
      if (response.ok) {
        // Update local liked state
        const newLikedPosts = new Set(likedPosts);
        if (isCurrentlyLiked) {
          newLikedPosts.delete(postId);
        } else {
          newLikedPosts.add(postId);
        }
        setLikedPosts(newLikedPosts);
        fetchPosts(); // Refresh posts to get updated like count
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  // Filter posts (now handled by API, but keeping for client-side display)
  const filteredPosts = posts;

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#6B7280';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MessageCircle size={32} className="text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Peer Support Community
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Safe space for student support</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              <button
                onClick={fetchPosts}
                disabled={loading}
                title="Refresh posts"
                className="p-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Users size={18} />
                <span className="text-sm">Anonymous & Safe</span>
              </div>
              <button
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
              >
                <MessageCircle size={16} />
                <span className="hidden sm:inline">New Post</span>
                <span className="sm:hidden">Post</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{/* Rest of content will continue... */}
        {/* Database Connected Banner */}
        {/* <div style={{ 
          backgroundColor: '#D1FAE5',
          border: '1px solid #10B981',
          borderRadius: '0.75rem',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#047857', fontSize: '1rem' }}>
            🗄️ Database Connected
          </h3>
          <p style={{ margin: 0, color: '#047857', fontSize: '0.9rem' }}>
            Peer support posts are now stored in MongoDB with timestamps and anonymous IDs.
            All data persists between sessions and is fully functional.
          </p>
        </div> */}

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6 mb-6 transition-colors duration-300">
          <div className="mb-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Filter size={18} className="text-gray-600 dark:text-gray-300 flex-shrink-0" />
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-full border-2 transition-all duration-200 ${
                    filterCategory === category.id 
                      ? `${category.bgClass} text-white border-transparent ${category.hoverClass}` 
                      : `text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700`
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-blue-500 dark:border-blue-400 p-4 sm:p-6 mb-6 transition-colors duration-300">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Share your thoughts anonymously
            </h3>
            <div className="space-y-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                title="Select post category"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              >
                {categories.slice(1).map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind? Remember, this is a safe space to share your thoughts and seek support..."
                rows={5}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-vertical"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim() || submitting}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  {submitting ? 'Posting...' : 'Post Anonymously'}
                </button>
                <button
                  onClick={() => setShowNewPostForm(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw size={32} className="animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-8 sm:p-12 text-center transition-colors duration-300">
              <MessageCircle size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-500 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
              <p className="text-gray-600 dark:text-gray-300">No posts match your current search criteria.</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4 sm:p-6 transition-colors duration-300">
                {/* Post Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: getCategoryColor(post.category) }}
                    >
                      {post.anonymousId.split('_')[1]?.slice(0, 2) || 'AN'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {post.anonymousId}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Clock size={10} />
                        {formatTime(post.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getCategoryColor(post.category) }}
                    >
                      {getCategoryName(post.category)}
                    </span>
                    <button 
                      title="Report this post"
                      className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      <Flag size={14} />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-sm sm:text-base">
                  {post.content}
                </p>

                {/* Post Actions */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <button
                    onClick={() => toggleLike(post._id)}
                    className={`flex items-center gap-2 font-medium transition-colors duration-200 ${
                      likedPosts.has(post._id) 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart size={16} fill={likedPosts.has(post._id) ? 'currentColor' : 'none'} />
                    {post.likes} Support{post.likes !== 1 ? 's' : ''}
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === post._id ? null : post._id)}
                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                  >
                    <MessageCircle size={16} />
                    {post.replies.length} Replies
                  </button>
                </div>

                {/* Replies */}
                {post.replies.length > 0 && (
                  <div className="space-y-3 border-l-2 border-gray-200 dark:border-gray-700 ml-6 pl-4">
                    {post.replies.slice(0, 3).map(reply => (
                      <div key={reply._id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-start gap-2 mb-2">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: getCategoryColor(post.category) }}
                          >
                            {reply.anonymousId.split('_')[1]?.slice(0, 1) || 'A'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                                {reply.anonymousId}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Clock size={8} />
                                {formatTime(reply.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {post.replies.length > 3 && (
                      <button 
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200 ml-8"
                        onClick={() => {/* Add expand replies functionality */}}
                      >
                        View {post.replies.length - 3} more replies
                      </button>
                    )}
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === post._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <textarea
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Write a supportive reply..."
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors duration-200"
                        rows={3}
                      />
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Your reply will be anonymous
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setNewReply('');
                            }}
                            className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReplySubmit(post._id)}
                            disabled={!newReply.trim()}
                            className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Guidelines Footer */}
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 sm:p-6 transition-colors duration-300">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-semibold text-green-800 dark:text-green-200 mb-3">
                Community Guidelines
              </h4>
              <div className="space-y-2 text-sm text-green-700 dark:text-green-300 leading-relaxed">
                <div>• Be respectful and supportive to fellow students</div>
                <div>• Keep discussions relevant to mental health and student wellbeing</div>
                <div>• If you're in crisis, please contact emergency services or campus counseling immediately</div>
                <div>• Report any inappropriate content using the flag button</div>
                <div>• Remember that while anonymous, your words have real impact</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;