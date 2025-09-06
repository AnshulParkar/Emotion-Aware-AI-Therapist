'use client';

import React, { useState, useEffect } from 'react';
import ThemeToggle from '../../../components/ThemeToggle';

interface Student {
  name: string;
  email: string;
  lastSession: string;
  frequency: 'never' | 'rarely' | 'occasionally' | 'frequently';
}

const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/admin/students");
        if (!res.ok) throw new Error("Failed to fetch students");

        const data: Student[] = (await res.json()).map((student: any) => ({
          name: student.name,
          email: student.email,
          lastSession: student.mood.lastRecorded
            ? new Date(student.mood.lastRecorded).toLocaleDateString()
            : '-',
          frequency: student.mood.frequency
        }));

        setStudents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Students</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Manage student accounts and monitor progress</p>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium">
              Add Student
            </button>
          </div>
        </div>
      </header>

      {/* Student Table */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && <p className="text-gray-600 dark:text-gray-300">Loading students...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-x-auto transition-colors duration-300">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['#', 'Name', 'Email', 'Last Session', 'Frequency', 'Actions'].map(header => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                      No students to show
                    </td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{student.lastSession}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white capitalize">{student.frequency}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-2">View</button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Edit</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminStudents;
