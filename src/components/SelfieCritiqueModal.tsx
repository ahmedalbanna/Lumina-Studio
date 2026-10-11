import React from 'react';
import { Sparkles, X, Lightbulb, CheckCircle2 } from 'lucide-react';

interface SelfieCritiqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: string | null;
  isLoading: boolean;
  onApplyStyle?: (styleId: string) => void;
}

export const SelfieCritiqueModal: React.FC<SelfieCritiqueModalProps> = ({
  isOpen,
  onClose,
  analysis,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Master Photographer Critique</h3>
              <p className="text-xs text-slate-400">Analyzed by Gemini 3.8 Flash</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
              <p className="text-sm text-slate-300">
                Evaluating lighting quality, catchlights, facial geometry & best matching studio styles...
              </p>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-950/70 p-4 border border-white/5 text-sm text-slate-200 leading-relaxed whitespace-pre-line font-mono text-xs">
                {analysis}
              </div>

              <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                <Lightbulb className="h-4 w-4 shrink-0" />
                <span>
                  Tip: Gemini Nano Banana 2.1 will preserve your authentic facial bone structure while generating the recommended studio lighting & backdrop!
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">
              No analysis available yet.
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-semibold text-white transition"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Got it, Let's Shoot
          </button>
        </div>
      </div>
    </div>
  );
};
