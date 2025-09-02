'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AvatarDisplayProps {
  avatarUrl?: string;
  audioUrl?: string;
  isGenerating?: boolean;
  className?: string;
}

const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatarUrl,
  audioUrl,
  isGenerating = false,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleVideoPlay = () => {
    setIsPlaying(true);
    setError(null);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const handleVideoError = () => {
    setError('Failed to load avatar video');
    setIsPlaying(false);
  };

  const handlePlayAvatar = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  // Auto-play when new content is available
  useEffect(() => {
    if (avatarUrl && !isGenerating) {
      // Small delay to ensure video is loaded
      const timer = setTimeout(() => {
        handlePlayAvatar();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [avatarUrl, isGenerating]);

  return (
    <div className={`relative ${className}`}>
      <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video">
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
            <div className="text-center text-gray-300">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg font-medium">Generating Avatar Response...</p>
              <p className="text-sm text-gray-400 mt-2">
                Creating personalized video response
              </p>
            </div>
          </div>
        )}

        {avatarUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            onPlay={handleVideoPlay}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            playsInline
            muted={!!audioUrl} // Mute video if we have separate audio
          >
            <source src={avatarUrl} type="video/mp4" />
            Your browser does not support the video element.
          </video>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-xl font-medium">AI Therapist Avatar</p>
              <p className="text-sm text-gray-300 mt-2">
                Your personalized therapy assistant
              </p>
            </div>
          </div>
        )}

        {/* Audio Element (hidden) */}
        {audioUrl && (
          <audio
            ref={audioRef}
            className="hidden"
            onEnded={handleVideoEnded}
          >
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
        )}

        {/* Play Status Indicator */}
        {isPlaying && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></div>
            SPEAKING
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center mt-4 space-x-3">
        <button
          onClick={handlePlayAvatar}
          disabled={!avatarUrl || isGenerating}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isPlaying ? 'Playing...' : 'Replay'}
        </button>
        
        {audioUrl && (
          <button
            onClick={() => {
              if (audioRef.current) {
                if (audioRef.current.paused) {
                  audioRef.current.play();
                } else {
                  audioRef.current.pause();
                }
              }
            }}
            disabled={isGenerating}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Audio Only
          </button>
        )}
      </div>

      {/* Avatar Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-1">Therapist Avatar</p>
        <p>
          Status: {isGenerating ? 'Generating response...' : isPlaying ? 'Speaking' : 'Ready'}
        </p>
        {avatarUrl && (
          <p className="text-xs mt-1 text-gray-500">
            Video response available • Click replay to view again
          </p>
        )}
      </div>
    </div>
  );
};

export default AvatarDisplay;
