import React, { useState } from 'react';
import { useLanguage } from '../i18n';
import { ReflectionTakeaway } from '../types';
import {
  X,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  AlertTriangle,
  RotateCcw,
  Zap,
  MessageSquare,
  Shield,
} from 'lucide-react';
import { DistortionIcon, type CognitiveDistortion } from './DistortionIcons';

interface DistortionDetailModalProps {
  distortion: CognitiveDistortion | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectNext?: () => void;
  onSelectPrev?: () => void;
  currentIndex?: number;
  totalCount?: number;
  onStartReflection?: (distortionName: string) => void;
  personalTakeaways?: ReflectionTakeaway[];
  onRevisitChat?: (takeaway: ReflectionTakeaway) => void;
}

export const DistortionDetailModal: React.FC<DistortionDetailModalProps> = ({
  distortion,
  isOpen,
  onClose,
  onSelectNext,
  onSelectPrev,
  currentIndex = 0,
  totalCount = 10,
  onStartReflection,
  personalTakeaways = [],
  onRevisitChat,
}) => {
  const { t, isSpanish } = useLanguage();
  const [showReframe, setShowReframe] = React.useState(false);
  const [activePersonalIndex, setActivePersonalIndex] = useState(0);

  // Reset reframe state when distortion changes
  React.useEffect(() => {
    setShowReframe(false);
    setActivePersonalIndex(0);
  }, [distortion?.id]);

  if (!isOpen || !distortion) return null;

  const currentPersonalTakeaway =
    personalTakeaways.length > 0
      ? personalTakeaways[activePersonalIndex % personalTakeaways.length]
      : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header Bar */}
        <div className={`p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between ${distortion.color.badgeBg}`}>
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs border ${distortion.color.bg} ${distortion.color.text} ${distortion.color.border}`}
            >
              <DistortionIcon id={distortion.id} className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Pattern {distortion.number} of {totalCount}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-stone-700 border border-stone-200/60">
                  {distortion.gameLandmark}
                </span>
              </div>
              <h3 id="modal-title" className="text-lg sm:text-xl font-serif font-bold text-stone-900 leading-snug">
                {distortion.name}
              </h3>
              <p className="text-xs text-amber-900 font-semibold flex items-center gap-1 mt-0.5">
                <span>{distortion.gameEmoji} {distortion.gameRegion}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-stone-200/70 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-left text-xs sm:text-sm text-stone-700 leading-relaxed">
          {/* Also Known As & Metaphor banner */}
          <div className="p-3 bg-[#FAF9F5] rounded-2xl border border-stone-200/70 flex items-start gap-2.5">
            <div className="p-1 rounded-lg bg-white border border-stone-200/80 text-[#2C6E72] mt-0.5 shrink-0">
              <DistortionIcon id={distortion.id} className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide">
                  Icon Metaphor:
                </span>
                <span className="text-xs font-bold text-[#1F5C60]">
                  "{distortion.metaphor}"
                </span>
              </div>
              <p className="text-xs text-stone-600">
                {distortion.iconDescription}
              </p>
            </div>
          </div>

          {/* Gamified Landmark Lore Box */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-1">
            <div className="flex items-center justify-between font-extrabold text-amber-900 text-[11px] uppercase tracking-wide">
              <span>🗺️ {distortion.gameLandmark}</span>
              <span>Guard: {distortion.bossNPC}</span>
            </div>
            <p className="italic">
              "{distortion.funnyLore}"
            </p>
          </div>

          {/* Core Definition */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#2C6E72]" />
              What is this distortion?
            </h4>
            <p className="text-stone-800 text-xs sm:text-sm bg-white p-3 rounded-2xl border border-stone-200/80">
              {distortion.definition}
            </p>
          </div>

          {/* Why the Mind Does It (Neuro / Evolutionary perspective) */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C6E72] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2C6E72]" />
              Why our brains do this:
            </h4>
            <p className="text-xs text-stone-600 bg-[#F4F9F9] p-3 rounded-2xl border border-[#CCE7E6]">
              {distortion.whyBrainDoesIt}
            </p>
          </div>

          {/* Red Flag Clue Words */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Red-Flag Clue Words to Listen For:
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {distortion.cluePhrases.map((phrase, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/70 text-[11px] font-medium"
                >
                  "{phrase}"
                </span>
              ))}
            </div>
          </div>

          {/* Personalized Encounter from Previous Entries (if available) */}
          {currentPersonalTakeaway && (
            <div className="p-4 bg-gradient-to-br from-[#EBF6F4] via-[#F2FAF8] to-[#E5F4F1] rounded-2xl border-2 border-[#8ED4C8] shadow-2xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#154E48] text-white flex items-center justify-center text-xs">
                    ⚡
                  </span>
                  <div>
                    <h5 className="text-xs font-extrabold text-[#154E48] uppercase tracking-wider">
                      Your Real-Life Reflection Encounter
                    </h5>
                    <span className="text-[10px] text-stone-500 font-medium">
                      {currentPersonalTakeaway.date} • {currentPersonalTakeaway.title}
                    </span>
                  </div>
                </div>

                {personalTakeaways.length > 1 && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-stone-600">
                    <button
                      type="button"
                      onClick={() =>
                        setActivePersonalIndex(
                          (prev) => (prev - 1 + personalTakeaways.length) % personalTakeaways.length
                        )
                      }
                      className="p-1 rounded-md hover:bg-white text-stone-600 border border-stone-200 cursor-pointer"
                      title="Previous personal entry"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <span>
                      {activePersonalIndex + 1}/{personalTakeaways.length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setActivePersonalIndex((prev) => (prev + 1) % personalTakeaways.length)
                      }
                      className="p-1 rounded-md hover:bg-white text-stone-600 border border-stone-200 cursor-pointer"
                      title="Next personal entry"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Activating Event Context */}
              <div className="p-2.5 bg-white/90 rounded-xl border border-stone-200/80 text-xs text-stone-800">
                <span className="text-[10px] font-extrabold uppercase text-stone-500 block">
                  What Happened:
                </span>
                <p className="font-medium text-stone-900 mt-0.5">
                  "{currentPersonalTakeaway.entry.event}"
                </p>
              </div>

              {/* Automatic Thought that appeared */}
              <div className="p-2.5 bg-rose-50/80 rounded-xl border border-rose-200/80 text-xs text-rose-950">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-extrabold uppercase text-rose-800">
                    Your Automatic Distorted Thought:
                  </span>
                  <div className="flex items-center gap-1">
                    {currentPersonalTakeaway.entry.emotions.slice(0, 2).map((emo) => (
                      <span
                        key={emo.id}
                        className="text-[9px] font-bold bg-white px-1.5 py-0.5 rounded text-rose-700 border border-rose-200"
                      >
                        {emo.name} {emo.intensity}/10
                      </span>
                    ))}
                  </div>
                </div>
                <p className="italic font-medium">
                  "{currentPersonalTakeaway.dominantThought || currentPersonalTakeaway.entry.thoughts}"
                </p>
              </div>

              {/* Your Balanced Reframe */}
              {currentPersonalTakeaway.balancedPerspective &&
              !currentPersonalTakeaway.balancedPerspective.includes('TBD') &&
              !currentPersonalTakeaway.balancedPerspective.includes('Por definir') ? (
                <div className="p-2.5 bg-emerald-50/90 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 block mb-0.5">
                    Your Balanced CBT Reframe:
                  </span>
                  <p className="font-semibold text-emerald-900">
                    "{currentPersonalTakeaway.balancedPerspective}"
                  </p>
                </div>
              ) : (
                <div className="p-2.5 bg-amber-50/90 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <span className="text-[11px] font-medium">
                    Balanced perspective currently TBD in reflection.
                  </span>
                  {onRevisitChat && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onRevisitChat(currentPersonalTakeaway);
                      }}
                      className="text-[11px] font-bold text-[#154E48] underline cursor-pointer"
                    >
                      Continue in chat →
                    </button>
                  )}
                </div>
              )}

              {onRevisitChat && (
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onRevisitChat(currentPersonalTakeaway);
                    }}
                    className="text-xs font-bold text-[#154E48] hover:text-[#0F3B36] flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Revisit this dialogue with coach</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Interactive Scenario & Reframe */}
          <div className="space-y-2 pt-1 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-[#2C6E72]" />
              Classic CBT Textbook Scenario
            </h4>

            <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                Automatic Distorted Thought:
              </span>
              <p className="text-xs sm:text-sm text-stone-800 italic">
                "{distortion.bookExample}"
              </p>
            </div>

            {showReframe ? (
              <div className="p-3.5 bg-[#F0FAF9] rounded-2xl border border-[#CCEAE8] space-y-1 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1F5C60] block">
                    Balanced CBT Reframe:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowReframe(false)}
                    className="text-[11px] text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    Hide
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-serif font-medium text-stone-900 italic">
                  "{distortion.bookReframe}"
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowReframe(true)}
                className="w-full py-2.5 px-3 rounded-2xl bg-[#E8F3F3] text-[#2C6E72] hover:bg-[#D5EDED] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#CCE7E6]"
              >
                <Lightbulb className="w-4 h-4" />
                <span>See Balanced CBT Reframe</span>
              </button>
            )}
          </div>

          {/* 3-Step Antidote Protocol */}
          <div className="space-y-2 pt-1 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C6E72] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2C6E72]" />
              How to Disarm this Pattern (3-Step Antidote)
            </h4>
            <div className="space-y-2">
              {distortion.antidoteSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-stone-200/70"
                >
                  <span className="w-5 h-5 rounded-full bg-[#E8F3F3] text-[#2C6E72] font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="text-xs">
                    <strong className="text-stone-900 font-semibold mr-1">
                      {step.step}:
                    </strong>
                    <span className="text-stone-600">{step.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Socratic Question */}
          <div className="p-3 bg-[#FAF9F5] rounded-2xl border border-stone-200/80 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-[#2C6E72] shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700">
              <span className="font-semibold text-stone-900 block mb-0.5">
                {t.distortionsCoreQuestion}:
              </span>
              <span>"{distortion.coreQuestion}"</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation & Journal Action */}
        <div className="p-4 bg-[#FAF9F5] border-t border-stone-200/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Prev / Next buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
            <button
              type="button"
              onClick={onSelectPrev}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 text-xs font-medium cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{isSpanish ? 'Anterior' : 'Prev'}</span>
            </button>
            <span className="text-[11px] font-medium text-stone-500 sm:px-2">
              {distortion.number} / {totalCount}
            </span>
            <button
              type="button"
              onClick={onSelectNext}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 text-xs font-medium cursor-pointer transition-colors"
            >
              <span>{isSpanish ? 'Siguiente' : 'Next'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CTA: Reflect on this in Journal */}
          {onStartReflection && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartReflection(distortion.name);
              }}
              className="w-full sm:w-auto px-4 py-2 bg-[#2C6E72] hover:bg-[#23585B] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>{t.distortionsReflectButton}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
