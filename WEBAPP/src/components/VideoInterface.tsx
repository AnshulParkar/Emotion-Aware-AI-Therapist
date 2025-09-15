'use client';

import React, { useEffect, useState } from 'react';
import { useWebcam } from '../hooks/useWebcam';
import { useEmotionDetection } from '../hooks/useEmotionDetection';

// Simple icon components to replace lucide-react
const CameraIcon = () => <span className="text-xl">📷</span>;
const CameraOffIcon = () => <span className="text-xl">📷</span>;
const LoaderIcon = () => <span className="animate-spin text-xl">⟳</span>;
const AlertIcon = () => <span className="text-xl">⚠️</span>;

interface VideoInterfaceProps {
  onEmotionDetected?: (emotion: string, confidence: number) => void;
  className?: string;
}

const VideoInterface: React.FC<VideoInterfaceProps> = ({
  onEmotionDetected,
  className = '',
}) => {
  const [showEmotionOverlay, setShowEmotionOverlay] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    videoRef,
    isActive,
    error: webcamError,
    startWebcam,
    stopWebcam,
    captureImageBase64,
  } = useWebcam({ width: 640, height: 480 });

  const {
    isDetecting,
    currentEmotion,
    error: emotionError,
    startDetection,
    stopDetection,
  } = useEmotionDetection(captureImageBase64, {
    interval: 3000, // Detect every 3 seconds
    minConfidence: 0.4,
  });

  // Notify parent component when emotion is detected
  useEffect(() => {
    if (currentEmotion && onEmotionDetected) {
      onEmotionDetected(currentEmotion.emotion, currentEmotion.confidence);
    }
  }, [currentEmotion, onEmotionDetected]);

  // Handle camera start/stop
  const handleToggleCamera = async () => {
    setIsLoading(true);
    try {
      if (isActive) {
        stopWebcam();
        stopDetection();
      } else {
        await startWebcam();
        startDetection();
      }
    } catch (error) {
      console.error('Error toggling camera:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for emotion display
  const getEmotionColor = (emotion: string): string => {
    const colors = {
      happy: 'bg-green-100 text-green-800',
      sad: 'bg-blue-100 text-blue-800',
      angry: 'bg-red-100 text-red-800',
      surprised: 'bg-yellow-100 text-yellow-800',
      fear: 'bg-purple-100 text-purple-800',
      disgust: 'bg-gray-100 text-gray-800',
      neutral: 'bg-gray-100 text-gray-800',
    };
    return colors[emotion as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatConfidence = (confidence: number): string => {
    return `${Math.round(confidence * 100)}%`;
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Video Container */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        {isActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover video-fixed-size"
          />
        ) : (
          <div 
            className="flex items-center justify-center bg-gray-800 text-white"
            style={{ width: '640px', height: '480px' }}
          >
            <div className="flex flex-col items-center justify-center text-gray-500">
              <CameraOffIcon />
              <p className="mt-4">Camera not active</p>
            </div>
          </div>
        )}

        {/* Emotion Overlay */}
        {isActive && showEmotionOverlay && currentEmotion && (
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className={`px-3 py-2 rounded-lg font-medium ${getEmotionColor(currentEmotion.emotion)}`}>
              <span className="capitalize">{currentEmotion.emotion}</span>
              <span className="ml-2 text-sm opacity-75">
                {formatConfidence(currentEmotion.confidence)}
              </span>
            </div>
            
            {isDetecting && (
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2">
                <LoaderIcon />
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {(webcamError || emotionError) && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
              <AlertIcon />
              <span className="text-sm ml-2">
                {webcamError || emotionError}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={handleToggleCamera}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 transition-colors"
        >
          {isLoading ? (
            <>
              <LoaderIcon />
              <span>Loading...</span>
            </>
          ) : isActive ? (
            <>
              <CameraOffIcon />
              <span>Stop Camera</span>
            </>
          ) : (
            <>
              <CameraIcon />
              <span>Start Camera</span>
            </>
          )}
        </button>

        <button
          onClick={() => setShowEmotionOverlay(!showEmotionOverlay)}
          className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
          disabled={!isActive}
        >
          {showEmotionOverlay ? 'Hide Emotions' : 'Show Emotions'}
        </button>
      </div>

      {/* Emotion Statistics */}
      {currentEmotion && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg w-full max-w-2xl">
          <h3 className="text-lg font-semibold mb-3">Current Emotion Analysis</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(currentEmotion.emotions).map(([emotion, confidence]) => (
              <div
                key={emotion}
                className="bg-white p-3 rounded-lg border flex flex-col items-center"
              >
                <span className="capitalize font-medium text-sm">{emotion}</span>
                <span className="text-xs text-gray-600 mt-1">
                  {formatConfidence(confidence)}
                </span>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${confidence * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoInterface;
