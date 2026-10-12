import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartReflecting?: () => void;
}

interface SlideData {
  id: number;
  badge: string;
  titlePrefix: string;
  titleHighlight1: string;
  titleMid: string;
  titleHighlight2: string;
  subtitle: string;
  cardTheme: 'cbt' | 'rewire' | 'matrix' | 'practice';
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    badge: 'CBT TOOLKIT',
    titlePrefix: 'TheraApp puts ',
    titleHighlight1: 'actionable CBT',
    titleMid: ' tools in ',
    titleHighlight2: 'your hands.',
    subtitle: 'Bite-sized • Fun • Truly interactive',
    cardTheme: 'cbt',
  },
  {
    id: 2,
    badge: 'THOUGHT REWIRING',
    titlePrefix: 'Turn ',
    titleHighlight1: 'spiraling',
    titleMid: ' into calm ',
    titleHighlight2: 'clarity.',
    subtitle: 'Science-backed • Gentle • Self-guided',
    cardTheme: 'rewire',
  },
  {
    id: 3,
    badge: 'SCIENCE-BACKED CBT',
    titlePrefix: "You'll get ",
    titleHighlight1: 'structure',
    titleMid: ' and exercises grounded in ',
    titleHighlight2: 'real science.',
    subtitle: 'Evidence-based • Step-by-step • Proven methods',
    cardTheme: 'matrix',
  },
  {
    id: 4,
    badge: 'DAILY PRACTICE',
    titlePrefix: 'You ',
    titleHighlight1: 'just gotta',
    titleMid: ' ',
    titleHighlight2: 'show up.',
    subtitle: 'Bite-sized • 2 minutes a day • Zero judgment',
    cardTheme: 'practice',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartReflecting,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!isOpen) return null;

  const currentSlide = SLIDES[currentSlideIndex];
  const isLast = currentSlideIndex === SLIDES.length - 1;
  const isFirst = currentSlideIndex === 0;

  const handleNext = () => {
    if (isLast) {
      onClose();
      if (onStartReflecting) onStartReflecting();
    } else {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF9F5] rounded-[36px] max-w-md w-full overflow-hidden shadow-2xl border border-stone-200/90 flex flex-col max-h-[94vh] relative">
        {/* Top Header Bar: Skip button & Close */}
        <div className="px-6 pt-5 pb-1 flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider uppercase text-stone-400">
            Guide {currentSlideIndex + 1} of {SLIDES.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-stone-400 hover:text-stone-700 py-1.5 px-3 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            Skip
          </button>
        </div>

        {/* Slide Body */}
        <div className="px-6 py-4 sm:px-8 sm:py-6 flex-1 flex flex-col items-center justify-center text-center space-y-5 overflow-y-auto">
          {/* Circular Illustrated Badge matching screenshot */}
          <div className="relative w-48 h-48 sm:w-52 sm:h-52 rounded-full border-2 border-dashed border-[#57BAAA]/60 flex items-center justify-center bg-gradient-to-b from-[#EBF8F5] via-[#F4FBF9] to-white/90 shadow-xs mx-auto select-none">
            {/* Sparkle 1 (Top Left) */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-[#34A895] absolute top-5 left-8 animate-pulse"
            >
              <path
                d="M12 2L14 9L21 12L14 15L12 22L10 15L3 12L10 9L12 2Z"
                fill="currentColor"
              />
            </svg>

            {/* Sparkle 2 (Right) */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-[#34A895] absolute top-12 right-6"
            >
              <path
                d="M12 2L13.5 8.5L20 12L13.5 15.5L12 22L10.5 15.5L4 12L10.5 8.5L12 2Z"
                fill="currentColor"
              />
            </svg>

            {/* Teal dot (Bottom left) */}
            <span className="w-2 h-2 rounded-full bg-[#154E48] absolute bottom-11 left-9" />

            {/* Teal dot (Bottom right) */}
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A895] absolute bottom-8 right-14" />

            {/* Back Card (Tilted mint card) */}
            <div className="w-28 h-20 bg-[#A6E3DA] border-2 border-[#57BAAA] rounded-2xl p-2.5 shadow-sm transform -rotate-12 translate-x-2 -translate-y-2 relative">
              <div className="w-14 h-1.5 bg-white/90 rounded-full" />
              <div className="w-10 h-1.5 bg-white/70 rounded-full mt-1.5" />
              {/* Dot icon */}
              <div className="w-2 h-2 rounded-full bg-[#154E48] absolute top-2.5 right-3" />
            </div>

            {/* Front Card (Tilted white card with bold outline) */}
            <div className="w-32 h-22 bg-white border-[2.5px] border-[#154E48] rounded-2xl p-3 shadow-md transform rotate-6 translate-x-3 translate-y-1 relative">
              {/* Bold Dark Teal Header bar */}
              <div className="w-14 h-2 bg-[#154E48] rounded-full" />
              {/* Secondary Teal Bar */}
              <div className="w-20 h-1.5 bg-[#34A895] rounded-full mt-2" />
              {/* Third Bar */}
              <div className="w-12 h-1.5 bg-[#A0DDD3] rounded-full mt-1.5" />

              {/* Tiny chevron ^ at top right */}
              <svg
                viewBox="0 0 16 16"
                className="w-3.5 h-3.5 text-[#34A895] absolute top-2.5 right-3"
              >
                <path
                  d="M 4 10 L 8 6 L 12 10"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Pill Badge matching screenshot: • CBT TOOLKIT */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#BDE7E1] bg-white text-[#154E48] text-xs font-extrabold tracking-wider uppercase shadow-2xs mx-auto">
            <span className="w-2 h-2 rounded-full bg-[#34A895]" />
            <span>{currentSlide.badge}</span>
          </div>

          {/* Playful Headline with Playful Typography matching screenshot */}
          <div className="space-y-3 px-2">
            <h2 className="font-serif text-[28px] sm:text-[34px] font-extrabold tracking-tight leading-[1.18] text-stone-900">
              <span>{currentSlide.titlePrefix}</span>
              <span className="text-[#154E48]">{currentSlide.titleHighlight1}</span>
              <span>{currentSlide.titleMid}</span>
              <span className="relative inline-block text-[#3EAE9B] whitespace-nowrap">
                {currentSlide.titleHighlight2}
                {/* Playful Hand-Drawn Wavy Underline */}
                <svg
                  viewBox="0 0 140 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute -bottom-1.5 left-0 w-full text-[#99DDD2] overflow-visible pointer-events-none"
                >
                  <path
                    d="M 2 6 Q 14 0 26 6 T 50 6 T 74 6 T 98 6 T 122 6 T 138 6"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-stone-600 font-medium leading-normal max-w-sm mx-auto">
              {currentSlide.subtitle}
            </p>
          </div>
        </div>

        {/* Bottom Navigation matching screenshot */}
        <div className="px-6 py-5 sm:px-8 bg-transparent flex items-center justify-between gap-3">
          {/* Previous arrow if not first */}
          {!isFirst ? (
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-full border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer shadow-2xs"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-10" />
          )}

          {/* Pagination Indicators matching screenshot */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                className={`transition-all cursor-pointer ${
                  idx === currentSlideIndex
                    ? 'w-8 sm:w-9 h-2.5 rounded-full bg-[#154E48]'
                    : 'w-2.5 h-2.5 rounded-full bg-[#D1D5DB] hover:bg-stone-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Button matching screenshot: dark green pill with 'Next >' */}
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 py-3 px-6 sm:px-7 rounded-full text-sm font-bold bg-[#154E48] hover:bg-[#0F3B36] text-white shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>{isLast ? 'Start' : 'Next'}</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
