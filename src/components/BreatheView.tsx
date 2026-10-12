import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n';
import {
  ChevronLeft,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  Heart,
  Info,
  Play,
  Pause,
} from 'lucide-react';

interface BreatheViewProps {
  onComplete?: () => void;
  onOpenProgress?: () => void;
  onBack?: () => void;
}

export const BreatheView: React.FC<BreatheViewProps> = ({
  onComplete,
  onOpenProgress,
  onBack,
}) => {
  const { t, isSpanish } = useLanguage();
  // Technique: default to 6-4 as requested by user ("keep the 6-4")
  const [technique, setTechnique] = useState<'6-4' | '4-6' | 'box'>('6-4');
  const [showSettings, setShowSettings] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(6); // 6s Inhale default
  const [totalSecondsRemaining, setTotalSecondsRemaining] = useState(60); // 1-minute default (or can cycle)
  const [isFinished, setIsFinished] = useState(false);

  // Calming prompts based on phase
  const getCalmPrompt = () => {
    if (!isActive) return t.breatheCalmInitial;
    if (phase === 'Inhale') return t.breatheCalmInhale;
    if (phase === 'Hold') return t.breatheCalmHold;
    if (phase === 'Exhale') return t.breatheCalmExhale;
    return t.breatheCalmPause;
  };

  // Record session in localStorage when finished
  const recordCompletedSession = () => {
    try {
      const existing = localStorage.getItem('thera_breath_sessions_v1');
      const list: string[] = existing ? JSON.parse(existing) : [];
      list.push(new Date().toISOString());
      localStorage.setItem('thera_breath_sessions_v1', JSON.stringify(list));
    } catch {}
  };

  useEffect(() => {
    if (!isActive || isFinished) return;

    const timer = setInterval(() => {
      setTotalSecondsRemaining((tot) => {
        if (tot <= 1) {
          setIsActive(false);
          setIsFinished(true);
          recordCompletedSession();
          if (onComplete) onComplete();
          return 0;
        }
        return tot - 1;
      });

      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        if (technique === '6-4') {
          // 6s Inhale, 4s Exhale
          if (phase === 'Inhale') {
            setPhase('Exhale');
            return 4;
          } else {
            setPhase('Inhale');
            return 6;
          }
        } else if (technique === '4-6') {
          // 4s Inhale, 6s Exhale
          if (phase === 'Inhale') {
            setPhase('Exhale');
            return 6;
          } else {
            setPhase('Inhale');
            return 4;
          }
        } else {
          // Box: 4-4-4-4
          if (phase === 'Inhale') {
            setPhase('Hold');
            return 4;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            return 4;
          } else if (phase === 'Exhale') {
            setPhase('Pause');
            return 4;
          } else {
            setPhase('Inhale');
            return 4;
          }
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, technique, isFinished]);

  const handleReset = () => {
    setIsActive(false);
    setIsFinished(false);
    setPhase('Inhale');
    setSecondsLeft(technique === '6-4' ? 6 : 4);
    setTotalSecondsRemaining(60);
  };

  const handleSwitchTechnique = (tech: '6-4' | '4-6' | 'box') => {
    setTechnique(tech);
    setIsActive(false);
    setIsFinished(false);
    setPhase('Inhale');
    setSecondsLeft(tech === '6-4' ? 6 : 4);
    setTotalSecondsRemaining(60);
    setShowSettings(false);
  };

  // Scale and glow animation classes for the central orb
  const getOrbClasses = () => {
    if (!isActive) return 'scale-95 shadow-[0_0_40px_rgba(164,222,216,0.4)]';
    if (phase === 'Inhale') {
      const duration = technique === '6-4' ? 'duration-[6000ms]' : 'duration-[4000ms]';
      return `scale-115 shadow-[0_0_70px_rgba(164,222,216,0.85)] ${duration} ease-out`;
    }
    if (phase === 'Hold') {
      return 'scale-115 shadow-[0_0_60px_rgba(164,222,216,0.7)] duration-500';
    }
    if (phase === 'Exhale') {
      const duration = technique === '6-4' ? 'duration-[4000ms]' : 'duration-[6000ms]';
      return `scale-85 shadow-[0_0_30px_rgba(164,222,216,0.35)] ${duration} ease-in`;
    }
    return 'scale-85 shadow-[0_0_30px_rgba(164,222,216,0.35)] duration-500';
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-md mx-auto pb-28 space-y-5 pt-1">
      {/* 
        Container matching the phone mockup:
        - Layered watercolor misty mountain illustration
        - Soft teal gradient skies
        - Clean serif typography
      */}
      <div className="relative rounded-[36px] overflow-hidden border border-[#D5ECE8] shadow-sm bg-gradient-to-b from-[#EBF6F5] via-[#E4F3F1] to-[#F7FAF9] p-5 sm:p-7 text-center select-none">
        {/* Soft Misty Watercolor Mountain Backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-45 overflow-hidden">
          <svg
            viewBox="0 0 400 450"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full object-cover"
            preserveAspectRatio="none"
          >
            {/* Distant Hills */}
            <path
              d="M -20 180 C 60 140, 140 190, 220 150 C 300 110, 360 160, 420 130 L 420 450 L -20 450 Z"
              fill="#D2EDE9"
            />
            {/* Mid Hills */}
            <path
              d="M -20 220 C 50 190, 120 240, 200 200 C 280 160, 350 210, 420 180 L 420 450 L -20 450 Z"
              fill="#C2E6E1"
            />
            {/* Foreground Hills */}
            <path
              d="M -20 270 C 70 240, 150 280, 240 240 C 320 210, 370 250, 420 230 L 420 450 L -20 450 Z"
              fill="#B4DFD9"
            />
          </svg>
        </div>

        {/* Top Header Bar matching Screenshot */}
        <div className="relative z-10 flex items-center justify-between pb-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white/70 hover:bg-white text-[#154E48] flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer border border-white/60 shadow-2xs"
              aria-label="Back"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9 h-9" />
          )}

          <h2 className="text-xl font-serif font-extrabold text-[#194D47] tracking-tight">
            {t.breatheTitle}
          </h2>

          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="w-9 h-9 rounded-full bg-white/70 hover:bg-white text-[#154E48] flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer border border-white/60 shadow-2xs"
            aria-label="Breathing settings"
            title={t.breathePacing}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Dropdown / Settings Panel to switch between 6-4, 4-6, and Box */}
        {showSettings && (
          <div className="relative z-20 my-2 p-3 bg-white/95 rounded-2xl border border-[#CCE8E4] shadow-md animate-in fade-in zoom-in-95 duration-150 text-left space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 block">
              {t.breathePacing}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleSwitchTechnique('6-4')}
                className={`p-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                  technique === '6-4'
                    ? 'bg-[#154E48] text-white border-[#154E48] shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                6 - 4
                <span className="block text-[9.5px] font-normal opacity-85">6s In · 4s Out</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchTechnique('4-6')}
                className={`p-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                  technique === '4-6'
                    ? 'bg-[#154E48] text-white border-[#154E48] shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                4 - 6
                <span className="block text-[9.5px] font-normal opacity-85">4s In · 6s Out</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchTechnique('box')}
                className={`p-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                  technique === 'box'
                    ? 'bg-[#154E48] text-white border-[#154E48] shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Box
                <span className="block text-[9.5px] font-normal opacity-85">4-4-4-4</span>
              </button>
            </div>
          </div>
        )}

        {/* Central Glowing Orb & Breathing Experience */}
        <div className="relative z-10 py-6 sm:py-8 flex flex-col items-center justify-center">
          {/* Main Breathing Orb */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Outer Luminous Halo Ring */}
            <div
              className={`absolute inset-0 rounded-full border-2 border-white/80 transition-all ${getOrbClasses()}`}
            />

            {/* Inner Glowing Gradient Sphere */}
            <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-b from-white/95 via-[#E6F6F4] to-[#CBECE7] flex flex-col items-center justify-center border-2 border-white shadow-inner p-4">
              <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[#154E48] tracking-wide">
                {phase}
              </span>
              <span className="text-sm font-sans font-bold text-[#2A7570] mt-1 tabular-nums">
                {secondsLeft}s
              </span>
            </div>
          </div>

          {/* Calming Micro-copy directly below orb (Matching screenshot: "Let go. You're safe here.") */}
          <p className="mt-5 text-sm sm:text-base font-serif font-medium text-[#1E524D] italic transition-opacity duration-300">
            {getCalmPrompt()}
          </p>

          {/* Phase Pills matching screenshot: [ Inhale ] [ Hold ] [ Exhale ] [ Hold ] */}
          <div className="mt-5 inline-flex items-center p-1 bg-white/70 backdrop-blur-md rounded-full border border-white/80 shadow-2xs gap-1 max-w-full overflow-x-auto">
            {technique === 'box' ? (
              <>
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    phase === 'Inhale'
                      ? 'bg-[#2A7570] text-white shadow-xs'
                      : 'text-stone-600'
                  }`}
                >
                  Inhale
                </span>
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    phase === 'Hold'
                      ? 'bg-[#2A7570] text-white shadow-xs'
                      : 'text-stone-600'
                  }`}
                >
                  Hold
                </span>
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    phase === 'Exhale'
                      ? 'bg-[#2A7570] text-white shadow-xs'
                      : 'text-stone-600'
                  }`}
                >
                  Exhale
                </span>
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    phase === 'Pause'
                      ? 'bg-[#2A7570] text-white shadow-xs'
                      : 'text-stone-600'
                  }`}
                >
                  Hold
                </span>
              </>
            ) : (
              <>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    phase === 'Inhale'
                      ? 'bg-[#2A7570] text-white shadow-xs'
                      : 'text-stone-600'
                  }`}
                >
                  {t.breatheInhale} ({technique === '6-4' ? '6s' : '4s'})
                </span>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    phase === 'Exhale'
                      ? 'bg-[#2A7570] text-white shadow-xs'
                      : 'text-stone-600'
                  }`}
                >
                  {t.breatheExhale} ({technique === '6-4' ? '4s' : '6s'})
                </span>
              </>
            )}
          </div>

          {/* Technique Subtitle */}
          <div className="mt-3 space-y-0.5">
            <span className="text-xs font-extrabold text-[#154E48] tracking-widest block">
              {technique === '6-4' ? '6 - 4' : technique === '4-6' ? '4 - 6' : '4 - 4 - 4 - 4'}
            </span>
            <span className="text-[11px] text-stone-500 font-medium">
              {technique === 'box'
                ? (isSpanish ? 'Respiración Cuadrada' : 'Box Breathing')
                : technique === '6-4'
                ? (isSpanish ? 'Respiración de Regulación 6-4' : 'Paced Breath Work')
                : (isSpanish ? 'Sincronización Cardiovascular' : 'Cardiovascular Synchronization')}
            </span>
          </div>

          {/* Start / Pause / Reset Controls */}
          <div className="mt-5 flex items-center gap-2.5 w-full max-w-xs">
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className="flex-1 py-3 px-6 rounded-full bg-[#BEE1DD] hover:bg-[#A9D7D2] active:scale-98 text-[#144742] text-sm font-extrabold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>{t.breathePause}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{t.breatheStart}</span>
                </>
              )}
            </button>

            {isActive && (
              <button
                type="button"
                onClick={handleReset}
                className="w-11 h-11 rounded-full bg-white/80 hover:bg-white text-stone-600 flex items-center justify-center transition-colors cursor-pointer border border-white shadow-2xs"
                title={t.breatheReset}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Time Remaining Bar */}
          <span className="text-[10px] text-stone-400 font-semibold mt-2 tabular-nums">
            {formatTime(totalSecondsRemaining)} {t.breatheRemaining}
          </span>
        </div>

        {/* 
          THE WHY CARD: PLACED DIRECTLY BELOW THE START BUTTON
        */}
        <div className="relative z-10 mt-2 p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#CCE8E4] shadow-2xs space-y-2.5 text-left">
          {/* Question First */}
          <div className="flex items-start gap-2 text-[#154E48]">
            <Info className="w-4 h-4 text-[#2A7570] shrink-0 mt-0.5" />
            <h3 className="text-xs sm:text-sm font-serif font-extrabold text-stone-900 leading-snug">
              {isSpanish
                ? `¿Por qué ${technique === '6-4' ? '6s de inhalación y 4s de exhalación' : '4s de inhalación y 6s de exhalación'}?`
                : `Why ${technique === '6-4' ? '6s inhale and 4s exhale' : '4s inhale and 6s exhale'}?`}
            </h3>
          </div>

          {/* Badge & Subheader */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/50">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-[#E8F8F5] text-[#154E48] flex items-center justify-center shrink-0">
                <Heart className="w-3 h-3 text-[#2A7570]" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-700">
                {t.breatheCardioSync}
              </span>
            </div>
            <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full bg-[#EBF6F4] text-[#154E48] border border-[#CCE8E4]">
              {technique === '6-4'
                ? (isSpanish ? '6s Inhala · 4s Exhala' : '6s In · 4s Out')
                : (isSpanish ? '4s Inhala · 6s Exhala' : '4s In · 6s Out')}
            </span>
          </div>

          {/* Pretty explanation */}
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            {t.breatheWhyExplanation}
          </p>
        </div>
      </div>
    </div>
  );
};
