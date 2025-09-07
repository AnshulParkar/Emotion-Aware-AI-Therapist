'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';

// Simple icon components to replace lucide-react
const SendIcon = () => <span className="text-xl">➤</span>;
const LoaderIcon = () => <span className="animate-spin text-xl">⟳</span>;
const BotIcon = () => <span className="text-xl">🤖</span>;
const UserIcon = () => <span className="text-xl">👤</span>;

interface Message {
  id: string;
  role: 'user' | 'therapist';
  content: string;
  emotion?: string;
  timestamp: Date;
  audioUrl?: string;
  avatarUrl?: string;
}

interface ChatInterfaceProps {
  currentEmotion?: string;
  // userId?: string;  // Commented out
  // sessionId?: string;  // Commented out
  enableTTS?: boolean;
  enableAvatar?: boolean;
  onAvatarResponse?: (avatarUrl?: string, audioUrl?: string) => void;
  onAvatarGenerationStart?: () => void;
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentEmotion,
  // userId,  // Commented out
  // sessionId,  // Commented out
  enableTTS = false,
  enableAvatar = false,
  onAvatarResponse,
  onAvatarGenerationStart,
  className = '',
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    error,
    sendMessage,
  } = useChat({
    // sessionId,  // Commented out
    // userId,  // Commented out
    enableTTS,
    enableAvatar,
    onAvatarResponse,
    onAvatarGenerationStart,
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage;
    setInputMessage('');
    
    await sendMessage(message, currentEmotion);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getEmotionEmoji = (emotion?: string): string => {
    const emotionEmojis: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      fearful: '😰',
      surprised: '😲',
      disgusted: '🤢',
      neutral: '😐',
    };
    return emotion ? emotionEmojis[emotion.toLowerCase()] || '🤔' : '🤔';
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Chat Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 transition-colors duration-300">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">AI Therapist Chat</h2>
        {currentEmotion && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Current mood: {getEmotionEmoji(currentEmotion)} 
            <span className="capitalize ml-1">{currentEmotion}</span>
          </p>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <div className="text-4xl mb-4">🧠</div>
            <p className="text-lg font-medium">Welcome to MindBridge</p>
            <p className="text-sm mt-2">
              I'm here to listen and support you. Share what's on your mind.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 dark:bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm border dark:border-gray-700'
              }`}
            >
              {/* Message Content */}
              <p className="text-sm">{message.content}</p>

              {/* Message Metadata */}
              <div className={`flex items-center justify-between mt-2 text-xs ${
                message.role === 'user' ? 'text-blue-100 dark:text-blue-200' : 'text-gray-500 dark:text-gray-400'
              }`}>
                <span>{formatTime(message.timestamp)}</span>
                {message.role === 'user' && message.emotion && (
                  <span className="flex items-center">
                    {getEmotionEmoji(message.emotion)}
                    <span className="ml-1 capitalize">{message.emotion}</span>
                  </span>
                )}
              </div>

              {/* Audio and video are handled by AvatarDisplay component - no UI here */}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm border dark:border-gray-700 rounded-lg px-4 py-3 max-w-xs">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Therapist is typing...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4 transition-colors duration-300">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors duration-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
        
        {currentEmotion && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Messages are enhanced with emotion context: {getEmotionEmoji(currentEmotion)} {currentEmotion}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
