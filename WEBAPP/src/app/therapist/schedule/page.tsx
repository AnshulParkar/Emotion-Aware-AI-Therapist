'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  User, 
  Bell, 
  CalendarDays, 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  Search, 
  Timer, 
  Settings, 
  Eye, 
  Edit, 
  UserCheck,
  ArrowLeft
} from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Avatar, AvatarFallback } from "../../../components/ui/avatar"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"
import ThemeToggle from "../../../components/ThemeToggle"
import TherapistMobileMenu from "../../../components/TherapistMobileMenu"

interface AppointmentData {
  id: string
  patientName: string
  patientEmail: string
  scheduledTime: Date
  duration: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes?: string
  type: "initial" | "followup" | "emergency"
}

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  isAvailable: boolean
  dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
}

const ScheduleManagement = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session || (session.user as any)?.role !== "therapist") {
      router.replace("/auth/signin")
    }
  }, [session, status, router])

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState<AppointmentData[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"overview" | "appointments" | "calendar" | "availability">("overview")

  // New appointment form state
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    patientEmail: "",
    date: "",
    time: "",
    duration: "60",
    type: "followup" as "initial" | "followup" | "emergency",
    notes: "",
  })

  // Mock data
  useEffect(() => {
    const mockAppointments: AppointmentData[] = [
      {
        id: "apt_1",
        patientName: "Alice Johnson",
        patientEmail: "alice@example.com",
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        duration: 3600,
        status: "confirmed",
        notes: "Follow-up on anxiety management techniques",
        type: "followup",
      },
      {
        id: "apt_2",
        patientName: "David Wilson",
        patientEmail: "david@example.com",
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        duration: 3600,
        status: "pending",
        notes: "Initial consultation for depression",
        type: "initial",
      },
      {
        id: "apt_3",
        patientName: "Bob Smith",
        patientEmail: "bob@example.com",
        scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        duration: 3600,
        status: "confirmed",
        type: "followup",
      },
      {
        id: "apt_4",
        patientName: "Carol Davis",
        patientEmail: "carol@example.com",
        scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        duration: 3600,
        status: "completed",
        notes: "Session completed successfully",
        type: "followup",
      },
      {
        id: "apt_5",
        patientName: "Emma Brown",
        patientEmail: "emma@example.com",
        scheduledTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        duration: 1800,
        status: "cancelled",
        notes: "Patient requested cancellation",
        type: "emergency",
      },
    ]

    const mockTimeSlots: TimeSlot[] = [
      { id: "slot_1", startTime: "09:00", endTime: "10:00", isAvailable: true, dayOfWeek: 1 },
      { id: "slot_2", startTime: "10:00", endTime: "11:00", isAvailable: false, dayOfWeek: 1 },
      { id: "slot_3", startTime: "11:00", endTime: "12:00", isAvailable: true, dayOfWeek: 1 },
      { id: "slot_4", startTime: "14:00", endTime: "15:00", isAvailable: true, dayOfWeek: 1 },
      { id: "slot_5", startTime: "15:00", endTime: "16:00", isAvailable: true, dayOfWeek: 1 },
      { id: "slot_6", startTime: "16:00", endTime: "17:00", isAvailable: false, dayOfWeek: 1 },
    ]

    setAppointments(mockAppointments)
    setTimeSlots(mockTimeSlots)
  }, [])

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "initial":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "followup":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "emergency":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleConfirmAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "confirmed" as const } : apt)),
    )
  }

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "cancelled" as const } : apt)),
    )
  }

  const handleCreateAppointment = () => {
    const newApt: AppointmentData = {
      id: `apt_${Date.now()}`,
      patientName: newAppointment.patientName,
      patientEmail: newAppointment.patientEmail,
      scheduledTime: new Date(`${newAppointment.date}T${newAppointment.time}`),
      duration: Number.parseInt(newAppointment.duration) * 60,
      status: "pending",
      notes: newAppointment.notes,
      type: newAppointment.type,
    }

    setAppointments((prev) => [...prev, newApt])
    setIsNewAppointmentOpen(false)
    setNewAppointment({
      patientName: "",
      patientEmail: "",
      date: "",
      time: "",
      duration: "60",
      type: "followup",
      notes: "",
    })
  }

  const todayAppointments = appointments.filter((apt) => {
    const today = new Date()
    const aptDate = new Date(apt.scheduledTime)
    return aptDate.toDateString() === today.toDateString()
  })

  const upcomingAppointments = appointments.filter((apt) => {
    const now = new Date()
    return apt.scheduledTime > now && apt.status !== "cancelled"
  })

  const stats = {
    totalAppointments: appointments.length,
    todayAppointments: todayAppointments.length,
    pendingAppointments: appointments.filter((apt) => apt.status === "pending").length,
    confirmedAppointments: appointments.filter((apt) => apt.status === "confirmed").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Link href="/therapist/dashboard" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <img src="/logo.png" alt="MindBridge Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
              </Link>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MindBridge
              </h1>
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Schedule Management</span>
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
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300 p-4 sm:p-6 mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back, Dr. {session?.user?.email?.split("@")[0]}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
                  Manage your appointments and availability
                </p>
              </div>
            </div>
            <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Appointment</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Schedule New Appointment</DialogTitle>
                  <DialogDescription>Create a new appointment for a patient.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patient-name" className="text-right">
                      Patient Name
                    </Label>
                    <Input
                      id="patient-name"
                      value={newAppointment.patientName}
                      onChange={(e) => setNewAppointment((prev) => ({ ...prev, patientName: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patient-email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="patient-email"
                      type="email"
                      value={newAppointment.patientEmail}
                      onChange={(e) => setNewAppointment((prev) => ({ ...prev, patientEmail: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment((prev) => ({ ...prev, date: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment((prev) => ({ ...prev, time: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">
                      Duration
                    </Label>
                    <Select
                      value={newAppointment.duration}
                      onValueChange={(value) => setNewAppointment((prev) => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select
                      value={newAppointment.type}
                      onValueChange={(value: "initial" | "followup" | "emergency") =>
                        setNewAppointment((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="initial">Initial Consultation</SelectItem>
                        <SelectItem value="followup">Follow-up Session</SelectItem>
                        <SelectItem value="emergency">Emergency Session</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={newAppointment.notes}
                      onChange={(e) => setNewAppointment((prev) => ({ ...prev, notes: e.target.value }))}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateAppointment} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600">
                    Create Appointment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAppointments}</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Total Appointments</h3>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">All scheduled appointments</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-green-100 dark:bg-green-900 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.todayAppointments}</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Today</h3>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Appointments today</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-yellow-100 dark:bg-yellow-900 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingAppointments}</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Pending</h3>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Awaiting confirmation</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-green-100 dark:bg-green-900 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.confirmedAppointments}</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">Confirmed</h3>
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Ready to go</p>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300 mb-6 lg:mb-8">
          <div className="p-4 sm:p-6 border-b dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Today's Schedule</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Your appointments for today</p>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors space-y-4 sm:space-y-0"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
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
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{appointment.notes}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">{formatTime(appointment.scheduledTime)}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{formatDuration(appointment.duration)}</div>
                      </div>
                      <Badge className={getTypeColor(appointment.type)}>{appointment.type}</Badge>
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No appointments scheduled for today</p>
                  <p className="text-sm">Your schedule is clear!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 transition-colors duration-300">
          <div className="p-4 sm:p-6 border-b dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Next 5 upcoming appointments</p>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors space-y-4 sm:space-y-0"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
                        {appointment.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{appointment.patientName}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{formatDate(appointment.scheduledTime)}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={getTypeColor(appointment.type)}>{appointment.type}</Badge>
                    <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                    {appointment.status === "pending" && (
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleConfirmAppointment(appointment.id)}
                        >
                          <UserCheck className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          <AlertCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 mt-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src="/logo.png" alt="MindBridge Logo" className="w-8 h-8" />
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

export default ScheduleManagement
