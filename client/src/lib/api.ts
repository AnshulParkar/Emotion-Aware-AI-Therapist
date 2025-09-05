// API configuration and utilities
export const API_CONFIG = {
  AI_BACKEND_URL: process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:8001',
  ML_BACKEND_URL: process.env.NEXT_PUBLIC_ML_BACKEND_URL || 'http://localhost:8002',
} as const;

// API client class
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// API clients
export const aiApi = new ApiClient(API_CONFIG.AI_BACKEND_URL);
export const mlApi = new ApiClient(API_CONFIG.ML_BACKEND_URL);

// Emotion detection API
export const emotionApi = {
  detectEmotion: async (imageData: string) => {
    return mlApi.post<{
      emotion: string;
      confidence: number;
      emotions: Record<string, number>;
      status: string;
    }>('/detect-emotion', { image: imageData });
  },

  analyzeVideo: async (videoData: Blob) => {
    const formData = new FormData();
    formData.append('video', videoData);
    
    return fetch(`${API_CONFIG.ML_BACKEND_URL}/analyze-video`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  },
};

// AI therapy API
export const therapyApi = {
  chat: async (message: string, emotion: string, sessionId?: string) => {
    // Note: sessionId parameter is kept for compatibility but not used
    return aiApi.post<{
      response: string;
      status: string;
    }>('/chat', { message, emotion /* session_id: sessionId */ });
  },

  generateSpeech: async (text: string, voice: string = 'default') => {
    return aiApi.post<{
      audio_url: string;
      status: string;
    }>('/tts', { text, voice });
  },

  generateAvatar: async (text: string, avatarId: string = 'default') => {
    return aiApi.post<{
      video_url: string;
      status: string;
    }>('/avatar', { text, avatar_id: avatarId });
  },

  // Session endpoints commented out for now
  // createSession: async (userId: string) => {
  //   return aiApi.post<{
  //     session_id: string;
  //     status: string;
  //   }>('/session', { user_id: userId });
  // },

  // getSession: async (sessionId: string) => {
  //   return aiApi.get<{
  //     session: any;
  //     status: string;
  //   }>(`/session/${sessionId}`);
  // },
};

// Utility functions
export const utils = {
  // Convert canvas to base64 image
  canvasToBase64: (canvas: HTMLCanvasElement): string => {
    return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
  },

  // Format emotion data for display
  formatEmotionData: (emotions: Record<string, number>) => {
    return Object.entries(emotions)
      .sort(([, a], [, b]) => b - a)
      .map(([emotion, confidence]) => ({
        emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        confidence: Math.round(confidence * 100),
      }));
  },

  // Generate user ID (simple implementation)
  generateUserId: (): string => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Format timestamp
  formatTimestamp: (timestamp: string | Date): string => {
    return new Date(timestamp).toLocaleString();
  },
};
