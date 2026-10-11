import React, { useState } from 'react';
import { X, Check, Award, FileText, Download } from 'lucide-react';

interface MockupPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export const MockupPreviewModal: React.FC<MockupPreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'resume' | 'badge'>('linkedin');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Real-World Mockup Previews</h3>
            <p className="text-xs text-slate-400">See how your AI studio headshot looks in executive contexts</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10 py-3">
          <button
            type="button"
            onClick={() => setActiveTab('linkedin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'linkedin'
                ? 'bg-[#0077b5] text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            LinkedIn Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'resume'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Executive Resume
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('badge')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'badge'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            Keynote Speaker Badge
          </button>
        </div>

        {/* Content Area */}
        <div className="py-6 flex items-center justify-center min-h-[340px]">
          {/* LinkedIn Mockup */}
          {activeTab === 'linkedin' && (
            <div className="w-full max-w-md rounded-xl overflow-hidden border border-white/15 bg-[#1b1f24] shadow-xl text-left">
              {/* Banner */}
              <div className="h-24 w-full bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
              </div>
              {/* Avatar & Info */}
              <div className="px-5 pb-5 pt-0 relative">
                <div className="-mt-14 inline-block relative">
                  <div className="h-24 w-24 rounded-full border-4 border-[#1b1f24] overflow-hidden bg-slate-950 shadow-lg">
                    <img
                      src={imageUrl}
                      alt="LinkedIn Avatar"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-[#1b1f24]" />
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">Alex Morgan</h4>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-mono">1st</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    VP of Product & Engineering • Keynote Speaker • Angel Investor
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Greater San Francisco Area • <span className="text-blue-400 font-semibold cursor-pointer">500+ connections</span>
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="px-4 py-1 rounded-full bg-blue-500 text-xs font-semibold text-white">Open to</span>
                  <span className="px-4 py-1 rounded-full border border-slate-600 text-xs font-semibold text-slate-200">More</span>
                </div>
              </div>
            </div>
          )}

          {/* Resume Mockup */}
          {activeTab === 'resume' && (
            <div className="w-full max-w-md rounded-xl border border-white/20 bg-white p-5 text-slate-900 shadow-2xl text-left">
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div className="space-y-1">
                  <h4 className="text-lg font-bold tracking-tight text-slate-950">ALEX MORGAN</h4>
                  <p className="text-xs font-semibold text-amber-700 tracking-wider uppercase">Senior Technology Director</p>
                  <p className="text-[10px] text-slate-500">alex.morgan@executive.io • +1 (415) 555-0192 • San Francisco, CA</p>
                </div>
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-slate-300 shadow-md">
                  <img
                    src={imageUrl}
                    alt="Resume Headshot"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Executive Summary</h5>
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  Visionary technology leader with 12+ years spearheading AI platforms, enterprise architecture, and cross-functional engineering teams at scale.
                </p>
              </div>
            </div>
          )}

          {/* Keynote Badge Mockup */}
          {activeTab === 'badge' && (
            <div className="w-64 rounded-2xl border-4 border-slate-700 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 p-4 text-center shadow-2xl relative text-white">
              {/* Lanyard Hole */}
              <div className="mx-auto -mt-6 mb-3 h-3 w-10 rounded-full bg-slate-800 border border-slate-600" />
              <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Global AI Summit 2026</div>
              <div className="my-3 mx-auto h-28 w-28 overflow-hidden rounded-xl border-2 border-amber-400/80 shadow-lg">
                <img
                  src={imageUrl}
                  alt="Speaker Headshot"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <h4 className="text-base font-bold text-white">Alex Morgan</h4>
              <p className="text-xs text-slate-300">Keynote Speaker</p>
              <div className="mt-4 rounded-lg bg-amber-400 py-1 text-xs font-black tracking-wider text-slate-950">
                VIP ALL-ACCESS
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
          <span>High quality 85mm portrait ratio suitable for print & digital.</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-white/10 px-4 py-1.5 text-white hover:bg-white/20 transition"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
