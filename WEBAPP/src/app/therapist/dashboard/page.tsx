"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Avatar, AvatarFallback } from "../../../components/ui/avatar"
import {
  Brain,
  Calendar,
  Clock,
  Users,
  Activity,
  BarChart3,
  Settings,
  Eye,
  Download,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  CalendarDays,
  UserCheck,
  Plus,
  Menu,
} from "lucide-react"
import ThemeToggle from "../../../components/ThemeToggle"
import TherapistMobileMenu from "../../../components/TherapistMobileMenu"

interface SessionData {
  id: string
  userId: string
  patientName: string
  patientEmail: string
  startTime: Date
  duration: number
  emotionsSummary: Record<string, number>
  messageCount: number
  status: "active" | "completed" | "scheduled"
}

interface PatientData {
  id: string
  name: string
  email: string
  totalSessions: number
  lastSession: Date
  dominantEmotion: string
  improvementTrend: "up" | "down" | "stable"
}

interface AppointmentData {
  id: string
  patientName: string
  patientEmail: string
  scheduledTime: Date
  duration: number
  status: "pending" | "confirmed" | "cancelled"
  notes?: string
}

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session || (session.user as any)?.role !== "therapist") {
      router.replace("/auth/signin")
    }
  }, [session, status, router])

  const [sessions, setSessions] = useState<SessionData[]>([])
  const [patients, setPatients] = useState<PatientData[]>([])
  const [appointments, setAppointments] = useState<AppointmentData[]>([])
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalSessions: 0,
    totalDuration: 0,
    weeklyAppointments: 0,
    activePatients: 0,
    avgSessionDuration: 0,
  })

  // Mock data for demonstration
  useEffect(() => {
    const mockSessions: SessionData[] = [
      {
        id: "session_1",
        userId: "patient_1",
        patientName: "Alice Johnson",
        patientEmail: "alice@example.com",
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        duration: 1800,
        emotionsSummary: { happy: 5, neutral: 8, sad: 2 },
        messageCount: 15,
        status: "completed",
      },
      {
        id: "session_2",
        userId: "patient_2",
        patientName: "Bob Smith",
        patientEmail: "bob@example.com",
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        duration: 2400,
        emotionsSummary: { happy: 7, neutral: 6, anxious: 3 },
        messageCount: 22,
        status: "completed",
      },
      {
        id: "session_3",
        userId: "patient_3",
        patientName: "Carol Davis",
        patientEmail: "carol@example.com",
        startTime: new Date(),
        duration: 0,
        emotionsSummary: {},
        messageCount: 0,
        status: "active",
      },
    ]

    const mockPatients: PatientData[] = [
      {
        id: "patient_1",
        name: "Alice Johnson",
        email: "alice@example.com",
        totalSessions: 8,
        lastSession: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dominantEmotion: "happy",
        improvementTrend: "up",
      },
      {
        id: "patient_2",
        name: "Bob Smith",
        email: "bob@example.com",
        totalSessions: 12,
        lastSession: new Date(Date.now() - 24 * 60 * 60 * 1000),
        dominantEmotion: "neutral",
        improvementTrend: "stable",
      },
      {
        id: "patient_3",
        name: "Carol Davis",
        email: "carol@example.com",
        totalSessions: 5,
        lastSession: new Date(),
        dominantEmotion: "anxious",
        improvementTrend: "up",
      },
    ]

    const mockAppointments: AppointmentData[] = [
      {
        id: "apt_1",
        patientName: "Alice Johnson",
        patientEmail: "alice@example.com",
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: 3600,
        status: "confirmed",
        notes: "Follow-up on anxiety management techniques",
      },
      {
        id: "apt_2",
        patientName: "David Wilson",
        patientEmail: "david@example.com",
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
        duration: 3600,
        status: "pending",
        notes: "Initial consultation",
      },
      {
        id: "apt_3",
        patientName: "Bob Smith",
        patientEmail: "bob@example.com",
        scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 3600,
        status: "confirmed",
      },
    ]

    setSessions(mockSessions)
    setPatients(mockPatients)
    setAppointments(mockAppointments)

    const completed = mockSessions.filter((s) => s.status === "completed")
    const totalDuration = completed.reduce((sum, s) => sum + s.duration, 0)

    setStats({
      totalPatients: mockPatients.length,
      totalSessions: completed.length,
      totalDuration,
      weeklyAppointments: mockAppointments.length,
      activePatients: mockPatients.filter((p) => p.lastSession > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
      avgSessionDuration: completed.length > 0 ? Math.round(totalDuration / completed.length / 60) : 0,
    })
  }, [])

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min`
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getEmotionEmoji = (emotion: string): string => {
    const emotionEmojis: Record<string, string> = {
      happy: "😊",
      sad: "😢",
      angry: "😠",
      fearful: "😰",
      surprised: "😲",
      disgusted: "🤢",
      neutral: "😐",
      anxious: "😰",
    }
    return emotionEmojis[emotion.toLowerCase()] || "🤔"
  }

  const getDominantEmotion = (emotions: Record<string, number>): string => {
    if (Object.keys(emotions).length === 0) return "neutral"
    return Object.entries(emotions).sort(([, a], [, b]) => b - a)[0][0]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary text-primary-foreground"
      case "completed":
        return "bg-secondary text-secondary-foreground"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen min-w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <img className="h-12 w-12 flex-shrink-0" src="/logo.png" alt="MindBridge Logo" />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">MindBridge</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Therapist Dashboard</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
              <ThemeToggle />
              <Link
                href="/therapist/schedule"
                className="px-2 lg:px-4 py-2 text-sm lg:text-base text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors whitespace-nowrap"
              >
                Schedule
              </Link>
              <Link
                href="/peer-support"
                className="px-2 lg:px-4 py-2 text-sm lg:text-base text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
              >
                Peer Support
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-2 lg:px-4 py-2 text-sm lg:text-base text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors border border-red-600 dark:border-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 whitespace-nowrap"
              >
                Sign Out
              </button>
            </nav>
            
            {/* Mobile Navigation */}
            <TherapistMobileMenu currentPage="dashboard" />
          </div>
          
          {/* Welcome Message */}
          <div className="mt-6">
            <h2 className="text-1xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, Dr. {session?.user?.email?.split("@")[0]}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
              Monitor your patients' progress and manage your therapy sessions
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 sm:p-4 transition-colors duration-300 overflow-hidden">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-700 text-xs sm:text-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-1 sm:px-3">Overview</TabsTrigger>
              <TabsTrigger value="patients" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-1 sm:px-3">Patients</TabsTrigger>
              <TabsTrigger value="sessions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-1 sm:px-3">Sessions</TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-1 sm:px-3">Schedule</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-1 sm:px-3">Analytics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 sm:space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPatients}</div>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Total Patients</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{stats.activePatients} active this week</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-green-100 dark:bg-green-900 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSessions}</div>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Total Sessions</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Therapy sessions completed</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.avgSessionDuration} min</div>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Avg Session</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Average session duration</p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-orange-100 dark:bg-orange-900 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.weeklyAppointments}</div>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">This Week</h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Scheduled appointments</p>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
              <div className="p-4 sm:p-6 border-b dark:border-gray-700">
                <div className="flex items-center mb-2">
                  <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Today's Schedule</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Upcoming appointments and sessions</p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {appointments
                    .filter((apt) => {
                      const today = new Date()
                      const aptDate = new Date(apt.scheduledTime)
                      return aptDate.toDateString() === today.toDateString()
                    })
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 space-y-3 sm:space-y-0"
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
                              {appointment.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">{appointment.patientName}</div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">{appointment.patientEmail}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4 flex-shrink-0">
                          <div className="text-left sm:text-right">
                            <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{formatTime(appointment.scheduledTime)}</div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{formatDuration(appointment.duration)}</div>
                          </div>
                          <Badge 
                            className={`${
                              appointment.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            } text-xs whitespace-nowrap`}
                          >
                            {appointment.status}
                          </Badge>
                          <button 
                            className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors flex-shrink-0"
                            title="View appointment details"
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  {appointments.filter((apt) => {
                    const today = new Date()
                    const aptDate = new Date(apt.scheduledTime)
                    return aptDate.toDateString() === today.toDateString()
                  }).length === 0 && (
                    <div className="text-center py-8 sm:py-12 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                      <p className="text-sm sm:text-base">No appointments scheduled for today</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Patient Analytics</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">View detailed patient progress reports</p>
                  <button className="w-full px-4 sm:px-6 py-2 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base">
                    View Analytics
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Schedule Session</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">Book a new appointment with a patient</p>
                  <Link
                    href="/therapist/schedule"
                    className="block w-full px-4 sm:px-6 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-center text-sm sm:text-base"
                  >
                    Schedule Appointment
                  </Link>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300 sm:col-span-2 lg:col-span-1">
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Settings</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">Customize your therapist experience</p>
                  <button className="w-full px-4 sm:px-6 py-2 bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base">
                    Configure Settings
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
              <div className="p-6 border-b dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Patient Management</h3>
                <p className="text-gray-600 dark:text-gray-300">Overview of all your patients and their progress</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
                    >
                      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{patient.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{patient.email}</div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="text-left sm:text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{patient.totalSessions} sessions</div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">Last: {formatDate(patient.lastSession)}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getEmotionEmoji(patient.dominantEmotion)}</span>
                          <Badge 
                            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 capitalize"
                          >
                            {patient.dominantEmotion}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">{getTrendIcon(patient.improvementTrend)}</div>
                        <button 
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          title="View patient details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
              <div className="p-6 border-b dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Session History</h3>
                <p className="text-gray-600 dark:text-gray-300">All therapy sessions and their outcomes</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {sessions.map((session) => {
                    const dominantEmotion = getDominantEmotion(session.emotionsSummary)
                    return (
                      <div
                        key={session.id}
                        className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
                      >
                        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                              {session.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{session.patientName}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{formatDate(session.startTime)}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="text-left lg:text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {session.status === "active" ? "In progress" : formatDuration(session.duration)}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                              <MessageSquare className="inline h-3 w-3 mr-1" />
                              {session.messageCount} messages
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getEmotionEmoji(dominantEmotion)}</span>
                            <Badge className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 capitalize">
                              {dominantEmotion}
                            </Badge>
                          </div>
                          <Badge 
                            className={`${
                              session.status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}
                          >
                            {session.status}
                          </Badge>
                          <div className="flex space-x-2">
                            <button 
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                              title="View session details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                              title="Download session report"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
              <div className="p-6 border-b dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Appointment Schedule</h3>
                <p className="text-gray-600 dark:text-gray-300">Manage your upcoming appointments and availability</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
                    >
                      <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                            {appointment.patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{appointment.patientName}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{appointment.patientEmail}</div>
                          {appointment.notes && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{appointment.notes}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="text-left lg:text-right">
                          <div className="font-medium text-gray-900 dark:text-white">{formatDate(appointment.scheduledTime)}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{formatDuration(appointment.duration)}</div>
                        </div>
                        <Badge 
                          className={`${
                            appointment.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : appointment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {appointment.status}
                        </Badge>
                        <div className="flex space-x-2">
                          {appointment.status === "pending" && (
                            <>
                              <button 
                                className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                                title="Confirm appointment"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                              <button 
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                                title="Cancel appointment"
                              >
                                <AlertCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button 
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="View appointment details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
                <div className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Patient Progress Analytics</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Track overall patient improvement trends</p>
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    <p>Detailed analytics coming soon</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
                <div className="text-center">
                  <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Session Effectiveness</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Measure therapy session outcomes and success rates</p>
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    <p>Effectiveness metrics coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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

export default Dashboard
