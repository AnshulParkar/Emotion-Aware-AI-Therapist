'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ThemeToggle from '../../../components/ThemeToggle';

export default function UserPage() {
  const [student, setStudent] = useState<{
    name: string;
    email: string;
    mood?: { status: string; lastRecorded: string; frequency: string };
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store JWT here
        const res = await fetch('http://localhost:5001/api/student/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  if (!student) return <p className="text-center mt-20">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img className="h-12 w-12" src="/logo.png" alt="Logo" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MindBridge</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Your Profile</p>
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/user/settings"
              className="px-6 py-2 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-lg border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors"
            >
              Settings
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Welcome, {student.name}
        </h2>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700 transition-colors duration-300 mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Profile Information
          </h3>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p><strong>Email:</strong> {student.email}</p>
            {student.mood && (
              <>
                <p><strong>Last Mood:</strong> {student.mood.status}</p>
                <p><strong>Recorded On:</strong> {new Date(student.mood.lastRecorded).toLocaleDateString()}</p>
                <p><strong>Frequency:</strong> {student.mood.frequency}</p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
