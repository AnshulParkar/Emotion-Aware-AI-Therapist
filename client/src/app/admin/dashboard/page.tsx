'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '../../../components/ThemeToggle';

interface AdminStats {
  totalStudents: number;
  totalSessions: number;
  activeSessions: number;
  weeklyProgress: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    totalSessions: 540,
    activeSessions: 5,
    weeklyProgress: 32,
  });

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/admin/students");
        if (!res.ok) throw new Error("Failed to fetch students");

        const data = await res.json();
        setStats(prev => ({ ...prev, totalStudents: data.length }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudentCount();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage students, sessions, and progress
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/admin/students"
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
            >
              Manage Students
            </Link>
          </div>
        </div>
      </header>

      {/* Main Stats */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-300">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Students</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-300">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Sessions</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalSessions}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-300">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Sessions</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.activeSessions}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 transition-colors duration-300">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Weekly Progress</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.weeklyProgress}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 text-center transition-colors duration-300">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Manage Students</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              View, edit, or remove student accounts
            </p>
            <Link
              href="/admin/students"
              className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            >
              Go to Students
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 text-center transition-colors duration-300">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Session Reports</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Generate analytics for student sessions
            </p>
            <button className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors">
              View Reports
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 text-center transition-colors duration-300">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Settings</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Configure admin settings and preferences
            </p>
            <button className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors">
              Configure
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
