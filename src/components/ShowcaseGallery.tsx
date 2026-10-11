import React, { useState } from 'react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { ASSET_PATHS } from '../data/presets';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface ShowcaseGalleryProps {
  onSelectSample: (styleId: string) => void;
}

export const ShowcaseGallery: React.FC<ShowcaseGalleryProps> = ({
  onSelectSample,
}) => {
  const [activeShowcase, setActiveShowcase] = useState<'corporate' | 'tech' | 'outdoor'>('corporate');

  const items = [
    {
      id: 'corporate' as const,
      styleId: 'corporate-grey',
      title: 'Corporate Grey Backdrop',
      badge: 'Executive Standard',
      description: 'Casual couch selfie transformed into a Wall Street & Fortune 500 studio headshot with charcoal tailored blazer and 85mm portrait key light.',
      beforeUrl: ASSET_PATHS.sampleSelfie,
      afterUrl: ASSET_PATHS.corporateGrey,
    },
    {
      id: 'tech' as const,
      styleId: 'modern-tech',
      title: 'Modern Tech Office',
      badge: 'Silicon Valley Favorite',
      description: 'Everyday smartphone photo converted into an approachable tech leader portrait in a sunlit architectural glass atrium with soft bokeh.',
      beforeUrl: ASSET_PATHS.sampleSelfie,
      afterUrl: ASSET_PATHS.techOffice,
    },
    {
      id: 'outdoor' as const,
      styleId: 'outdoor-natural',
      title: 'Outdoor Natural Light',
      badge: 'Warm & Authentic',
      description: 'Transformed into a radiant golden hour portrait with creamy botanical bokeh, crisp catchlights, and friendly executive presence.',
      beforeUrl: ASSET_PATHS.sampleSelfie,
      afterUrl: ASSET_PATHS.outdoorLight,
    },
  ];

  const current = items.find((i) => i.id === activeShowcase) || items[0];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur-md space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              <Sparkles className="h-3 w-3" /> Live Transformation Showcase
            </span>
          </div>
          <h3 className="mt-1.5 text-xl font-bold text-white tracking-tight">
            See the Quality: Casual Selfie vs AI Studio Headshot
          </h3>
          <p className="text-xs text-slate-400">
            Drag the slider to inspect facial likeness preservation, realistic skin texture, and studio lighting precision.
          </p>
        </div>

        {/* Style switcher buttons */}
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveShowcase(item.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition border ${
                activeShowcase === item.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 border-white/10 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Slider visual */}
        <div className="lg:col-span-7">
          <BeforeAfterSlider
            key={current.id}
            beforeUrl={current.beforeUrl}
            afterUrl={current.afterUrl}
            beforeLabel="Casual Selfie"
            afterLabel={`Studio Headshot (${current.title})`}
            aspectRatioClass="aspect-square max-h-[480px]"
          />
        </div>

        {/* Description & Action */}
        <div className="lg:col-span-5 space-y-4 text-left">
          <div className="inline-block rounded-md bg-white/10 px-2.5 py-1 text-xs font-mono text-amber-300 border border-white/10">
            {current.badge}
          </div>
          <h4 className="text-xl font-bold text-white">
            {current.title}
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            {current.description}
          </p>

          <div className="space-y-2 rounded-xl bg-slate-950/60 p-4 border border-white/5 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Identity preserved with Gemini Multimodal Image Synthesis</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>High resolution 1K/2K output with realistic pore & fabric details</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Full prompt-driven refinement & wardrobe replacement</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectSample(current.styleId)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition group"
          >
            <span>Try With This Sample Selfie ({current.title})</span>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
