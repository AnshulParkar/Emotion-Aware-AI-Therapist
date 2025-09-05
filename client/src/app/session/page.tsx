'use client';

import React, { useState, useEffect } from 'react';
// import VideoInterface from '../../components/VideoInterface';
import ChatInterface from '../../components/ChatInterface';
// import AvatarDisplay from '../../components/AvatarDisplay';
// import EmotionAnalytics from '../../components/EmotionAnalytics';
import { utils } from '../../lib/api';

interface EmotionData {
  emotion: string;
  confidence: number;
  emotions: Record<string, number>;
  timestamp: number;
}

const TherapySession: React.FC = () => {
  const [userId] = useState(() => utils.generateUserId());
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [currentEmotionData, setCurrentEmotionData] = useState<EmotionData | null>(null);
  // const [avatarSettings, setAvatarSettings] = useState({
  //   enableTTS: true,
  //   enableAvatar: true,
  // });

  const handleEmotionDetected = (emotion: string, confidence: number) => {
    setCurrentEmotion(emotion);
  };

  const handleEmotionDataUpdate = (emotionData: EmotionData) => {
    setCurrentEmotionData(emotionData);
    setEmotionHistory(prev => [...prev.slice(-49), emotionData]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MindBridge Therapy Session</h1>
              <p className="text-sm text-gray-600">
                AI-Powered Emotion-Aware Therapy • 
                Session: {sessionId || 'Starting...'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    // checked={avatarSettings.enableTTS}
                    // onChange={(e) => setAvatarSettings(prev => ({ ...prev, enableTTS: e.target.checked }))}
                    className="mr-2"
                  />
                  Text-to-Speech
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                      // checked={avatarSettings.enableAvatar}
                      // onChange={(e) => setAvatarSettings(prev => ({ ...prev, enableAvatar: e.target.checked }))}
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
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h2 className="text-lg font-semibold mb-4">Video Feed</h2>
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
            <div className="bg-white rounded-lg shadow-sm border h-[700px]">
              <ChatInterface
                currentEmotion={currentEmotion}
                userId={userId}
                sessionId={sessionId || undefined}
                // enableTTS={avatarSettings.enableTTS}
                // enableAvatar={avatarSettings.enableAvatar}
                className="h-full"
              />
            </div>
          </div>

          {/* Right Column - Avatar Display */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h2 className="text-lg font-semibold mb-4">AI Therapist Avatar</h2>
              {/* <AvatarDisplay
                className="w-full"
              /> */}
            </div>

            {/* Session Info */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold mb-3">Session Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID:</span>
                  {/* <span className="font-mono text-xs">{userId}</span> */}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Session ID:</span>
                  {/* <span className="font-mono text-xs">{sessionId || 'Creating...'}</span> */}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Emotion:</span>
                  <span className="capitalize">{currentEmotion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Emotion Readings:</span>
                  {/* <span>{emotionHistory.length}</span> */}
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">How to Use</h4>
              <ul className="text-sm text-blue-800 space-y-1">
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
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Save Session
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Export Data
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                New Session
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Session started at {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TherapySession;
