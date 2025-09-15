"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Switch } from "../../../components/ui/switch"
import { Label } from "../../../components/ui/label"
import { Progress } from "../../../components/ui/progress"
import {
  Brain,
  Camera,
  Video,
  VideoOff,
  Save,
  Download,
  RotateCcw,
  Activity,
  Clock,
  User,
  Settings,
  Volume2,
  Pause,
  Play,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  MessageSquare,
} from "lucide-react"
import ChatInterface from "../../../components/ChatInterface"
import AvatarDisplay from "../../../components/AvatarDisplay"
import ThemeToggle from "../../../components/ThemeToggle"

interface EmotionData {
  emotion: string
  confidence: number
  emotions: Record<string, number>
  timestamp: number
}

const TherapySession: React.FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session || (session.user as any)?.role !== "patient") {
      router.replace("/auth/signin")
    }
  }, [session, status, router])

  const [currentEmotion, setCurrentEmotion] = useState<string>("neutral")
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([])
  const [currentEmotionData, setCurrentEmotionData] = useState<EmotionData | null>(null)
  const [sessionStartTime] = useState(new Date())
  const [sessionDuration, setSessionDuration] = useState(0)
  const [messageCount, setMessageCount] = useState(0)

  // Session controls
  const [isSessionActive, setIsSessionActive] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [avatarSettings, setAvatarSettings] = useState({
    enableTTS: false,
    enableAvatar: false,
  })

  // Avatar state
  const [latestAvatarUrl, setLatestAvatarUrl] = useState<string | undefined>()
  const [latestAudioUrl, setLatestAudioUrl] = useState<string | undefined>()
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false)

  // Session timer
  useEffect(() => {
    if (!isSessionActive) return

    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [isSessionActive, sessionStartTime])

  const handleEmotionDetected = (emotion: string, confidence: number) => {
    setCurrentEmotion(emotion)
  }

  const handleEmotionDataUpdate = (emotionData: EmotionData) => {
    setCurrentEmotionData(emotionData)
    setEmotionHistory((prev) => [...prev.slice(-49), emotionData])
  }

  const handleNewAvatarResponse = (avatarUrl?: string, audioUrl?: string) => {
    if (avatarUrl) {
      setLatestAvatarUrl(avatarUrl)
    }
    if (audioUrl) {
      setLatestAudioUrl(audioUrl)
    }
    setIsGeneratingAvatar(false)
  }

  const handleAvatarGenerationStart = () => {
    setIsGeneratingAvatar(true)
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      sad: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      angry: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      fearful: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      surprised: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      disgusted: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      neutral: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      anxious: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    }
    return colors[emotion.toLowerCase()] || colors.neutral
  }

  const handleSaveSession = () => {
    // Implementation for saving session
    console.log("Saving session...")
  }

  const handleExportData = () => {
    // Implementation for exporting data
    console.log("Exporting session data...")
  }

  const handleNewSession = () => {
    // Implementation for starting new session
    setEmotionHistory([])
    setMessageCount(0)
    setCurrentEmotion("neutral")
    console.log("Starting new session...")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Therapy Session</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Emotion-Aware Therapy</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Session Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isSessionActive ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm text-muted-foreground">
                  {isSessionActive ? "Active" : "Paused"} • {formatDuration(sessionDuration)}
                </span>
              </div>
              <ThemeToggle />
              <Button
                variant={isSessionActive ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsSessionActive(!isSessionActive)}
              >
                {isSessionActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isSessionActive ? "Pause" : "Resume"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Video and Controls */}
          <div className="xl:col-span-1 space-y-6">
            {/* Video Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Video Feed
                </CardTitle>
                <CardDescription>Real-time emotion detection from your camera</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  {isVideoEnabled ? (
                    <div className="text-center">
                      <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Camera feed would appear here</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <VideoOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Camera disabled</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch id="video-enabled" checked={isVideoEnabled} onCheckedChange={setIsVideoEnabled} />
                    <Label htmlFor="video-enabled" className="text-sm">
                      Enable Camera
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="audio-enabled" checked={isAudioEnabled} onCheckedChange={setIsAudioEnabled} />
                    <Label htmlFor="audio-enabled" className="text-sm">
                      Enable Microphone
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Emotion Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Current Emotion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <Badge className={`text-lg px-4 py-2 ${getEmotionColor(currentEmotion)}`}>
                    {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
                  </Badge>
                  {currentEmotionData && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Confidence</span>
                        <span>{Math.round(currentEmotionData.confidence * 100)}%</span>
                      </div>
                      <Progress value={currentEmotionData.confidence * 100} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Session Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Session Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{formatDuration(sessionDuration)}</div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{messageCount}</div>
                      <div className="text-xs text-muted-foreground">Messages</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{emotionHistory.length}</div>
                      <div className="text-xs text-muted-foreground">Emotions</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{session?.user?.email?.split("@")[0]}</div>
                      <div className="text-xs text-muted-foreground">Patient</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Chat Interface */}
          <div className="xl:col-span-2">
            <Card className="h-[700px]">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  AI Therapist Chat
                </CardTitle>
                <CardDescription>Share your thoughts and feelings with our AI therapist</CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-5rem)] p-0">
                <ChatInterface
                  currentEmotion={currentEmotion}
                  enableTTS={avatarSettings.enableTTS}
                  enableAvatar={avatarSettings.enableAvatar}
                  onAvatarResponse={handleNewAvatarResponse}
                  onAvatarGenerationStart={handleAvatarGenerationStart}
                  className="h-full rounded-none border-0"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Avatar and Settings */}
          <div className="xl:col-span-1 space-y-6">
            {/* Avatar Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  AI Therapist
                </CardTitle>
                <CardDescription>Visual and audio responses from your AI therapist</CardDescription>
              </CardHeader>
              <CardContent>
                <AvatarDisplay
                  avatarUrl={latestAvatarUrl}
                  audioUrl={latestAudioUrl}
                  isGenerating={isGeneratingAvatar}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Avatar Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Avatar Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="enable-tts" className="text-sm">
                      Text-to-Speech
                    </Label>
                  </div>
                  <Switch
                    id="enable-tts"
                    checked={avatarSettings.enableTTS}
                    onCheckedChange={(checked) => setAvatarSettings((prev) => ({ ...prev, enableTTS: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="enable-avatar" className="text-sm">
                      Avatar Video
                    </Label>
                  </div>
                  <Switch
                    id="enable-avatar"
                    checked={avatarSettings.enableAvatar}
                    onCheckedChange={(checked) => setAvatarSettings((prev) => ({ ...prev, enableAvatar: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  How to Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Enable your camera for emotion detection</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Share your thoughts in the chat interface</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                    <span>AI responds based on your emotions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Enable avatar for video responses</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Monitor your emotional state in real-time</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Session Controls */}
        {/* <Card className="mt-8">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button onClick={handleSaveSession} className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Save Session
                </Button>
                <Button variant="outline" onClick={handleExportData} className="flex items-center bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                <Button variant="outline" onClick={handleNewSession} className="flex items-center bg-transparent">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  New Session
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Session started at {sessionStartTime.toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card> */}
      </main>
    </div>
  )
}

export default TherapySession
