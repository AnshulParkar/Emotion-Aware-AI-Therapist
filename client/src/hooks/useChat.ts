import { useState, useCallback, useRef, useEffect } from 'react';
import { therapyApi } from '../lib/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'therapist';
  content: string;
  emotion?: string;
  timestamp: Date;
  audioUrl?: string;
  avatarUrl?: string;
}

interface UseChatOptions {
  sessionId?: string;
  enableTTS?: boolean;
  enableAvatar?: boolean;
  userId?: string;
}

export const useChat = (options: UseChatOptions = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(options.sessionId || null);

  const { enableTTS = false, enableAvatar = false, userId } = options;

  const sendMessage = useCallback(async (
    content: string,
    currentEmotion?: string
  ): Promise<ChatMessage | null> => {
    if (!content.trim() || isLoading) return null;

    setIsLoading(true);
    setError(null);

    try {
      // Create user message
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: content.trim(),
        emotion: currentEmotion,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);

      // Get AI response
      const response = await therapyApi.chat(
        content,
        currentEmotion || 'neutral',
        sessionId || undefined
      );

      if (response.status !== 'success') {
        throw new Error('Failed to get therapy response');
      }

      // Create therapist message
      let therapistMessage: ChatMessage = {
        id: `therapist_${Date.now()}`,
        role: 'therapist',
        content: response.response,
        timestamp: new Date(),
      };

      // Generate TTS if enabled
      if (enableTTS) {
        try {
          const ttsResponse = await therapyApi.generateSpeech(response.response);
          if (ttsResponse.status === 'success') {
            therapistMessage.audioUrl = ttsResponse.audio_url;
          }
        } catch (ttsError) {
          console.warn('TTS generation failed:', ttsError);
        }
      }

      // Generate avatar if enabled
      if (enableAvatar) {
        try {
          const avatarResponse = await therapyApi.generateAvatar(response.response);
          if (avatarResponse.status === 'success') {
            therapistMessage.avatarUrl = avatarResponse.video_url;
          }
        } catch (avatarError) {
          console.warn('Avatar generation failed:', avatarError);
        }
      }

      setMessages(prev => [...prev, therapistMessage]);
      return therapistMessage;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, sessionId, enableTTS, enableAvatar]);

  const createSession = useCallback(async (userId: string): Promise<string | null> => {
    try {
      const response = await therapyApi.createSession(userId);
      if (response.status === 'success') {
        setSessionId(response.session_id);
        return response.session_id;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
      return null;
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const getLastUserEmotion = useCallback((): string | undefined => {
    const userMessages = messages.filter(msg => msg.role === 'user');
    return userMessages[userMessages.length - 1]?.emotion;
  }, [messages]);

  // Auto-create session if userId is provided but no sessionId
  useEffect(() => {
    if (userId && !sessionId) {
      createSession(userId);
    }
  }, [userId, sessionId, createSession]);

  return {
    messages,
    isLoading,
    error,
    sessionId,
    sendMessage,
    createSession,
    clearMessages,
    getLastUserEmotion,
  };
};
