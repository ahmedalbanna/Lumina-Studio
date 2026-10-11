import React from 'react';
import { HeadshotStyle } from '../types';
import { HEADSHOT_STYLES } from '../data/presets';
import { Check, Camera, Sparkles } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyleId: string;
  onSelectStyle: (styleId: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyleId,
  onSelectStyle,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Camera className="h-4 w-4 text-amber-400" />
            Select Backdrop & Studio Style
          </h3>
          <p className="text-xs text-slate-400">
            Choose your preferred background environment, studio lighting, and aesthetic tone.
          </p>
        </div>
        <span className="text-xs text-amber-400/90 font-medium px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          8 Studio Presets
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {HEADSHOT_STYLES.map((style: HeadshotStyle) => {
          const isSelected = selectedStyleId === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`group relative text-left rounded-xl overflow-hidden transition-all duration-200 border ${
                isSelected
                  ? 'border-amber-400/90 ring-2 ring-amber-400/30 bg-slate-850 shadow-lg shadow-amber-500/10'
                  : 'border-white/10 hover:border-white/25 bg-slate-900/60 hover:bg-slate-850'
              }`}
            >
              {/* Thumbnail image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={style.imageThumbnail}
                  alt={style.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Category badge */}
                <span className="absolute top-2 left-2 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-white/10">
                  {style.category}
                </span>

                {/* Selected Checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-md">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-3.5 space-y-1.5">
                <div className="flex items-start justify-between gap-1">
                  <h4 className={`text-sm font-semibold transition ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                    {style.name}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {style.description}
                </p>

                {/* Tags */}
                <div className="pt-1 flex flex-wrap gap-1">
                  {style.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                  {isSelected && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium flex items-center gap-0.5">
                      <Sparkles className="h-2.5 w-2.5" /> Selected
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
