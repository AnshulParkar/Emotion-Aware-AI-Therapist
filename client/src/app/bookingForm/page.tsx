"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Moon, Sun, Shield, Clock, CheckCircle, Video, MapPin } from "lucide-react"

interface FormData {
  name: string
  email?: string
  phone?: string
  counselor: string
  sessionType: string
  date: string
  time: string
  notes: string
  shareChatSummary: boolean
}

interface QnAFormData {
  previousTherapy: string
  currentMedications: string
  primaryConcerns: string
  goals: string
  emergencyContactName: string
  emergencyContactPhone: string
  preferredCommunication: string
  triggers: string
  copingStrategies: string
}

interface FormErrors {
  email?: string
  counselor?: string
  sessionType?: string
  date?: string
  time?: string
}

const counselors = [
  { id: "dr-smith", name: "Dr. Sarah Smith", specialty: "Anxiety & Depression" },
  { id: "dr-johnson", name: "Dr. Michael Johnson", specialty: "Trauma Therapy" },
  { id: "dr-williams", name: "Dr. Emily Williams", specialty: "Family Counseling" },
  { id: "crisis-line", name: "Crisis Support Helpline", specialty: "24/7 Emergency Support" },
]

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
]

export default function BookingPage() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showQnAForm, setShowQnAForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    counselor: "",
    sessionType: "",
    date: "",
    time: "",
    notes: "",
    shareChatSummary: false,
  })
  const [qnaData, setQnaData] = useState<QnAFormData>({
    previousTherapy: "",
    currentMedications: "",
    primaryConcerns: "",
    goals: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    preferredCommunication: "",
    triggers: "",
    copingStrategies: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email && !formData.phone) {
      newErrors.email = "Please provide either email or phone number"
    }

    if (!formData.counselor) {
      newErrors.counselor = "Please select a counselor or helpline"
    }

    if (!formData.sessionType) {
      newErrors.sessionType = "Please select session type"
    }

    if (!formData.date) {
      newErrors.date = "Please select a preferred date"
    }

    if (!formData.time) {
      newErrors.time = "Please select a preferred time"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setShowQnAForm(true)
  }

  const handleQnASubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleQnAChange = (field: keyof QnAFormData, value: string) => {
    setQnaData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setShowQnAForm(false)
    setFormData({
      name: "",
      email: "",
      phone: "",
      counselor: "",
      sessionType: "",
      date: "",
      time: "",
      notes: "",
      shareChatSummary: false,
    })
    setQnaData({
      previousTherapy: "",
      currentMedications: "",
      primaryConcerns: "",
      goals: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      preferredCommunication: "",
      triggers: "",
      copingStrategies: "",
    })
    setErrors({})
  }

  if (showQnAForm && !isSubmitted) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="flex justify-center min-h-screen py-4">
          <div className="w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
            <div className="flex justify-between items-center mb-8 sm:mb-12">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Patient Intake Form</h1>
                <p className="text-sm text-muted-foreground mt-2">Help us understand your needs better</p>
              </div>
              {mounted && (
                <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full bg-transparent">
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="shadow-sm border-0 bg-card">
                <CardHeader className="p-6 pb-8">
                  <CardTitle className="text-lg text-card-foreground">Pre-Session Questionnaire</CardTitle>
                  <CardDescription className="text-balance mt-3">
                    This information helps your therapist prepare for your session and provide better care.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-8">
                  <form onSubmit={handleQnASubmit} className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-card-foreground">
                      Have you received therapy or counseling before?
                    </Label>
                    <RadioGroup
                      value={qnaData.previousTherapy}
                      onValueChange={(value: string) => handleQnAChange("previousTherapy", value)}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="yes"
                          id="therapy-yes"
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary dark:border-white/20 dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white"
                        />
                        <Label htmlFor="therapy-yes">Yes, I have previous experience with therapy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="no"
                          id="therapy-no"
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary dark:border-white/20 dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white"
                        />
                        <Label htmlFor="therapy-no">No, this is my first time</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="medications" className="text-sm font-medium text-card-foreground">
                      Current medications or supplements (Optional)
                    </Label>
                    <Textarea
                      id="medications"
                      placeholder="List any medications, supplements, or treatments you're currently taking..."
                      value={qnaData.currentMedications}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleQnAChange("currentMedications", e.target.value)}
                      className="bg-input border-border focus:ring-ring min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="concerns" className="text-sm font-medium text-card-foreground">
                      What are your primary concerns or reasons for seeking therapy?
                    </Label>
                    <Textarea
                      id="concerns"
                      placeholder="Describe what brought you here today..."
                      value={qnaData.primaryConcerns}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleQnAChange("primaryConcerns", e.target.value)}
                      className="bg-input border-border focus:ring-ring min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="goals" className="text-sm font-medium text-card-foreground">
                      What would you like to achieve through therapy?
                    </Label>
                    <Textarea
                      id="goals"
                      placeholder="Describe your goals and what success looks like to you..."
                      value={qnaData.goals}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleQnAChange("goals", e.target.value)}
                      className="bg-input border-border focus:ring-ring min-h-[100px] resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-card-foreground">Emergency contact information</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="emergency-name" className="text-xs text-muted-foreground">
                          Contact Name
                        </Label>
                        <Input
                          id="emergency-name"
                          placeholder="Full name"
                          value={qnaData.emergencyContactName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQnAChange("emergencyContactName", e.target.value)}
                          className="bg-input border-border focus:ring-ring"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergency-phone" className="text-xs text-muted-foreground">
                          Phone Number
                        </Label>
                        <Input
                          id="emergency-phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={qnaData.emergencyContactPhone}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQnAChange("emergencyContactPhone", e.target.value)}
                          className="bg-input border-border focus:ring-ring"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-card-foreground">
                      Preferred method of communication between sessions
                    </Label>
                    <RadioGroup
                      value={qnaData.preferredCommunication}
                      onValueChange={(value: string) => handleQnAChange("preferredCommunication", value)}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex items-center space-x-2 p-3 rounded-md border border-border bg-input/50">
                        <RadioGroupItem
                          value="email"
                          id="comm-email"
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary dark:border-white/20 dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white"
                        />
                        <Label htmlFor="comm-email" className="flex items-center gap-2 cursor-pointer">
                          <Video className="h-4 w-4" />
                          Email
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-md border border-border bg-input/50">
                        <RadioGroupItem
                          value="phone"
                          id="comm-phone"
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary dark:border-white/20 dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white"
                        />
                        <Label htmlFor="comm-phone" className="flex items-center gap-2 cursor-pointer">
                          <Video className="h-4 w-4" />
                          Phone call
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-md border border-border bg-input/50">
                        <RadioGroupItem
                          value="text"
                          id="comm-text"
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary dark:border-white/20 dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white"
                        />
                        <Label htmlFor="comm-text" className="flex items-center gap-2 cursor-pointer">
                          <Video className="h-4 w-4" />
                          Text message
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 rounded-md border border-border bg-input/50">
                        <RadioGroupItem
                          value="none"
                          id="comm-none"
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary dark:border-white/20 dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white"
                        />
                        <Label htmlFor="comm-none" className="flex items-center gap-2 cursor-pointer">
                          <Video className="h-4 w-4" />
                          No contact between sessions
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="triggers" className="text-sm font-medium text-card-foreground">
                      Known triggers or topics to approach carefully (Optional)
                    </Label>
                    <Textarea
                      id="triggers"
                      placeholder="Help us create a safe space by sharing any sensitive topics..."
                      value={qnaData.triggers}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleQnAChange("triggers", e.target.value)}
                      className="bg-input border-border focus:ring-ring min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="coping" className="text-sm font-medium text-card-foreground">
                      Current coping strategies that work for you (Optional)
                    </Label>
                    <Textarea
                      id="coping"
                      placeholder="What helps you feel better when you're struggling?"
                      value={qnaData.copingStrategies}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleQnAChange("copingStrategies", e.target.value)}
                      className="bg-input border-border focus:ring-ring min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-8">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setShowQnAForm(false)}
                    >
                      Back to Booking
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Submitting...
                        </div>
                      ) : (
                        "Complete Booking"
                      )}
                    </Button>
                  </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    const selectedCounselor = counselors.find((c) => c.id === formData.counselor)

    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <div className="flex justify-center min-h-screen py-4">
          <div className="w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
            <div className="flex justify-between items-center mb-8 sm:mb-12">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Confidential Booking System</h1>
                <p className="text-sm text-muted-foreground mt-2">Your privacy is our priority</p>
              </div>
              {mounted && (
                <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full bg-transparent">
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="shadow-sm border-0 bg-card">
                <CardHeader className="text-center p-6 pb-8">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-card-foreground">Appointment Request Submitted</CardTitle>
                  <CardDescription className="text-balance mt-3">
                    Thank you for reaching out. Your appointment request has been received and will be processed
                    confidentially.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-card-foreground">Appointment Details:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {formData.name && (
                        <div>
                          <span className="text-muted-foreground">Name:</span>
                          <span className="ml-2 text-card-foreground">{formData.name}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Contact:</span>
                        <span className="ml-2 text-card-foreground">{formData.email || formData.phone}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Provider:</span>
                        <span className="ml-2 text-card-foreground">{selectedCounselor?.name}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Specialty:</span>
                        <span className="ml-2 text-card-foreground">{selectedCounselor?.specialty}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Session Type:</span>
                        <span className="ml-2 text-card-foreground flex items-center gap-1">
                          {formData.sessionType === "virtual" ? (
                            <>
                              <Video className="h-3 w-3" />
                              Virtual Session
                            </>
                          ) : (
                            <>
                              <MapPin className="h-3 w-3" />
                              In-Person Session
                            </>
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <span className="ml-2 text-card-foreground">{formData.date}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time:</span>
                        <span className="ml-2 text-card-foreground">{formData.time}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Chat Summary:</span>
                        <span className="ml-2 text-card-foreground">
                          {formData.shareChatSummary ? "Will be shared" : "Not shared"}
                        </span>
                      </div>
                    </div>
                    {formData.notes && (
                      <div>
                        <span className="text-muted-foreground text-sm">Notes:</span>
                        <p className="text-card-foreground text-sm mt-1">{formData.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-card-foreground mb-1">Your Privacy is Protected</h4>
                        <p className="text-sm text-muted-foreground text-pretty">
                          All information shared is confidential and will not be disclosed to any third parties. You
                          will receive a confirmation within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button onClick={resetForm} variant="outline" className="flex-1 bg-transparent">
                      Book Another Appointment
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90">Return to Dashboard</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="flex justify-center min-h-screen py-4">
        <div className="w-full max-w-4xl px-4 sm:px-6 py-8 sm:py-12 space-y-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Confidential Booking System</h1>
              <p className="text-sm text-muted-foreground mt-2">Schedule your appointment safely and privately</p>
            </div>
            {mounted && (
              <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full bg-transparent">
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground mb-2">🔒 Your Information is Safe</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    All data is encrypted and confidential. We never share your information with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="shadow-sm border-0 bg-card">
              <CardHeader className="p-6 pb-8">
                <CardTitle className="text-lg text-card-foreground">Book Your Appointment</CardTitle>
                <CardDescription className="text-balance mt-3">
                  Fill out the form below to schedule a confidential session with one of our qualified professionals.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Label htmlFor="name" className="text-sm font-medium text-card-foreground">
                        Name (Optional)
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("name", e.target.value)}
                        className="bg-input border-border focus:ring-ring"
                      />
                      <p className="text-xs text-muted-foreground">
                        You may use a preferred name or leave blank for anonymous booking
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
                            className={`bg-input border-border focus:ring-ring ${errors.email ? "border-destructive" : ""}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium text-card-foreground">
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={formData.phone}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("phone", e.target.value)}
                            className="bg-input border-border focus:ring-ring"
                          />
                        </div>
                      </div>
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      <p className="text-xs text-muted-foreground">
                        Please provide at least one contact method for appointment confirmation
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="counselor" className="text-sm font-medium text-card-foreground">
                            Select Counselor or Helpline *
                          </Label>
                          <Select
                            value={formData.counselor}
                            onValueChange={(value: string) => handleInputChange("counselor", value)}
                          >
                            <SelectTrigger
                              className={`bg-input border-border focus:ring-ring ${
                                errors.counselor ? "border-destructive" : ""
                              }`}
                            >
                              <SelectValue placeholder="Choose a provider..." />
                            </SelectTrigger>
                            <SelectContent>
                              {counselors.map((counselor) => (
                                <SelectItem key={counselor.id} value={counselor.id}>
                                  <div>
                                    <div className="font-medium">{counselor.name}</div>
                                    <div className="text-xs text-muted-foreground">{counselor.specialty}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.counselor && <p className="text-sm text-destructive">{errors.counselor}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="session-type" className="text-sm font-medium text-card-foreground">
                            Session Type *
                          </Label>
                          <Select
                            value={formData.sessionType}
                            onValueChange={(value: string) => handleInputChange("sessionType", value)}
                          >
                            <SelectTrigger
                              className={`bg-input border-border focus:ring-ring ${
                                errors.sessionType ? "border-destructive" : ""
                              }`}
                            >
                              <SelectValue placeholder="Choose session type..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="virtual">
                                <div className="flex items-center gap-2">
                                  <Video className="h-4 w-4" />
                                  <div>
                                    <div className="font-medium">Virtual Session</div>
                                    <div className="text-xs text-muted-foreground">Online video call</div>
                                  </div>
                                </div>
                              </SelectItem>
                              <SelectItem value="in-person">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <div>
                                    <div className="font-medium">In-Person Session</div>
                                    <div className="text-xs text-muted-foreground">Face-to-face meeting</div>
                                  </div>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.sessionType && <p className="text-sm text-destructive">{errors.sessionType}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="date" className="text-sm font-medium text-card-foreground">
                            Preferred Date *
                          </Label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("date", e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className={`bg-input border-border focus:ring-ring ${errors.date ? "border-destructive" : ""}`}
                          />
                          {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="time" className="text-sm font-medium text-card-foreground">
                            Preferred Time *
                          </Label>
                          <Select value={formData.time} onValueChange={(value: string) => handleInputChange("time", value)}>
                            <SelectTrigger
                              className={`bg-input border-border focus:ring-ring ${errors.time ? "border-destructive" : ""}`}
                            >
                              <SelectValue placeholder="Select time..." />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    {time}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.time && <p className="text-sm text-destructive">{errors.time}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
                        <div className="flex items-start space-x-4">
                          <Checkbox
                            id="share-chat"
                            checked={formData.shareChatSummary}
                            onCheckedChange={(checked: boolean) => handleInputChange("shareChatSummary", checked as boolean)}
                            className="mt-1"
                          />
                          <div className="space-y-2">
                            <Label
                              htmlFor="share-chat"
                              className="text-sm font-medium text-card-foreground cursor-pointer"
                            >
                              Share my chatbot conversation summary with my therapist
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              If you've used our AI chatbot, sharing the conversation summary can help your therapist
                              understand your concerns better and prepare for your session.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="notes" className="text-sm font-medium text-card-foreground">
                        Additional Notes (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Share any specific concerns or preferences..."
                        value={formData.notes}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("notes", e.target.value)}
                        className="bg-input border-border focus:ring-ring min-h-[100px] resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        This information helps us prepare for your session
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-8">
                    <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Submitting...
                        </div>
                      ) : (
                        "Continue to Intake Form"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
