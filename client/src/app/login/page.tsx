'use client';

import { useState } from 'react';
import ThemeToggle from '../../components/ThemeToggle';

export default function AuthPage() {
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async () => {
    setError('');
    setSuccess('');

    const url = `http://localhost:5001/api/${role}/login`;
    const body = { email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      localStorage.setItem('token', data.token);
      setSuccess(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful!`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="relative flex w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border dark:border-gray-700 transition-colors duration-300">
        {/* Theme Toggle Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>

        {/* Left Side - Login Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          {/* Role Selector - inside flow */}
          <div className="flex mb-6 border border-gray-300 dark:border-gray-600 rounded-md shadow-md overflow-hidden w-max mx-auto">
            <button
              onClick={() => setRole('student')}
              className={`px-5 py-2 text-sm font-semibold transition-colors ${
                role === 'student'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`px-5 py-2 text-sm font-semibold transition-colors ${
                role === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Login Form */}
          <div className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Error / Success */}
          {error && <p className="text-red-500 mt-3 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 mt-3 text-sm text-center">{success}</p>}

          {/* Submit Button */}
          <button
            onClick={handleLogin}
            className="w-full mt-8 px-5 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-semibold text-lg transition-colors shadow-md"
          >
            Login
          </button>

          {/* Sign Up Link */}
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </div>

        {/* Right Side - Logo and Header */}
        <div className="w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-10 relative">
          <img className="h-36 w-36 mb-6" src="/logo.png" alt="Logo" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">MindBridge</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center">
            Emotion-Aware AI Therapist
          </p>
        </div>
      </div>
    </div>
  );
}
