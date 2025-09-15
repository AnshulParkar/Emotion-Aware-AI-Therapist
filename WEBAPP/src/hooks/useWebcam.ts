import { useRef, useCallback, useEffect, useState } from 'react';

interface UseWebcamOptions {
  width?: number;
  height?: number;
  facingMode?: 'user' | 'environment';
}

export const useWebcam = (options: UseWebcamOptions = {}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { width = 640, height = 480, facingMode = 'user' } = options;

  const startWebcam = useCallback(async () => {
    try {
      setError(null);
      const constraints = {
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode,
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsActive(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start webcam');
      setIsActive(false);
    }
  }, [width, height, facingMode]);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !isActive) return null;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    return canvas.toDataURL('image/jpeg', 0.8);
  }, [isActive]);

  const captureImageBase64 = useCallback((): string | null => {
    const dataUrl = captureImage();
    return dataUrl ? dataUrl.split(',')[1] : null;
  }, [captureImage]);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  return {
    videoRef,
    isActive,
    error,
    startWebcam,
    stopWebcam,
    captureImage,
    captureImageBase64,
  };
};
