'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, Plus, User, Bell } from "lucide-react"
import ThemeToggle from "../../../components/ThemeToggle"
import TherapistMobileMenu from "../../../components/TherapistMobileMenu"

export default function TherapistSchedule() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session || (session.user as any)?.role !== "therapist") {
      router.replace("/auth/signin")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== "therapist") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MindBridge
              </h1>
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Schedule</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2 sm:space-x-6">
              <Link 
                href="/therapist/dashboard" 
                className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap flex-shrink-0"
              >
                Dashboard
              </Link>
              <ThemeToggle />
            </nav>
            
            {/* Mobile Navigation */}
            <TherapistMobileMenu currentPage="schedule" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="space-y-6 lg:space-y-8">
          {/* Page Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Schedule Management
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
                  Manage your appointments and availability
                </p>
              </div>
              <button className="flex items-center space-x-2 px-4 sm:px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                <Plus className="h-4 w-4" />
                <span>New Appointment</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">8</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Today's Appointments</h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Scheduled sessions</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="bg-green-100 dark:bg-green-900 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">2h 30m</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Remaining Time</h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Until next appointment</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="bg-purple-100 dark:bg-purple-900 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">15</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">This Week</h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Total appointments</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="bg-orange-100 dark:bg-orange-900 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">3</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Pending</h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Awaiting confirmation</p>
            </div>
          </div>

          {/* Schedule Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300 p-6">
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Schedule Management Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Full calendar integration and appointment management will be available here.
              </p>
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Features in development:</p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <li>• Interactive calendar view</li>
                  <li>• Patient appointment booking</li>
                  <li>• Availability management</li>
                  <li>• Automated reminders</li>
                  <li>• Time zone handling</li>
                </ul>
              </div>
            </div>
          </div>
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
            Empowering therapists with AI-powered insights and tools.
          </p>
          <p className="text-gray-400 dark:text-gray-500 mt-2">
            &copy; {new Date().getFullYear()} MindBridge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}