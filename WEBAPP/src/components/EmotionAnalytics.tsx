'use client';

import React from 'react';

interface EmotionData {
  emotion: string;
  confidence: number;
  emotions: Record<string, number>;
  timestamp: number;
}

interface EmotionAnalyticsProps {
  currentEmotion?: EmotionData;
  emotionHistory: EmotionData[];
  className?: string;
}

const EmotionAnalytics: React.FC<EmotionAnalyticsProps> = ({
  currentEmotion,
  emotionHistory,
  className = '',
}) => {
  const getEmotionStats = () => {
    if (emotionHistory.length === 0) return null;

    const emotionCounts: Record<string, number> = {};
    let totalConfidence = 0;

    emotionHistory.forEach(({ emotion, confidence }) => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      totalConfidence += confidence;
    });

    const avgConfidence = totalConfidence / emotionHistory.length;
    const sortedEmotions = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a);

    return {
      totalReadings: emotionHistory.length,
      averageConfidence: avgConfidence,
      emotionDistribution: sortedEmotions,
    };
  };

  const getEmotionColor = (emotion: string): string => {
    const emotionColors: Record<string, string> = {
      happy: 'bg-green-500',
      sad: 'bg-blue-500',
      angry: 'bg-red-500',
      fearful: 'bg-purple-500',
      surprised: 'bg-yellow-500',
      disgusted: 'bg-orange-500',
      neutral: 'bg-gray-500',
    };
    return emotionColors[emotion.toLowerCase()] || 'bg-gray-500';
  };

  const getEmotionEmoji = (emotion: string): string => {
    const emotionEmojis: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      fearful: '😰',
      surprised: '😲',
      disgusted: '🤢',
      neutral: '😐',
    };
    return emotionEmojis[emotion.toLowerCase()] || '🤔';
  };

  const formatConfidence = (confidence: number): string => {
    return `${Math.round(confidence * 100)}%`;
  };

  const getRecentTrend = (): string => {
    if (emotionHistory.length < 3) return 'Not enough data';
    
    const recent = emotionHistory.slice(-3);
    const emotions = recent.map(e => e.emotion);
    
    if (emotions.every(e => e === emotions[0])) {
      return 'Stable';
    } else {
      return 'Changing';
    }
  };

  const stats = getEmotionStats();

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Emotion Analytics
      </h3>

      {/* Current Emotion */}
      {currentEmotion && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Current State</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getEmotionEmoji(currentEmotion.emotion)}</span>
              <div>
                <p className="font-medium capitalize">{currentEmotion.emotion}</p>
                <p className="text-sm text-gray-600">
                  {formatConfidence(currentEmotion.confidence)} confidence
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {new Date(currentEmotion.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* Session Statistics */}
      {stats && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{stats.totalReadings}</p>
              <p className="text-sm text-gray-600">Total Readings</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {formatConfidence(stats.averageConfidence)}
              </p>
              <p className="text-sm text-gray-600">Avg Confidence</p>
            </div>
          </div>

          {/* Emotion Distribution */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Emotion Distribution</h4>
            <div className="space-y-2">
              {stats.emotionDistribution.slice(0, 5).map(([emotion, count]) => {
                const percentage = (count / stats.totalReadings) * 100;
                return (
                  <div key={emotion} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getEmotionEmoji(emotion)}</span>
                      <span className="capitalize text-sm font-medium">{emotion}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getEmotionColor(emotion)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-10">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Trend */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Recent Trend:</span>
              <span className="text-sm text-gray-600">{getRecentTrend()}</span>
            </div>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!currentEmotion && emotionHistory.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">📊</div>
          <p className="font-medium">No emotion data yet</p>
          <p className="text-sm mt-1">
            Start the camera to begin tracking your emotions
          </p>
        </div>
      )}

      {/* Recent History */}
      {emotionHistory.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-3">Recent Activity</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {emotionHistory.slice(-5).reverse().map((emotion, index) => (
              <div key={emotion.timestamp} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span>{getEmotionEmoji(emotion.emotion)}</span>
                  <span className="capitalize">{emotion.emotion}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <span>{formatConfidence(emotion.confidence)}</span>
                  <span>•</span>
                  <span>{new Date(emotion.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionAnalytics;
