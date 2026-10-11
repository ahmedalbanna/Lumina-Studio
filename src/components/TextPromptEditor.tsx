import React, { useState } from 'react';
import { Sparkles, Wand2, History, RotateCcw, Send } from 'lucide-react';
import { EDIT_SUGGESTIONS } from '../data/presets';

interface TextPromptEditorProps {
  onApplyEdit: (editPrompt: string) => Promise<void>;
  isEditing: boolean;
  versionCount: number;
  onResetToOriginal?: () => void;
}

export const TextPromptEditor: React.FC<TextPromptEditorProps> = ({
  onApplyEdit,
  isEditing,
  versionCount,
  onResetToOriginal,
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isEditing) return;
    await onApplyEdit(prompt);
    setPrompt('');
  };

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 space-y-3 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
            <Wand2 className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Refine & Edit with Text Prompts</h4>
            <p className="text-[11px] text-slate-400">
              Powered by <span className="text-amber-300 font-mono">gemini-nano-banana-2.1</span> image-to-image editing
            </p>
          </div>
        </div>

        {versionCount > 1 && (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <History className="h-3 w-3" />
              v{versionCount}
            </span>
            {onResetToOriginal && (
              <button
                type="button"
                onClick={onResetToOriginal}
                className="flex items-center gap-1 rounded bg-white/5 hover:bg-white/10 px-2 py-1 text-[10px] text-slate-300 transition"
              >
                <RotateCcw className="h-2.5 w-2.5" />
                Original
              </button>
            )}
          </div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g., "Add classic black frame glasses" or "Change suit to tailored navy"'
          disabled={isEditing}
          className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-4 py-2.5 pr-24 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!prompt.trim() || isEditing}
          className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-3 text-xs font-semibold text-slate-950 shadow transition disabled:opacity-40 disabled:hover:bg-amber-500"
        >
          {isEditing ? (
            <>
              <Sparkles className="h-3 w-3 animate-spin" />
              Editing...
            </>
          ) : (
            <>
              <Send className="h-3 w-3" />
              Apply Edit
            </>
          )}
        </button>
      </form>

      {/* Suggested Quick Prompts */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
          Try Quick Refinements:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {EDIT_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={isEditing}
              onClick={() => {
                setPrompt(suggestion);
              }}
              className="text-[11px] rounded-md border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1 text-slate-300 transition hover:border-amber-400/40 hover:text-amber-200"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
