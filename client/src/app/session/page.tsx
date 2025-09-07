'use client';

import React, { useState, useEffect } from 'react';
// import VideoInterface from '../../components/VideoInterface';
import ChatInterface from '../../components/ChatInterface';
import AvatarDisplay from '../../components/AvatarDisplay';
// import EmotionAnalytics from '../../components/EmotionAnalytics';
import ThemeToggle from '../../components/ThemeToggle';
import { utils } from '../../lib/api';

interface EmotionData {
  emotion: string;
  confidence: number;
  emotions: Record<string, number>;
  timestamp: number;
}

const TherapySession: React.FC = () => {
  // const [userId] = useState(() => utils.generateUserId());  // Commented out
  // const [sessionId, setSessionId] = useState<string | null>(null);  // Commented out
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [currentEmotionData, setCurrentEmotionData] = useState<EmotionData | null>(null);
  const [avatarSettings, setAvatarSettings] = useState({
    enableTTS: false,
    enableAvatar: false,
  });
  
  // State for avatar display
  const [latestAvatarUrl, setLatestAvatarUrl] = useState<string | undefined>();
  const [latestAudioUrl, setLatestAudioUrl] = useState<string | undefined>();
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  const handleEmotionDetected = (emotion: string, confidence: number) => {
    setCurrentEmotion(emotion);
  };

  const handleEmotionDataUpdate = (emotionData: EmotionData) => {
    setCurrentEmotionData(emotionData);
    setEmotionHistory(prev => [...prev.slice(-49), emotionData]);
  };

  // Callback to receive new avatar/audio from chat
  const handleNewAvatarResponse = (avatarUrl?: string, audioUrl?: string) => {
    if (avatarUrl) {
      setLatestAvatarUrl(avatarUrl);
    }
    if (audioUrl) {
      setLatestAudioUrl(audioUrl);
    }
    setIsGeneratingAvatar(false);
  };

  // Callback when chat starts generating avatar
  const handleAvatarGenerationStart = () => {
    setIsGeneratingAvatar(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MindBridge Therapy Session</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                AI-Powered Emotion-Aware Therapy
                {/* Session: {sessionId || 'Starting...'} */}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2 text-sm">
                <label className="flex items-center text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={avatarSettings.enableTTS}
                    onChange={(e) => setAvatarSettings(prev => ({ ...prev, enableTTS: e.target.checked }))}
                    className="mr-2"
                  />
                  Text-to-Speech
                </label>
                <label className="flex items-center text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={avatarSettings.enableAvatar}
                    onChange={(e) => setAvatarSettings(prev => ({ ...prev, enableAvatar: e.target.checked }))}
                    className="mr-2"
                  />
                  Avatar Video
                </label>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video and Emotion Analytics */}
          <div className="lg:col-span-1 space-y-6">
            {/* Video Interface */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 transition-colors duration-300">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Video Feed</h2>
              {/* <VideoInterface
                onEmotionDetected={handleEmotionDetected}
                className="w-full"
              /> */}
            </div>

            {/* Emotion Analytics */}
            {/* <EmotionAnalytics
              currentEmotion={currentEmotionData || undefined}
              emotionHistory={emotionHistory}
            /> */}
          </div>

          {/* Middle Column - Chat Interface */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 h-[700px] transition-colors duration-300">
              <ChatInterface
                currentEmotion={currentEmotion}
                // userId={userId}  // Commented out
                // sessionId={sessionId || undefined}  // Commented out
                enableTTS={avatarSettings.enableTTS}
                enableAvatar={avatarSettings.enableAvatar}
                onAvatarResponse={handleNewAvatarResponse}
                onAvatarGenerationStart={handleAvatarGenerationStart}
                className="h-full"
              />
            </div>
          </div>

          {/* Right Column - Avatar Display */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 transition-colors duration-300">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">AI Therapist Avatar</h2>
              <AvatarDisplay
                avatarUrl={latestAvatarUrl}
                audioUrl={latestAudioUrl}
                isGenerating={isGeneratingAvatar}
                className="w-full"
              />
            </div>

            {/* Session Info */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 transition-colors duration-300">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Session Information</h3>
              <div className="space-y-2 text-sm">
                {/* Session information commented out */}
                {/* <div className="flex justify-between">
                  <span className="text-gray-600">User ID:</span>
                  <span className="font-mono text-xs">{userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Session ID:</span>
                  <span className="font-mono text-xs">{sessionId || 'Creating...'}</span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Current Emotion:</span>
                  <span className="capitalize text-gray-900 dark:text-white">{currentEmotion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Emotion Readings:</span>
                  <span className="text-gray-900 dark:text-white">{emotionHistory.length}</span>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 transition-colors duration-300">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How to Use</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Start your camera to enable emotion detection</li>
                <li>• Share your thoughts in the chat</li>
                <li>• The AI responds based on your emotions</li>
                <li>• Enable avatar for video responses</li>
                <li>• View emotion analytics on the left</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section - Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors">
                Save Session
              </button>
              <button className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
                Export Data
              </button>
              <button className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors">
                New Session
              </button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Session started at {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TherapySession;
