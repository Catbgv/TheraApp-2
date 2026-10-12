import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'orb';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
}) => {
  // Proportions for the icon and typography
  const sizeConfig = {
    sm: {
      icon: 'w-7 h-7 sm:w-8 sm:h-8',
      text: 'text-xl sm:text-2xl',
      gap: 'gap-2',
    },
    md: {
      icon: 'w-9 h-9 sm:w-10 sm:h-10',
      text: 'text-2xl sm:text-3xl',
      gap: 'gap-2.5',
    },
    orb: {
      icon: 'w-8 h-8 sm:w-9 sm:h-9',
      text: 'text-xl sm:text-2xl',
      gap: 'gap-2',
    },
    lg: {
      icon: 'w-12 h-12 sm:w-14 sm:h-14',
      text: 'text-3xl sm:text-4xl',
      gap: 'gap-3',
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      <div className={`flex items-center justify-center ${currentSize.gap}`}>
        {/* 
          Official TheraApp Logo Emblem (Three Nested Head Profiles Facing Right)
          Faithfully matching logo-heads-theraapp.png:
          - Outer Adult Head: Calm seafoam slate cyan (#62A4AC)
          - Middle Nested Head: Soft pale mint (#A0D2D7)
          - Inner Mind/Self: Pure white silhouette (#FFFFFF)
        */}
        <div className={`${currentSize.icon} shrink-0 relative flex items-center justify-center`}>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-2xs"
            aria-label="TheraApp 3-Heads Logo"
          >
            {/* Outer Head Profile (Adult in #62A4AC) */}
            <path
              d="M 34 88 C 35 74 30 63 28 50 C 26 34 35 16 56 16 C 72 16 83 26 87 40 C 88 43 87 46 85 48 C 88 49 93 51 95 53 C 98 56 97 58 94 59 C 90 61 87 61 87 63 C 88 64 90 66 91 67 C 92 68 91 70 89 71 C 87 72 86 74 87 76 C 88 78 86 81 82 82 C 78 84 73 85 70 87 C 68 88 67 89 67 90 C 66 84 64 78 62 74 C 61 71 58 69 56 68 C 60 66 62 63 61 60 C 59 58 57 57 56 56 C 57 54 59 53 58 50 C 56 48 54 47 52 46 C 54 44 55 41 53 38 C 50 34 45 32 41 33 C 33 35 30 48 32 62 C 33 72 34 81 34 88 Z"
              fill="#62A4AC"
            />

            {/* Middle Head Profile (Nested in #A0D2D7) */}
            <path
              d="M 40 88 C 41 76 36 65 34 54 C 32 40 40 24 58 24 C 72 24 80 33 83 45 C 84 48 83 50 81 52 C 84 54 88 55 89 57 C 91 60 90 61 87 63 C 84 64 82 64 82 66 C 83 67 85 68 86 70 C 87 71 86 73 83 74 C 81 75 80 77 81 79 C 82 80 80 83 77 84 C 73 85 69 86 66 87 C 65 88 64 89 64 90 C 62 83 60 78 58 74 C 56 71 54 69 52 68 C 56 66 57 63 56 60 C 55 58 53 57 52 56 C 53 54 55 52 54 49 C 52 47 50 46 49 45 C 50 43 51 40 49 38 C 47 35 43 33 40 34 C 35 36 33 46 36 57 C 38 66 39 77 40 88 Z"
              fill="#A0D2D7"
            />

            {/* Inner Head Profile (Inner Self / Child in #FFFFFF) */}
            <path
              d="M 47 88 C 48 80 44 72 42 63 C 40 51 46 37 60 37 C 71 37 77 44 79 53 C 80 55 79 57 77 58 C 80 60 83 61 84 63 C 85 65 84 66 81 67 C 78 68 77 69 77 70 C 78 71 79 72 80 73 C 81 74 80 76 77 77 C 75 78 74 80 75 82 C 76 83 74 85 71 86 C 68 87 65 88 63 89 C 62 90 61 90 61 90 L 47 88 Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>

        {/* 
          TheraApp Wordmark Written with Real Typography (No redrawn vectors)
          Rendered using the user's requested Fraunces font:
          - "Thera" in deep slate/teal (#154E48 or #62A4AC)
          - "App" in soothing cyan-teal (#62A4AC)
        */}
        <div className={`font-serif font-extrabold tracking-tight leading-none ${currentSize.text} flex items-baseline`}>
          <span className="text-[#154E48]">Thera</span>
          <span className="text-[#62A4AC]">App</span>
        </div>
      </div>

      {showTagline && (
        <span className="text-[11px] text-stone-500 font-medium tracking-tight mt-1">
          Rewire your mind, one thought at a time.
        </span>
      )}
    </div>
  );
};
