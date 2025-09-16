"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CalendarIcon,
  Clock,
  Plus,
  Eye,
  Edit,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Filter,
  Search,
  CalendarDays,
  Timer,
  Settings,
} from "lucide-react"
import ThemeToggle from "../../../components/ThemeToggle"
import MobileNavigation from "../../../components/MobileNavigation"

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

const ScheduleManagement: React.FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session || (session.user as { role?: string })?.role !== "therapist") {
      router.replace("/auth/signin")
    }
  }, [session, status, router])

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState<AppointmentData[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/therapist/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Schedule Management</h1>
                  <p className="text-muted-foreground">Manage appointments and availability</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <ThemeToggle />
              
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Appointment
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
                    <Button onClick={handleCreateAppointment}>Create Appointment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              </div>
              
              {/* Mobile Navigation */}
              <MobileNavigation />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">All Appointments</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                  <p className="text-xs text-muted-foreground">All scheduled appointments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.todayAppointments}</div>
                  <p className="text-xs text-muted-foreground">Appointments today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingAppointments}</div>
                  <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.confirmedAppointments}</div>
                  <p className="text-xs text-muted-foreground">Ready to go</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Schedule</CardTitle>
                <CardDescription>Your appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.length > 0 ? (
                    todayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {appointment.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{appointment.patientName}</div>
                            <div className="text-sm text-muted-foreground">{appointment.patientEmail}</div>
                            {appointment.notes && (
                              <div className="text-xs text-muted-foreground mt-1">{appointment.notes}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-medium">{formatTime(appointment.scheduledTime)}</div>
                            <div className="text-sm text-muted-foreground">{formatDuration(appointment.duration)}</div>
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
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
                      <p>No appointments scheduled for today</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Next 5 upcoming appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 5).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {appointment.patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-sm text-muted-foreground">{formatDate(appointment.scheduledTime)}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getTypeColor(appointment.type)}>{appointment.type}</Badge>
                        <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                        {appointment.status === "pending" && (
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="default"
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* All Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>Complete list of all scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {appointment.patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-sm text-muted-foreground">{appointment.patientEmail}</div>
                          <div className="text-sm text-muted-foreground">{formatDate(appointment.scheduledTime)}</div>
                          {appointment.notes && (
                            <div className="text-xs text-muted-foreground mt-1">{appointment.notes}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{formatDuration(appointment.duration)}</div>
                        </div>
                        <Badge className={getTypeColor(appointment.type)}>{appointment.type}</Badge>
                        <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                        <div className="flex space-x-1">
                          {appointment.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
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
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>Select a date to view appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md" />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {selectedDate ? `Appointments for ${selectedDate.toDateString()}` : "Select a date"}
                  </CardTitle>
                  <CardDescription>View and manage appointments for the selected date</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="space-y-4">
                      {appointments
                        .filter((apt) => {
                          const aptDate = new Date(apt.scheduledTime)
                          return aptDate.toDateString() === selectedDate.toDateString()
                        })
                        .map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarFallback>
                                  {appointment.patientName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{appointment.patientName}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatTime(appointment.scheduledTime)} • {formatDuration(appointment.duration)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getTypeColor(appointment.type)}>{appointment.type}</Badge>
                              <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                            </div>
                          </div>
                        ))}
                      {appointments.filter((apt) => {
                        const aptDate = new Date(apt.scheduledTime)
                        return aptDate.toDateString() === selectedDate.toDateString()
                      }).length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
                          <p>No appointments scheduled for this date</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
                      <p>Select a date from the calendar to view appointments</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Availability Settings
                </CardTitle>
                <CardDescription>Manage your weekly availability and time slots</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Monday Time Slots</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {timeSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-3 border rounded-lg text-center cursor-pointer transition-colors ${
                            slot.isAvailable
                              ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200"
                              : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200"
                          }`}
                        >
                          <div className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="text-xs mt-1">{slot.isAvailable ? "Available" : "Booked"}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center py-8 text-muted-foreground">
                    <Timer className="h-12 w-12 mx-auto mb-4" />
                    <p>Availability management coming soon</p>
                    <p className="text-sm">Set your working hours and break times</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default ScheduleManagement
