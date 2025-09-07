import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Heart, AlertTriangle, Flag, Clock, Users, Filter, Search } from 'lucide-react';

// Mock data for demonstration
const mockPosts = [
  {
    id: 1,
    content: "I've been feeling really anxious about my upcoming exams. The pressure is overwhelming and I can't seem to focus on studying. Has anyone else experienced this?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: "academic-stress",
    likes: 12,
    replies: [
      {
        id: 101,
        content: "I totally understand this feeling. What helped me was breaking down my study schedule into smaller chunks and taking regular breaks. Also, try some breathing exercises before studying.",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isVolunteer: true
      },
      {
        id: 102,
        content: "Same here! I found that talking to someone about it really helped. Don't hesitate to reach out to the counseling center if you need professional support.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isVolunteer: false
      }
    ],
    isLiked: false,
    anonymousId: "Student_A7K3"
  },
  {
    id: 2,
    content: "Dealing with homesickness in my first year. Everything feels different and I miss my family so much. How do you cope with being away from home?",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    category: "social-emotional",
    likes: 8,
    replies: [
      {
        id: 201,
        content: "Homesickness is completely normal! Try to establish routines that remind you of home, stay connected with family through video calls, and gradually build new connections here. It gets easier with time.",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isVolunteer: true
      }
    ],
    isLiked: true,
    anonymousId: "Student_B2M9"
  },
  {
    id: 3,
    content: "I'm struggling with time management and feeling burnt out. Between classes, assignments, and part-time work, I feel like I'm drowning. Any advice?",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    category: "time-management",
    likes: 15,
    replies: [],
    isLiked: false,
    anonymousId: "Student_C5X1"
  }
];

const categories = [
  { id: 'all', name: 'All Posts', color: '#6B7280' },
  { id: 'academic-stress', name: 'Academic Stress', color: '#EF4444' },
  { id: 'social-emotional', name: 'Social & Emotional', color: '#3B82F6' },
  { id: 'time-management', name: 'Time Management', color: '#10B981' },
  { id: 'career-anxiety', name: 'Career Anxiety', color: '#F59E0B' },
  { id: 'relationships', name: 'Relationships', color: '#8B5CF6' },
  { id: 'health-wellness', name: 'Health & Wellness', color: '#06B6D4' }
];

function App() {
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('academic-stress');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [newReply, setNewReply] = useState('');
  const messagesEndRef = useRef(null);

  // Generate anonymous ID for new posts
  const generateAnonymousId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const letterPart = letters.charAt(Math.floor(Math.random() * letters.length));
    const numberPart = Array.from({length: 3}, () => numbers.charAt(Math.floor(Math.random() * numbers.length))).join('');
    return `Student_${letterPart}${numberPart}`;
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
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
  const handlePostSubmit = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        content: newPost,
        timestamp: new Date(),
        category: selectedCategory,
        likes: 0,
        replies: [],
        isLiked: false,
        anonymousId: generateAnonymousId()
      };
      setPosts([post, ...posts]);
      setNewPost('');
      setShowNewPostForm(false);
    }
  };

  // Handle reply submission
  const handleReplySubmit = (postId) => {
    if (newReply.trim()) {
      const reply = {
        id: Date.now(),
        content: newReply,
        timestamp: new Date(),
        isVolunteer: false // This would be determined by user role in real implementation
      };
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, replies: [...post.replies, reply] }
          : post
      ));
      
      setNewReply('');
      setReplyingTo(null);
    }
  };

  // Toggle like
  const toggleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.replies.some(reply => reply.content.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#6B7280';
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F9FAFB', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
    }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: '#FFFFFF', 
        borderBottom: '1px solid #E5E7EB', 
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MessageCircle size={28} color="#3B82F6" />
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                Peer Support Community - Test Version
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6B7280' }}>
                <Users size={18} />
                <span style={{ fontSize: '0.9rem' }}>Anonymous & Safe</span>
              </div>
              <button
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                style={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <MessageCircle size={16} />
                New Post
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Testing Info Banner */}
        <div style={{ 
          backgroundColor: '#DBEAFE',
          border: '1px solid #3B82F6',
          borderRadius: '0.75rem',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1E40AF', fontSize: '1rem' }}>
            🧪 Testing Mode
          </h3>
          <p style={{ margin: 0, color: '#1E40AF', fontSize: '0.9rem' }}>
            This is a standalone test environment for the Peer Support Platform. 
            All data is stored in browser memory and will reset on page refresh.
          </p>
        </div>

        {/* Filters and Search */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.75rem', 
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ 
                position: 'absolute', 
                left: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#9CA3AF' 
              }} />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Filter size={18} color="#6B7280" />
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: `2px solid ${category.color}`,
                  backgroundColor: filterCategory === category.id ? category.color : 'transparent',
                  color: filterCategory === category.id ? 'white' : category.color,
                  borderRadius: '1rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* New Post Form */}
        {showNewPostForm && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '2px solid #3B82F6'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1F2937', fontSize: '1.1rem' }}>
              Share your thoughts anonymously
            </h3>
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    boxSizing: 'border-box'
                  }}
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
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '0.75rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.5rem',
                    resize: 'vertical',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim()}
                  style={{
                    backgroundColor: newPost.trim() ? '#3B82F6' : '#9CA3AF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    cursor: newPost.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                >
                  <Send size={16} />
                  Post Anonymously
                </button>
                <button
                  onClick={() => setShowNewPostForm(false)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#6B7280',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredPosts.length === 0 ? (
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.75rem', 
              padding: '3rem',
              textAlign: 'center',
              color: '#6B7280'
            }}>
              <MessageCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '1.1rem', margin: 0 }}>No posts found matching your criteria</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} style={{ 
                backgroundColor: 'white', 
                borderRadius: '0.75rem', 
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                {/* Post Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      backgroundColor: getCategoryColor(post.category), 
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      {post.anonymousId.split('_')[1].slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', color: '#1F2937', fontSize: '0.9rem' }}>
                        {post.anonymousId}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#6B7280' }}>
                        <Clock size={12} />
                        {formatTime(post.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      backgroundColor: getCategoryColor(post.category), 
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '1rem',
                      fontSize: '0.7rem',
                      fontWeight: '500'
                    }}>
                      {getCategoryName(post.category)}
                    </span>
                    <button style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#9CA3AF', 
                      cursor: 'pointer' 
                    }}>
                      <Flag size={16} />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <p style={{ 
                  color: '#374151', 
                  lineHeight: '1.6', 
                  margin: '0 0 1rem 0',
                  fontSize: '0.95rem'
                }}>
                  {post.content}
                </p>

                {/* Post Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <button
                    onClick={() => toggleLike(post.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      color: post.isLiked ? '#EF4444' : '#6B7280',
                      fontSize: '0.9rem'
                    }}
                  >
                    <Heart size={16} fill={post.isLiked ? '#EF4444' : 'none'} />
                    {post.likes} Support{post.likes !== 1 ? 's' : ''}
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      color: '#6B7280',
                      fontSize: '0.9rem'
                    }}
                  >
                    <MessageCircle size={16} />
                    {post.replies.length} Replies
                  </button>
                </div>

                {/* Replies */}
                {post.replies.length > 0 && (
                  <div style={{ 
                    borderLeft: '3px solid #E5E7EB', 
                    paddingLeft: '1rem', 
                    marginLeft: '1rem',
                    marginBottom: '1rem'
                  }}>
                    {post.replies.map(reply => (
                      <div key={reply.id} style={{ 
                        backgroundColor: '#F9FAFB', 
                        padding: '1rem', 
                        borderRadius: '0.5rem',
                        marginBottom: '0.75rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ 
                              width: '24px', 
                              height: '24px', 
                              backgroundColor: reply.isVolunteer ? '#10B981' : '#6B7280', 
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '0.7rem',
                              fontWeight: 'bold'
                            }}>
                              {reply.isVolunteer ? 'V' : 'S'}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                              {reply.isVolunteer ? 'Student Volunteer' : 'Anonymous Student'}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                            {formatTime(reply.timestamp)}
                          </span>
                        </div>
                        <p style={{ 
                          color: '#374151', 
                          margin: 0, 
                          lineHeight: '1.5',
                          fontSize: '0.9rem'
                        }}>
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === post.id && (
                  <div style={{ 
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '0.5rem',
                    border: '1px solid #E5E7EB'
                  }}>
                    <textarea
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Share your thoughts or offer support..."
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '0.75rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '0.5rem',
                        resize: 'vertical',
                        fontSize: '0.9rem',
                        marginBottom: '0.75rem',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleReplySubmit(post.id)}
                        disabled={!newReply.trim()}
                        style={{
                          backgroundColor: newReply.trim() ? '#3B82F6' : '#9CA3AF',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          cursor: newReply.trim() ? 'pointer' : 'not-allowed',
                          fontSize: '0.8rem'
                        }}
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => setReplyingTo(null)}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#6B7280',
                          border: '1px solid #D1D5DB',
                          borderRadius: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Guidelines Footer */}
        <div style={{ 
          marginTop: '2rem',
          backgroundColor: '#FEF3C7',
          border: '1px solid #F59E0B',
          borderRadius: '0.75rem',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <AlertTriangle size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#92400E', fontSize: '0.95rem' }}>
                Community Guidelines
              </h4>
              <div style={{ margin: 0, color: '#92400E', fontSize: '0.85rem', lineHeight: '1.5' }}>
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