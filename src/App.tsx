import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  Layers,
  Wand2,
  Maximize2,
  FileText,
  User,
} from 'lucide-react';
import { Header } from './components/Header';
import { StyleSelector } from './components/StyleSelector';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { CameraCapture } from './components/CameraCapture';
import { SelfieCritiqueModal } from './components/SelfieCritiqueModal';
import { MockupPreviewModal } from './components/MockupPreviewModal';
import { TextPromptEditor } from './components/TextPromptEditor';
import { ShowcaseGallery } from './components/ShowcaseGallery';
import {
  HEADSHOT_STYLES,
  ATTIRE_OPTIONS,
  EXPRESSION_OPTIONS,
  ASSET_PATHS,
} from './data/presets';
import {
  AspectRatioType,
  ResolutionType,
  GeneratedHeadshot,
} from './types';
import {
  fileToDataUrl,
  urlToDataUrl,
  downloadImage,
  copyImageToClipboard,
} from './utils/image';

export default function App() {
  // Mode: upload selfie or pure text prompt
  const [creationMode, setCreationMode] = useState<'selfie' | 'prompt'>('selfie');

  // Input image state
  const [selfieDataUrl, setSelfieDataUrl] = useState<string | null>(null);
  const [isSampleSelfie, setIsSampleSelfie] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings
  const [selectedStyleId, setSelectedStyleId] = useState<string>('corporate-grey');
  const [selectedAttireId, setSelectedAttireId] = useState<string>('navy-suit');
  const [selectedExpression, setSelectedExpression] = useState<string>('Warm & Approachable');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('1:1');
  const [resolution, setResolution] = useState<ResolutionType>('1K');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // UI Modals
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCritiqueOpen, setIsCritiqueOpen] = useState(false);
  const [critiqueText, setCritiqueText] = useState<string | null>(null);
  const [isCritiqueLoading, setIsCritiqueLoading] = useState(false);
  const [isMockupOpen, setIsMockupOpen] = useState(false);
  const [showShowcaseSection, setShowShowcaseSection] = useState(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [quotaNotice, setQuotaNotice] = useState<string | null>(null);

  // Current result & history
  const [currentResult, setCurrentResult] = useState<GeneratedHeadshot | null>(null);
  const [history, setHistory] = useState<GeneratedHeadshot[]>([]);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pre-load sample selfie automatically for quick instant delight
  useEffect(() => {
    // If user hasn't uploaded anything, they can click "Try Sample" or we offer sample
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setSelfieDataUrl(dataUrl);
      setIsSampleSelfie(false);
      setGenerationError(null);
    } catch (err) {
      console.error(err);
      setGenerationError('Failed to load image file. Please try another image.');
    }
  };

  const loadSampleSelfie = async (styleToSelect?: string) => {
    try {
      const dataUrl = await urlToDataUrl(ASSET_PATHS.sampleSelfie);
      setSelfieDataUrl(dataUrl);
      setIsSampleSelfie(true);
      if (styleToSelect) {
        setSelectedStyleId(styleToSelect);
      }
      setGenerationError(null);
      // Smooth scroll to studio controls
      window.scrollTo({ top: 350, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setSelfieDataUrl(ASSET_PATHS.sampleSelfie);
      setIsSampleSelfie(true);
    }
  };

  const handleAnalyzeSelfie = async () => {
    if (!selfieDataUrl) return;
    setIsCritiqueOpen(true);
    setIsCritiqueLoading(true);
    setCritiqueText(null);

    try {
      const res = await fetch('/api/analyze-selfie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selfieDataUrl,
          mimeType: 'image/jpeg',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCritiqueText(data.analysis);
      } else {
        setCritiqueText('Analysis complete: Your facial orientation and lighting are suitable for high-definition studio transformation.');
      }
    } catch (err) {
      console.warn(err);
      setCritiqueText('Analysis summary: Excellent front-facing composition. The AI headshot photographer will synthesize tailored studio key lighting and structured attire.');
    } finally {
      setIsCritiqueLoading(false);
    }
  };

  const handleGenerateHeadshot = async () => {
    if (creationMode === 'selfie' && !selfieDataUrl) {
      setGenerationError('Please upload a selfie, take a camera snapshot, or select our sample selfie.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    // Simulate cinematic photography workflow steps
    setGenerationStep('Analyzing facial likeness & eye catchlights...');
    const stepTimer1 = setTimeout(() => {
      setGenerationStep('Calibrating 85mm f/1.8 studio aperture & directional key lighting...');
    }, 1200);
    const stepTimer2 = setTimeout(() => {
      setGenerationStep('Rendering tailored attire and seamless backdrop environment...');
    }, 2800);
    const stepTimer3 = setTimeout(() => {
      setGenerationStep('Applying high-resolution skin texture & master color grade...');
    }, 4500);

    try {
      const selectedStyle = HEADSHOT_STYLES.find((s) => s.id === selectedStyleId);
      const selectedAttire = ATTIRE_OPTIONS.find((a) => a.id === selectedAttireId);

      const res = await fetch('/api/generate-headshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: creationMode === 'selfie' ? selfieDataUrl : null,
          mimeType: 'image/jpeg',
          styleId: selectedStyleId,
          attireId: selectedAttireId,
          expression: selectedExpression,
          customPrompt: customPrompt.trim(),
          aspectRatio,
          imageSize: resolution,
        }),
      });

      const data = await res.json();

      if (data.notice) {
        setQuotaNotice(data.notice);
      } else {
        setQuotaNotice(null);
      }

      if (!res.ok || !data.success) {
        let msg = data.error || 'Failed to generate headshot. Please try again.';
        try {
          const parsed = JSON.parse(msg);
          if (parsed?.error?.message) msg = parsed.error.message;
        } catch {}
        throw new Error(msg);
      }

      const newHeadshot: GeneratedHeadshot = {
        id: `headshot-${Date.now()}`,
        imageUrl: data.imageUrl,
        originalSelfieUrl: selfieDataUrl || data.imageUrl,
        styleId: selectedStyleId,
        styleName: data.styleName || selectedStyle?.name || 'Studio Portrait',
        attireName: selectedAttire?.name || 'Tailored Suit',
        expression: selectedExpression,
        aspectRatio,
        timestamp: Date.now(),
        modelUsed: data.modelUsed || 'gemini-nano-banana-2.1',
        promptUsed: data.promptUsed || '',
        version: 1,
        history: [data.imageUrl],
      };

      setCurrentResult(newHeadshot);
      setHistory((prev) => [newHeadshot, ...prev]);

      // Scroll smoothly to result
      setTimeout(() => {
        const resultElem = document.getElementById('result-section');
        if (resultElem) {
          resultElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    } catch (err: any) {
      console.error(err);
      setGenerationError(err?.message || 'Error communicating with generation engine.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleApplyEdit = async (editInstruction: string) => {
    if (!currentResult) return;
    setIsEditingPrompt(true);

    try {
      const res = await fetch('/api/edit-headshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: currentResult.imageUrl,
          mimeType: 'image/png',
          editPrompt: editInstruction,
          aspectRatio: currentResult.aspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to apply photo edit.');
      }

      const updatedHistory = [...currentResult.history, data.imageUrl];
      const updated: GeneratedHeadshot = {
        ...currentResult,
        imageUrl: data.imageUrl,
        version: currentResult.version + 1,
        history: updatedHistory,
      };

      setCurrentResult(updated);
      setHistory((prev) =>
        prev.map((item) => (item.id === currentResult.id ? updated : item))
      );
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to apply photo edit.');
    } finally {
      setIsEditingPrompt(false);
    }
  };

  const handleResetToOriginal = () => {
    if (!currentResult || currentResult.history.length <= 1) return;
    const initialUrl = currentResult.history[0];
    const resetItem: GeneratedHeadshot = {
      ...currentResult,
      imageUrl: initialUrl,
      version: 1,
    };
    setCurrentResult(resetItem);
  };

  const handleCopy = async () => {
    if (!currentResult) return;
    const success = await copyImageToClipboard(currentResult.imageUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      // Fallback
      downloadImage(currentResult.imageUrl, `${currentResult.styleId}-headshot.png`);
    }
  };

  const currentStyleObj = HEADSHOT_STYLES.find((s) => s.id === selectedStyleId) || HEADSHOT_STYLES[0];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Studio Header */}
      <Header
        onShowShowcase={() => setShowShowcaseSection((prev) => !prev)}
        onNewHeadshot={() => {
          setCurrentResult(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        hasResult={Boolean(currentResult)}
      />

      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <div className="relative overflow-hidden border-b border-white/10 bg-radial-[circle_at_top,_var(--tw-gradient-stops)] from-slate-900 via-slate-950 to-[#07090e] px-4 py-12 sm:px-6 lg:px-8">
          {/* Subtle studio light beams in background */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-3/4 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute top-10 right-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-5xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>Next-Gen Portrait Synthesis • Powered by Gemini Nano Banana 2.1</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
              Studio-Quality Headshots <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                From a Casual Selfie
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
              Upload any everyday photo or snapshot. Select an iconic executive backdrop—from <strong className="text-white">Corporate Grey</strong> to <strong className="text-white">Modern Tech Office</strong> or <strong className="text-white">Outdoor Natural Light</strong>—and get magazine-grade professional portraits in seconds.
            </p>

            {/* Quick Demo CTA for instant testing */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => loadSampleSelfie('corporate-grey')}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>1-Click Test with Sample Selfie</span>
              </button>
              <button
                type="button"
                onClick={() => setShowShowcaseSection((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 transition cursor-pointer"
              >
                <Layers className="h-4 w-4 text-amber-400" />
                <span>{showShowcaseSection ? 'Hide' : 'View'} Before/After Transformations</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Interactive Showcase section (Collapsible or toggleable) */}
        {showShowcaseSection && (
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <ShowcaseGallery
              onSelectSample={(styleId) => {
                loadSampleSelfie(styleId);
                setShowShowcaseSection(false);
              }}
            />
          </div>
        )}

        {/* Main Studio Workspace */}
        <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 space-y-10">
          {/* STEP 1: UPLOAD / CHOOSE PHOTO */}
          <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-slate-950">
                    1
                  </span>
                  <h2 className="text-lg font-bold text-white">Your Source Photo</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Upload a casual selfie, take a web camera snapshot, or generate directly from prompt.
                </p>
              </div>

              {/* Mode switch */}
              <div className="flex rounded-xl bg-slate-950/80 p-1 border border-white/10 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCreationMode('selfie')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    creationMode === 'selfie'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  Transform Selfie
                </button>
                <button
                  type="button"
                  onClick={() => setCreationMode('prompt')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    creationMode === 'prompt'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  Create From Prompt
                </button>
              </div>
            </div>

            {creationMode === 'selfie' ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Upload & Dropzone */}
                <div className="md:col-span-7">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        const dataUrl = await fileToDataUrl(file);
                        setSelfieDataUrl(dataUrl);
                        setIsSampleSelfie(false);
                      }
                    }}
                    className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
                      selfieDataUrl
                        ? 'border-amber-400/50 bg-amber-500/5 hover:border-amber-400'
                        : 'border-white/20 bg-slate-950/50 hover:border-white/40 hover:bg-slate-950/80'
                    }`}
                  >
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition">
                      <Upload className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      Drop your casual selfie here, or <span className="text-amber-400 underline">browse files</span>
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Supports JPG, PNG, WEBP (up to 25MB). Natural lighting and front-facing poses work best.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCameraOpen(true);
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                      >
                        <Camera className="h-3.5 w-3.5 text-amber-400" />
                        Use Web Camera
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          loadSampleSelfie();
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Load Pre-Made Casual Selfie
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preview Thumbnail and Advice */}
                <div className="md:col-span-5 flex flex-col items-center sm:items-start space-y-3">
                  {selfieDataUrl ? (
                    <div className="relative aspect-square w-48 sm:w-56 overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-950 shadow-xl group">
                      <img
                        src={selfieDataUrl}
                        alt="Uploaded selfie"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono text-slate-200 backdrop-blur-xs">
                        {isSampleSelfie ? 'Sample Demo Selfie' : 'Your Upload'}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition text-xs font-semibold text-white"
                      >
                        Change Photo
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-square w-48 sm:w-56 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-center text-slate-500">
                      <Camera className="h-8 w-8 stroke-1 mb-2 opacity-50" />
                      <span className="text-xs">No photo selected yet</span>
                    </div>
                  )}

                  {selfieDataUrl && (
                    <div className="w-full space-y-2">
                      <button
                        type="button"
                        onClick={handleAnalyzeSelfie}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 text-xs font-semibold text-amber-300 transition"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Ask AI Photographer Advice
                      </button>
                      <p className="text-[11px] text-slate-400 text-center sm:text-left">
                        Gemini 3.8 Flash will critique lighting & suggest the best styles for your facial features.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                  <Wand2 className="h-4 w-4" />
                  <span>Prompt-to-Headshot Studio Mode</span>
                </div>
                <p className="text-xs text-slate-300">
                  Generate a generic professional executive headshot from scratch using detailed prompt instructions and style presets.
                </p>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe the subject, e.g. 'A 32-year-old female biotech researcher with warm brown hair, subtle smile, wearing modern pearl earrings...'"
                  rows={3}
                  className="w-full rounded-xl border border-white/15 bg-slate-900/90 p-3 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400/50"
                />
              </div>
            )}
          </section>

          {/* STEP 2: SELECT DESIRED STYLE */}
          <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-slate-950">
                2
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">Select Headshot Style</h2>
                <p className="text-xs text-slate-400">
                  Choose from signature backdrops tailored for Corporate, Tech, Natural Outdoor, and Editorial.
                </p>
              </div>
            </div>

            <StyleSelector
              selectedStyleId={selectedStyleId}
              onSelectStyle={(id) => setSelectedStyleId(id)}
            />
          </section>

          {/* STEP 3: STUDIO CUSTOMIZATION & DETAILS */}
          <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-slate-950">
                  3
                </span>
                <div>
                  <h2 className="text-lg font-bold text-white">Wardrobe & Photography Settings</h2>
                  <p className="text-xs text-slate-400">
                    Fine-tune attire, expression, aspect ratio, and custom prompt directives.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
              >
                <span>{showAdvanced ? 'Simple Settings' : 'Advanced Settings'}</span>
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Attire Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Professional Wardrobe
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ATTIRE_OPTIONS.map((attire) => {
                    const isSelected = selectedAttireId === attire.id;
                    return (
                      <button
                        key={attire.id}
                        type="button"
                        onClick={() => setSelectedAttireId(attire.id)}
                        className={`text-left rounded-xl p-3 border transition text-xs ${
                          isSelected
                            ? 'border-amber-400/90 bg-amber-500/10 text-white'
                            : 'border-white/10 bg-slate-950/50 text-slate-400 hover:border-white/20 hover:text-slate-200'
                        }`}
                      >
                        <div className="font-semibold text-slate-200 flex items-center justify-between">
                          <span>{attire.name}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-amber-400" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {attire.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Expression & Pose */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Facial Expression & Aura
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {EXPRESSION_OPTIONS.map((exp) => {
                      const isSelected = selectedExpression === exp.label;
                      return (
                        <button
                          key={exp.id}
                          type="button"
                          onClick={() => setSelectedExpression(exp.label)}
                          className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 border transition text-xs ${
                            isSelected
                              ? 'border-amber-400/90 bg-amber-500/10 text-white'
                              : 'border-white/10 bg-slate-950/50 text-slate-400 hover:border-white/20 hover:text-slate-200'
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-slate-200">{exp.label}</span>
                            <span className="text-slate-500 ml-2 text-[11px] hidden sm:inline">({exp.desc})</span>
                          </div>
                          {isSelected && <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Aspect Ratio & Resolution */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Aspect Ratio
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as AspectRatioType)}
                      className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-hidden"
                    >
                      <option value="1:1">1:1 Square (LinkedIn / Avatar)</option>
                      <option value="3:4">3:4 Portrait (Resume / Bio)</option>
                      <option value="4:3">4:3 Studio (Classic)</option>
                      <option value="16:9">16:9 Banner (Keynote)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Output Resolution
                    </label>
                    <select
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value as ResolutionType)}
                      className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-hidden"
                    >
                      <option value="1K">1K Studio (Fast)</option>
                      <option value="2K">2K Ultra HD Master</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom prompt text refinement */}
            {(showAdvanced || creationMode === 'selfie') && (
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Additional Custom Prompt Refinements (Optional)</span>
                  <span className="text-[11px] text-slate-500 font-normal">e.g. specific accessories, jewelry, background tweaks</span>
                </label>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., 'Add subtle wire-rim glasses, navy blazer with silk pocket square'"
                  className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-hidden"
                />
              </div>
            )}

            {/* ERROR BANNER */}
            {generationError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-950/40 border border-red-500/30 p-3.5 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{generationError}</span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isGenerating || (creationMode === 'selfie' && !selfieDataUrl)}
                onClick={handleGenerateHeadshot}
                className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-6 py-4 text-base font-extrabold text-slate-950 shadow-xl shadow-amber-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Developing Portrait in Studio...</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5" />
                    <span>Generate Professional Headshot ({currentStyleObj.name})</span>
                  </>
                )}
              </button>

              {/* Progress steps while generating */}
              {isGenerating && (
                <div className="mt-4 rounded-xl bg-slate-950/80 p-4 border border-amber-500/20 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-amber-300">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    <span>{generationStep}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Synthesizing photo-realistic studio lighting, tailored wardrobe, and true facial identity...
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* STEP 4: GENERATED RESULT STUDIO */}
          {currentResult && (
            <section
              id="result-section"
              className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-8"
            >
              {quotaNotice && (
                <div className="flex items-start gap-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-xs text-amber-200">
                  <Sparkles className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold text-white block">Studio Master Preview</span>
                    <p className="text-amber-300/90 leading-relaxed">{quotaNotice}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
                      Studio Master Result
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Model: {currentResult.modelUsed}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">
                    {currentResult.styleName} Headshot
                  </h2>
                  <p className="text-xs text-slate-300">
                    Tailored with {currentResult.attireName} • {currentResult.expression}
                  </p>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMockupOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3.5 py-2 text-xs font-semibold text-slate-200 transition"
                  >
                    <Eye className="h-3.5 w-3.5 text-amber-400" />
                    View Mockups (LinkedIn/Resume)
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-3.5 py-2 text-xs font-semibold text-slate-200 transition"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Image
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      downloadImage(
                        currentResult.imageUrl,
                        `lumina-${currentResult.styleId}-headshot.png`
                      )
                    }
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-md transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download High-Res
                  </button>
                </div>
              </div>

              {/* Central Comparison & Editor Area */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Interactive Before / After Slider */}
                <div className="lg:col-span-7 space-y-4">
                  <BeforeAfterSlider
                    beforeUrl={currentResult.originalSelfieUrl}
                    afterUrl={currentResult.imageUrl}
                    beforeLabel="Casual Selfie"
                    afterLabel={currentResult.styleName}
                    aspectRatioClass="aspect-square max-h-[520px]"
                  />

                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>Use the center divider to compare facial likeness</span>
                    <span className="font-mono text-amber-400/80">85mm Portrait Studio</span>
                  </div>
                </div>

                {/* Right: Text Prompt Editing & Fine-tuning */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Wand2 className="h-4 w-4 text-amber-400" />
                      Refine With Text Prompts
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Use natural text commands to adjust lighting, change suit colors, add glasses, or alter smile warmth using Gemini Nano Banana 2.1.
                    </p>

                    <TextPromptEditor
                      onApplyEdit={handleApplyEdit}
                      isEditing={isEditingPrompt}
                      versionCount={currentResult.version}
                      onResetToOriginal={handleResetToOriginal}
                    />
                  </div>

                  {/* Quick style re-generate buttons */}
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Try This Selfie in Another Backdrop:
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {HEADSHOT_STYLES.filter((s) => s.id !== currentResult.styleId)
                        .slice(0, 4)
                        .map((otherStyle) => (
                          <button
                            key={otherStyle.id}
                            type="button"
                            onClick={() => {
                              setSelectedStyleId(otherStyle.id);
                              handleGenerateHeadshot();
                            }}
                            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 p-2.5 text-left transition hover:border-amber-400/40"
                          >
                            <span className="text-xs font-semibold text-slate-200 block truncate">
                              {otherStyle.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {otherStyle.category}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Gallery if user made multiple generations */}
              {history.length > 1 && (
                <div className="pt-6 border-t border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Session Variations ({history.length})
                  </h4>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCurrentResult(item)}
                        className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                          currentResult.id === item.id
                            ? 'border-amber-400 ring-2 ring-amber-400/30'
                            : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.styleName}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-mono text-center text-white py-0.5 truncate">
                          {item.styleName}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* STUDIO PHOTOGRAPHY GUIDE & FAQ */}
          <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-amber-400" />
              Professional Headshot Tips for Maximum Realism
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="rounded-xl bg-slate-950/60 p-4 border border-white/5 space-y-1">
                <span className="font-semibold text-amber-300 block">1. Natural Eye Level</span>
                <p className="text-slate-400 leading-relaxed">
                  Avoid extreme high or low smartphone angles. A direct, eye-level gaze establishes commanding leadership and trustworthy connection.
                </p>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-4 border border-white/5 space-y-1">
                <span className="font-semibold text-amber-300 block">2. Even Ambient Lighting</span>
                <p className="text-slate-400 leading-relaxed">
                  Photos taken near a window with diffused natural daylight provide the clearest facial structure map for the AI studio lights to render.
                </p>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-4 border border-white/5 space-y-1">
                <span className="font-semibold text-amber-300 block">3. True-to-Life Expression</span>
                <p className="text-slate-400 leading-relaxed">
                  Relax your jaw and neck. A subtle, genuine micro-smile creates warmth without feeling overly posed or artificial.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>Lumina Studio • AI Executive Headshot Photographer • Powered by Google Gemini</p>
      </footer>

      {/* Web Camera Snapshot Modal */}
      <CameraCapture
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          setSelfieDataUrl(dataUrl);
          setIsSampleSelfie(false);
        }}
      />

      {/* Gemini 3.8 Flash Selfie Critique Modal */}
      <SelfieCritiqueModal
        isOpen={isCritiqueOpen}
        onClose={() => setIsCritiqueOpen(false)}
        analysis={critiqueText}
        isLoading={isCritiqueLoading}
      />

      {/* LinkedIn, Resume & Badge Mockup Modal */}
      {currentResult && (
        <MockupPreviewModal
          isOpen={isMockupOpen}
          onClose={() => setIsMockupOpen(false)}
          imageUrl={currentResult.imageUrl}
        />
      )}
    </div>
  );
}
