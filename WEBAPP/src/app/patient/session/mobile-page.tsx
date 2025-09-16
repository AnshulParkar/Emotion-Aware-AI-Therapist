"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Camera,
  VideoOff,
  Save,
  Download,
  RotateCcw,
  Activity,
  Clock,
  User,
  BarChart3,
  MessageSquare,
  Volume2,
  Video,
  Pause,
  Play,
} from "lucide-react"
import ChatInterface from "../../../components/ChatInterface"
import AvatarDisplay from "../../../components/AvatarDisplay"
import ThemeToggle from "../../../components/ThemeToggle"

const MobileTherapySession: React.FC = () => {
  const [isSessionActive, setIsSessionActive] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [currentEmotion] = useState("neutral")
  const [sessionDuration] = useState(0)
  const [messageCount] = useState(0)
  const [avatarSettings, setAvatarSettings] = useState({
    enableTTS: false,
    enableAvatar: false,
  })

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const getEmotionColor = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case "happy":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "sad":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Brain className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Therapy Session</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">AI-Powered Therapy</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant={isSessionActive ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsSessionActive(!isSessionActive)}
                className="px-2"
              >
                {isSessionActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Video Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Camera className="mr-2 h-5 w-5" />
              Video Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              {isVideoEnabled ? (
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Camera active</p>
                </div>
              ) : (
                <div className="text-center">
                  <VideoOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Camera off</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center space-x-6">
              <div className="flex flex-col items-center space-y-2">
                <Switch checked={isVideoEnabled} onCheckedChange={setIsVideoEnabled} />
                <Label className="text-xs">Camera</Label>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Switch checked={isAudioEnabled} onCheckedChange={setIsAudioEnabled} />
                <Label className="text-xs">Microphone</Label>
              </div>
            </div>

            <div className="text-center space-y-2 pt-4 border-t">
              <Badge className={`text-lg px-4 py-2 ${getEmotionColor(currentEmotion)}`}>
                {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Session Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BarChart3 className="mr-2 h-5 w-5" />
              Session Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center space-y-1 p-3 bg-muted rounded-lg">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div className="font-medium">{formatDuration(sessionDuration)}</div>
                <div className="text-xs text-muted-foreground">Duration</div>
              </div>
              <div className="flex flex-col items-center space-y-1 p-3 bg-muted rounded-lg">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div className="font-medium">{messageCount}</div>
                <div className="text-xs text-muted-foreground">Messages</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Brain className="mr-2 h-5 w-5" />
              AI Therapist Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[450px] p-4 bg-muted/50 rounded flex items-center justify-center">
              <p className="text-muted-foreground">Chat interface would be here</p>
            </div>
          </CardContent>
        </Card>

        {/* Avatar & Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <User className="mr-2 h-5 w-5" />
              AI Therapist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
              
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium">Settings</h4>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Text-to-Speech</Label>
                  <Switch
                    checked={avatarSettings.enableTTS}
                    onCheckedChange={(checked) => setAvatarSettings({ ...avatarSettings, enableTTS: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Avatar Responses</Label>
                  <Switch
                    checked={avatarSettings.enableAvatar}
                    onCheckedChange={(checked) => setAvatarSettings({ ...avatarSettings, enableAvatar: checked })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Controls */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  New
                </Button>
              </div>
              <div className="text-sm text-muted-foreground text-center">
                Started at {new Date().toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default MobileTherapySession