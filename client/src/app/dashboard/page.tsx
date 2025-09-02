'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SessionData {
  id: string;
  userId: string;
  startTime: Date;
  duration: number;
  emotionsSummary: Record<string, number>;
  messageCount: number;
  status: 'active' | 'completed';
}

const Dashboard: React.FC = () => {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalDuration: 0,
    dominantEmotion: 'neutral',
    weeklyProgress: 0,
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockSessions: SessionData[] = [
      {
        id: 'session_1',
        userId: 'user_123',
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        duration: 1800, // 30 minutes
        emotionsSummary: { happy: 5, neutral: 8, sad: 2 },
        messageCount: 15,
        status: 'completed',
      },
      {
        id: 'session_2',
        userId: 'user_123',
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        duration: 2400, // 40 minutes
        emotionsSummary: { happy: 7, neutral: 6, anxious: 3 },
        messageCount: 22,
        status: 'completed',
      },
      {
        id: 'session_3',
        userId: 'user_123',
        startTime: new Date(),
        duration: 0,
        emotionsSummary: {},
        messageCount: 0,
        status: 'active',
      },
    ];

    setSessions(mockSessions);
    
    // Calculate stats
    const completed = mockSessions.filter(s => s.status === 'completed');
    const totalDuration = completed.reduce((sum, s) => sum + s.duration, 0);
    
    setStats({
      totalSessions: completed.length,
      totalDuration,
      dominantEmotion: 'happy',
      weeklyProgress: 3,
    });
  }, []);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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
      anxious: '😰',
    };
    return emotionEmojis[emotion.toLowerCase()] || '🤔';
  };

  const getDominantEmotion = (emotions: Record<string, number>): string => {
    if (Object.keys(emotions).length === 0) return 'neutral';
    return Object.entries(emotions)
      .sort(([, a], [, b]) => b - a)[0][0];
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MindBridge Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your therapy progress and emotional insights</p>
            </div>
            <Link
              href="/session"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start New Session
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSessions}</p>
              </div>
              <div className="text-blue-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Therapy sessions completed</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Time</p>
                <p className="text-3xl font-bold text-gray-900">{formatDuration(stats.totalDuration)}</p>
              </div>
              <div className="text-green-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Time spent in therapy</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dominant Mood</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getEmotionEmoji(stats.dominantEmotion)}</span>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{stats.dominantEmotion}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Most frequent emotion</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Progress</p>
                <p className="text-3xl font-bold text-gray-900">{stats.weeklyProgress}</p>
              </div>
              <div className="text-purple-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Sessions this week</p>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Recent Sessions</h2>
            <p className="text-gray-600 text-sm mt-1">Your therapy session history and progress</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Messages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dominant Emotion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((session) => {
                  const dominantEmotion = getDominantEmotion(session.emotionsSummary);
                  return (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {session.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(session.startTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {session.status === 'active' ? 'In progress' : formatDuration(session.duration)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {session.messageCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getEmotionEmoji(dominantEmotion)}</span>
                          <span className="text-sm text-gray-900 capitalize">{dominantEmotion}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          session.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {session.status === 'active' ? (
                            <Link
                              href="/session"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Continue
                            </Link>
                          ) : (
                            <>
                              <button className="text-blue-600 hover:text-blue-900">
                                View
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                Export
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2">Emotion Reports</h3>
            <p className="text-gray-600 text-sm mb-4">
              View detailed emotion analytics and trends
            </p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              View Reports
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Set Goals</h3>
            <p className="text-gray-600 text-sm mb-4">
              Define therapy goals and track progress
            </p>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Set Goals
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-gray-600 text-sm mb-4">
              Customize your therapy experience
            </p>
            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
              Configure
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
