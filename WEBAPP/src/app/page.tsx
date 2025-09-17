'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">
                {!logoError ? (
                  <Image 
                    className="h-12 w-12" 
                    src="/logo.png" 
                    alt="MindBridge Logo" 
                    width={48} 
                    height={48}
                    priority={true}
                    onError={(e) => {
                      console.error('Logo failed to load, trying fallback:', e);
                      setLogoError(true);
                    }}
                  />
                ) : (
                  <Image 
                    className="h-12 w-12" 
                    src="/logo-fallback.svg" 
                    alt="MindBridge Logo" 
                    width={48} 
                    height={48}
                    priority={true}
                  />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MindBridge</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Emotion-Aware AI Therapist</p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <ThemeToggle />
              {session ? (
                <>
                  {session.user?.role === 'patient' && (
                    <>
                      <Link
                        href="/patient/dashboard"
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/patient/session"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                      >
                        Start Session
                      </Link>
                    </>
                  )}
                  {session.user?.role === 'therapist' && (
                    <>
                      <Link
                        href="/therapist/dashboard"
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/therapist/schedule"
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors"
                      >
                        Schedule
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors border border-red-600 dark:border-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            AI-Powered Therapy with{' '}
            <span className="text-blue-600 dark:text-blue-400">Real-Time Emotion Detection</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience personalized therapy sessions with our advanced AI that understands your emotions 
            through facial recognition, provides empathetic responses, and with live humanlike interactions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <>
                {session.user?.role === 'patient' ? (
                  <Link
                    href="/patient/session"
                    className="px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg"
                  >
                    Start Therapy Session
                  </Link>
                ) : (
                  <Link
                    href="/therapist/dashboard"
                    className="px-8 py-4 bg-green-600 dark:bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors shadow-lg"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg"
                >
                  Register
                </Link>
                <Link
                  href="/auth/signin"
                  className="px-8 py-4 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 text-lg font-semibold rounded-lg border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Emotion Detection</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Real-time facial emotion recognition using advanced computer vision and AI
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl text-black dark:text-white font-semibold mb-2">AI Therapist</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Gemini-2.5-flash powered conversations that adapt to your emotional state and needs
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">HumanLike Interaction</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Talking avatar responses with natural voice synthesis for immersive experience
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Progress Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Detailed analytics and insights into your emotional patterns and therapy progress
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-16 border dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-3xl font-bold text-center mb-12 text-black dark:text-white">How MindBridge Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
          <span className="text-2xl">📹</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-black dark:text-white">1. Video Analysis</h4>
              <p className="text-black dark:text-gray-300">
                Our AI analyzes your facial expressions in real-time to detect your current emotional state
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
          <span className="text-2xl">💬</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-black dark:text-white">2. Empathetic Response</h4>
              <p className="text-black dark:text-gray-300">
          The AI therapist generates personalized responses based on your emotions and conversation context
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
          <span className="text-2xl">🎯</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-black dark:text-white">3. Track Progress</h4>
              <p className="text-black dark:text-gray-300">
          Monitor your emotional patterns and therapy progress with detailed analytics and insights
              </p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mb-16 border dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-3xl text-gray-700 dark:text-gray-200 font-bold text-center mb-8">Powered by Advanced Technology</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow transition-colors duration-300">
              <div className="text-2xl mb-2">⚛️</div>
              <p className="font-medium text-black dark:text-white">Next.js</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow transition-colors duration-300">
              <div className="text-2xl mb-2">🧠</div>
              <p className="font-medium text-black dark:text-white">Gemini 2.5</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow transition-colors duration-300">
              <div className="text-2xl mb-2">👁️</div>
              <p className="font-medium text-black dark:text-white">OpenCV</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow transition-colors duration-300">
              <div className="text-2xl mb-2">🎙️</div>
              <p className="font-medium text-black dark:text-white">ElevenLabs</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow transition-colors duration-300">
              <div className="text-2xl mb-2">🎭</div>
              <p className="font-medium text-black dark:text-white">D-ID Avatar</p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow transition-colors duration-300">
              <div className="text-2xl mb-2">🗄️</div>
              <p className="font-medium text-black dark:text-white">MongoDB</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Ready to Start Your Journey?</h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Experience the future of mental health support with AI-powered therapy
          </p>
          <Link
            href={session ? (session.user?.role === 'patient' ? "/patient/session" : "/therapist/dashboard") : "/auth/register"}
            className="inline-flex items-center px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg"
          >
            {session ? (session.user?.role === 'patient' ? 'Begin Your Session' : 'Go to Dashboard') : 'Begin Your First Session'}
            <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 mt-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="text-2xl">🧠</div>
            <h4 className="text-xl font-bold">MindBridge</h4>
          </div>
          <p className="text-gray-400 dark:text-gray-500">
            Trying to fix people&apos;s mental health, one session at a time.
          </p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">
            &copy; {new Date().getFullYear()} MindBridge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
