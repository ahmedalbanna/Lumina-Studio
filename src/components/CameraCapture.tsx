import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      return;
    }

    let isMounted = true;
    navigator.mediaDevices
      ?.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
      })
      .then((mediaStream) => {
        if (!isMounted) return;
        setStream(mediaStream);
        setCameraError(null);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        console.warn('Camera error:', err);
        setCameraError('Camera access denied or unavailable. Please upload a photo instead.');
      });

    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          captureFrame();
          return null;
        }
        return prev - 1;
      });
    }, 700);
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    // Crop center square for headshot
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    // Flip horizontally for natural mirror selfie feel
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onCapture(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Snap Studio Selfie</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cameraError ? (
          <div className="py-12 text-center text-sm text-red-400 bg-red-950/20 border border-red-500/20 rounded-xl p-4">
            {cameraError}
          </div>
        ) : (
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black border border-white/10">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover scale-x-[-1]"
            />

            {/* Oval Face Guide Overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-3/4 w-3/5 rounded-[50%] border-2 border-dashed border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
            </div>

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                <span className="text-7xl font-extrabold text-amber-400 animate-ping">
                  {countdown}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Center face in frame. Natural lighting works best.
          </p>
          <button
            type="button"
            disabled={Boolean(cameraError) || countdown !== null}
            onClick={takeSnapshot}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-50"
          >
            {countdown !== null ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Smiling...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                Capture Selfie
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
