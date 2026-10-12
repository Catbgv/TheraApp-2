import React from 'react';

export const CloudBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Soothing airy sky gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EBF5F6] via-[#F3FAFA] to-[#FAF9F5]" />

      {/* Cloud Layer 1: Slow, large background puffs */}
      <div className="absolute top-[2%] -left-[10%] w-[120%] opacity-45 animate-cloud-slow">
        <svg
          viewBox="0 0 1200 400"
          className="w-full h-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 180 320 Q 220 230 310 240 Q 370 170 470 190 Q 560 130 670 180 Q 760 110 880 160 Q 980 140 1060 210 Q 1140 220 1180 320 Z"
            fill="url(#cloudGrad1)"
          />
          <defs>
            <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D4EEF0" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Cloud Layer 2: Mid-ground drifting clouds */}
      <div className="absolute top-[35%] -left-[15%] w-[130%] opacity-35 animate-cloud-medium">
        <svg
          viewBox="0 0 1200 350"
          className="w-full h-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 50 280 Q 120 190 220 200 Q 290 140 400 160 Q 480 90 600 130 Q 720 100 810 160 Q 910 130 1000 200 Q 1090 190 1150 280 Z"
            fill="url(#cloudGrad2)"
          />
          <defs>
            <linearGradient id="cloudGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#C8E8EA" stopOpacity="0.25" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Cloud Layer 3: Lower ambient drift */}
      <div className="absolute bottom-[2%] -right-[10%] w-[120%] opacity-40 animate-cloud-fast">
        <svg
          viewBox="0 0 1200 360"
          className="w-full h-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 80 340 Q 160 250 270 260 Q 360 180 480 210 Q 590 160 710 200 Q 820 150 930 210 Q 1040 190 1120 270 Z"
            fill="url(#cloudGrad3)"
          />
          <defs>
            <linearGradient id="cloudGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#E2F3F4" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Subtle warm morning light glow in top corner */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-amber-100/40 via-teal-100/20 to-transparent blur-3xl" />
      <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-teal-100/30 via-sky-100/20 to-transparent blur-3xl" />
    </div>
  );
};
