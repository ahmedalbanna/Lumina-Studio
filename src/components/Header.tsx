import React from 'react';
import { Camera, Sparkles, Layers, Sliders } from 'lucide-react';

interface HeaderProps {
  onShowShowcase: () => void;
  onNewHeadshot: () => void;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onShowShowcase,
  onNewHeadshot,
  hasResult,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-slate-950 shadow-lg shadow-amber-500/20">
            <Camera className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white">
                Lumina<span className="text-amber-400">Studio</span>
              </span>
              <span className="hidden sm:inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono text-amber-300 border border-white/10">
                AI Headshots
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block">
              Executive portrait photography powered by Gemini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onShowShowcase}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Before/After</span> Showcase
          </button>

          {hasResult && (
            <button
              type="button"
              onClick={onNewHeadshot}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              New Shoot
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Studio Engine Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
};
