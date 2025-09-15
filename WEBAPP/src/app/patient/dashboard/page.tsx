'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '../../../components/ThemeToggle';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import SessionManager from '../../../lib/sessionManager';
import SessionStatus from '../../../components/SessionStatus';

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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessionInfo, setSessionInfo] = useState({
    timeRemaining: '',
    expiringSoon: false,
    isIncognito: false
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "patient") {
      router.replace("/auth/signin");
    }
  }, [session, status, router]);

  // Setup session monitoring
  useEffect(() => {
    if (session) {
      // Setup session handlers
      SessionManager.setupSessionHandlers();
      
      // Check session info
      const updateSessionInfo = async () => {
        const timeRemaining = SessionManager.getSessionTimeRemaining(session);
        const expiringSoon = SessionManager.isSessionExpiringSoon(session);
        const isIncognito = await SessionManager.isIncognitoMode();
        
        setSessionInfo({
          timeRemaining,
          expiringSoon,
          isIncognito
        });
      };
      
      updateSessionInfo();
      
      // Update session info every minute
      const interval = setInterval(updateSessionInfo, 60000);
      return () => clearInterval(interval);
    }
  }, [session]);

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MindBridge Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Track your therapy progress and emotional insights</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Session Status Indicator */}
              <div className="text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${sessionInfo.expiringSoon ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Session expires in {sessionInfo.timeRemaining}
                  </span>
                </div>
                {sessionInfo.isIncognito && (
                  <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    ⚠️ Private browsing - session will end when browser closes
                  </div>
                )}
                {sessionInfo.expiringSoon && (
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    ⏰ Session expiring soon
                  </div>
                )}
              </div>
              
              <ThemeToggle />
              <Link
                href="/patient/session"
                className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
              >
                Start New Session
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalSessions}</p>
              </div>
              <div className="text-blue-500 dark:text-blue-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Therapy sessions completed</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Time</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatDuration(stats.totalDuration)}</p>
              </div>
              <div className="text-green-500 dark:text-green-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Time spent in therapy</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Dominant Mood</p>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getEmotionEmoji(stats.dominantEmotion)}</span>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{stats.dominantEmotion}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Most frequent emotion</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Weekly Progress</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.weeklyProgress}</p>
              </div>
              <div className="text-purple-500 dark:text-purple-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Sessions this week</p>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-300">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Sessions</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Your therapy session history and progress</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Messages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Dominant Emotion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sessions.map((session) => {
                  const dominantEmotion = getDominantEmotion(session.emotionsSummary);
                  return (
                    <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-200">
                          {formatDate(session.startTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-200">
                          {session.status === 'active' ? 'In progress' : formatDuration(session.duration)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-200">
                          {session.messageCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getEmotionEmoji(dominantEmotion)}</span>
                          <span className="text-sm text-gray-900 dark:text-gray-200 capitalize">{dominantEmotion}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          session.status === 'active'
                            ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {session.status === 'active' ? (
                            <Link
                              href="/session"
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            >
                              Continue
                            </Link>
                          ) : (
                            <>
                              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                                View
                              </button>
                              <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 text-center transition-colors duration-300">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Emotion Reports</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              View detailed emotion analytics and trends
            </p>
            <button className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
              View Reports
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 text-center transition-colors duration-300">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Set Goals</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Define therapy goals and track progress
            </p>
            <button className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors">
              Set Goals
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 text-center transition-colors duration-300">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Settings</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Customize your therapy experience
            </p>
            <button className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors">
              Configure
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 text-center transition-colors duration-300">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Session Management</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Manage your login session and security
            </p>
            <div className="space-y-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Session expires: {sessionInfo.timeRemaining}
              </div>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors text-sm"
              >
                Sign Out Now
              </button>
            </div>
          </div>
        </div>

        {/* Session Status Section */}
        <div className="mt-8">
          <SessionStatus />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
