"use client"

import type React from "react"
import Image from "next/image"
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
  if (!session || (session.user as { role?: string })?.role !== "patient") {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">
                <Image className="h-12 w-12" src="/logo.png" alt="Logo" width={48} height={48} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MindBridge</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">AI Therapy Session</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Session Status */}
              <div className="hidden sm:flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${isSessionActive ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-gray-600 dark:text-gray-300">
                  {isSessionActive ? "Active" : "Paused"} • {formatDuration(sessionDuration)}
                </span>
              </div>
              
              <ThemeToggle />
              
              <Button
                variant={isSessionActive ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsSessionActive(!isSessionActive)}
                className={isSessionActive 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                }
              >
                {isSessionActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isSessionActive ? "Pause" : "Resume"}
              </Button>
            </div>
          </div>
          
          {/* Mobile Session Status */}
          <div className="sm:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${isSessionActive ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-gray-600 dark:text-gray-300">
                Session {isSessionActive ? "Active" : "Paused"} • Duration: {formatDuration(sessionDuration)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to your <span className="text-blue-600 dark:text-blue-400">AI Therapy Session</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Share your thoughts while our AI analyzes your emotions in real-time
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Video and Controls */}
          <div className="xl:col-span-1 space-y-6">
            {/* Video Interface */}
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Camera className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Video Feed
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">Real-time emotion detection from your camera</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300">
                  {isVideoEnabled ? (
                    <div className="text-center">
                      <Camera className="h-12 w-12 mx-auto mb-2 text-gray-500 dark:text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Camera feed would appear here</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <VideoOff className="h-12 w-12 mx-auto mb-2 text-gray-500 dark:text-gray-400" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Camera disabled</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <Switch id="video-enabled" checked={isVideoEnabled} onCheckedChange={setIsVideoEnabled} />
                    <Label htmlFor="video-enabled" className="text-sm text-gray-900 dark:text-white">
                      Enable Camera
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="audio-enabled" checked={isAudioEnabled} onCheckedChange={setIsAudioEnabled} />
                    <Label htmlFor="audio-enabled" className="text-sm text-gray-900 dark:text-white">
                      Enable Microphone
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Emotion Display */}
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Activity className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
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
                      <div className="flex justify-between text-sm text-gray-900 dark:text-white">
                        <span>Confidence</span>
                        <span>{Math.round(currentEmotionData.confidence * 100)}%</span>
                      </div>
                      <Progress value={currentEmotionData.confidence * 100} className="h-3 bg-gray-200 dark:bg-gray-700" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Session Statistics */}
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <BarChart3 className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                  Session Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{formatDuration(sessionDuration)}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">Duration</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{messageCount}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">Messages</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{emotionHistory.length}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">Emotions</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{session?.user?.email?.split("@")[0]}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">Patient</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Chat Interface */}
          <div className="xl:col-span-2">
            <Card className="h-[700px] bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Brain className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  AI Therapist Chat
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">Share your thoughts and feelings with our AI therapist</CardDescription>
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
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <User className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  AI Therapist
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">Visual and audio responses from your AI therapist</CardDescription>
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
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Settings className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Avatar Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <Label htmlFor="enable-tts" className="text-sm text-gray-900 dark:text-white">
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
                    <Video className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <Label htmlFor="enable-avatar" className="text-sm text-gray-900 dark:text-white">
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
            <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-lg transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-base text-gray-900 dark:text-white">
                  <AlertCircle className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                  How to Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span>Enable your camera for emotion detection</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span>Share your thoughts in the chat interface</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span>AI responds based on your emotions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span>Enable avatar for video responses</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span>Monitor your emotional state in real-time</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg transition-colors duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-base text-gray-900 dark:text-white">
                  <Settings className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleSaveSession} 
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Session
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExportData} 
                  className="w-full justify-start bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleNewSession} 
                  className="w-full justify-start bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  New Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Session Info Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Session started at {sessionStartTime.toLocaleTimeString()} • 
            Real-time emotion detection powered by AI
          </p>
        </div>
      </div>
    </div>
  )
}

export default TherapySession
