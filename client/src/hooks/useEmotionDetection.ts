import { useState, useEffect, useCallback, useRef } from 'react';
import { emotionApi } from '../lib/api';

interface EmotionData {
  emotion: string;
  confidence: number;
  emotions: Record<string, number>;
  timestamp: number;
}

interface UseEmotionDetectionOptions {
  interval?: number; // Detection interval in milliseconds
  minConfidence?: number; // Minimum confidence threshold
}

export const useEmotionDetection = (
  captureImageBase64: () => string | null,
  options: UseEmotionDetectionOptions = {}
) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { interval = 2000, minConfidence = 0.3 } = options;

  const detectEmotion = useCallback(async () => {
    try {
      const imageData = captureImageBase64();
      if (!imageData) return;

      const result = await emotionApi.detectEmotion(imageData);
      
      if (result.status === 'success' && result.confidence >= minConfidence) {
        const emotionData: EmotionData = {
          emotion: result.emotion,
          confidence: result.confidence,
          emotions: result.emotions,
          timestamp: Date.now(),
        };

        setCurrentEmotion(emotionData);
        setEmotionHistory(prev => [...prev.slice(-49), emotionData]); // Keep last 50 readings
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Emotion detection failed');
    }
  }, [captureImageBase64, minConfidence]);

  const startDetection = useCallback(() => {
    if (isDetecting) return;

    setIsDetecting(true);
    setError(null);
    
    // Initial detection
    detectEmotion();
    
    // Set up interval
    intervalRef.current = setInterval(detectEmotion, interval);
  }, [isDetecting, detectEmotion, interval]);

  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDetecting(false);
  }, []);

  const clearHistory = useCallback(() => {
    setEmotionHistory([]);
    setCurrentEmotion(null);
  }, []);

  // Get dominant emotion from recent history
  const getDominantEmotion = useCallback((timeWindowMs: number = 10000) => {
    const now = Date.now();
    const recentEmotions = emotionHistory.filter(
      emotion => now - emotion.timestamp < timeWindowMs
    );

    if (recentEmotions.length === 0) return null;

    const emotionCounts: Record<string, number> = {};
    recentEmotions.forEach(({ emotion }) => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    const dominantEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0];

    return dominantEmotion ? dominantEmotion[0] : null;
  }, [emotionHistory]);

  // Get emotion statistics
  const getEmotionStats = useCallback(() => {
    if (emotionHistory.length === 0) return null;

    const emotionCounts: Record<string, number> = {};
    let totalConfidence = 0;

    emotionHistory.forEach(({ emotion, confidence }) => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      totalConfidence += confidence;
    });

    const avgConfidence = totalConfidence / emotionHistory.length;
    const mostFrequent = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0];

    return {
      totalReadings: emotionHistory.length,
      averageConfidence: avgConfidence,
      mostFrequentEmotion: mostFrequent ? mostFrequent[0] : null,
      emotionDistribution: emotionCounts,
    };
  }, [emotionHistory]);

  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);

  return {
    isDetecting,
    currentEmotion,
    emotionHistory,
    error,
    startDetection,
    stopDetection,
    clearHistory,
    getDominantEmotion,
    getEmotionStats,
  };
};
