import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  aspectRatioClass?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Original Selfie',
  afterLabel = 'AI Studio Headshot',
  className = '',
  aspectRatioClass = 'aspect-square',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div className={`relative select-none overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-2xl backdrop-blur-md ${className}`}>
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden cursor-ew-resize ${aspectRatioClass}`}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e.touches[0].clientX);
        }}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (Background layer) */}
        <img
          src={afterUrl}
          alt="Transformed headshot"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
        />

        {/* Before Image (Clipped layer) */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeUrl}
            alt="Original selfie"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full max-w-none object-cover object-center pointer-events-none"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              height: '100%',
            }}
          />
          {/* Subtle darkness tint on before photo to accentuate upgrade */}
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        </div>

        {/* Divider Line */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Handle knob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-950/90 text-white shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] text-white/70">◀</span>
              <span className="text-[10px] text-white/70">▶</span>
            </div>
          </div>
        </div>

        {/* Before Label Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur-md border border-white/10 shadow-lg">
          <ImageIcon className="h-3 w-3 text-amber-400" />
          <span>{beforeLabel}</span>
        </div>

        {/* After Label Badge */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-indigo-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-indigo-400/30 shadow-lg">
          <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
          <span>{afterLabel}</span>
        </div>

        {/* Drag Hint at bottom */}
        <div className="absolute bottom-3 inset-x-0 z-10 flex justify-center pointer-events-none">
          <span className="rounded-full bg-black/60 px-3 py-0.5 text-[11px] text-white/80 backdrop-blur-sm">
            Drag to compare
          </span>
        </div>
      </div>

      {/* Quick toggle presets */}
      <div className="flex items-center justify-between border-t border-white/10 bg-slate-950/70 px-4 py-2 text-xs">
        <button
          type="button"
          onClick={() => setSliderPosition(100)}
          className={`px-2.5 py-1 rounded-md transition ${sliderPosition > 80 ? 'bg-white/20 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
        >
          View Original Only
        </button>
        <button
          type="button"
          onClick={() => setSliderPosition(50)}
          className="px-2.5 py-1 rounded-md text-amber-400 hover:bg-amber-400/10 transition font-medium"
        >
          50 / 50 Split
        </button>
        <button
          type="button"
          onClick={() => setSliderPosition(0)}
          className={`px-2.5 py-1 rounded-md transition ${sliderPosition < 20 ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
        >
          View Studio Result
        </button>
      </div>
    </div>
  );
};
