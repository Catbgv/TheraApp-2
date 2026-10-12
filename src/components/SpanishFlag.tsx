import React from 'react';

interface SpanishFlagProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}

export const SpanishFlag: React.FC<SpanishFlagProps> = ({
  className = '',
  size = 'sm',
}) => {
  const sizeClasses = {
    xs: 'w-4 h-3',
    sm: 'w-5 h-3.5',
    md: 'w-6 h-4',
  };

  return (
    <span
      className={`inline-block relative overflow-hidden rounded-[3px] shadow-2xs border border-black/10 shrink-0 ${sizeClasses[size]} ${className}`}
      title="Bandera de España (Español)"
      aria-label="Spanish Flag"
    >
      <svg
        viewBox="0 0 750 500"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top red stripe (1/4 height = 125px) */}
        <rect width="750" height="125" fill="#AA151B" />
        {/* Middle yellow stripe (1/2 height = 250px) */}
        <rect y="125" width="750" height="250" fill="#F1BF00" />
        {/* Bottom red stripe (1/4 height = 125px) */}
        <rect y="375" width="750" height="125" fill="#AA151B" />
        {/* Simplified Spanish Coat of Arms on the hoist side */}
        <g transform="translate(180, 200) scale(0.65)">
          {/* Crown */}
          <path
            d="M -35 -40 L -25 -25 L -10 -40 L 0 -22 L 10 -40 L 25 -25 L 35 -40 L 30 -15 L -30 -15 Z"
            fill="#AA151B"
            stroke="#901015"
            strokeWidth="3"
          />
          <circle cx="-35" cy="-42" r="4" fill="#F1BF00" />
          <circle cx="-10" cy="-42" r="4" fill="#F1BF00" />
          <circle cx="10" cy="-42" r="4" fill="#F1BF00" />
          <circle cx="35" cy="-42" r="4" fill="#F1BF00" />
          <circle cx="0" cy="-52" r="5" fill="#F1BF00" />
          {/* Shield */}
          <path
            d="M -30 -12 L 30 -12 L 30 25 C 30 55 0 70 0 70 C 0 70 -30 55 -30 25 Z"
            fill="#AA151B"
            stroke="#7F1015"
            strokeWidth="4"
          />
          {/* Shield quarters */}
          <path
            d="M -26 -8 L -2 -8 L -2 24 L -26 24 Z"
            fill="#AA151B"
          />
          <path
            d="M 2 -8 L 26 -8 L 26 24 L 2 24 Z"
            fill="#F1BF00"
          />
          <path
            d="M -26 28 L -2 28 L -2 46 C -12 44 -20 38 -26 30 Z"
            fill="#F1BF00"
          />
          <path
            d="M 2 28 L 26 28 C 20 38 12 44 2 46 Z"
            fill="#AA151B"
          />
          {/* Pillars of Hercules left & right */}
          <rect x="-48" y="-15" width="8" height="75" rx="3" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
          <rect x="40" y="-15" width="8" height="75" rx="3" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
        </g>
      </svg>
    </span>
  );
};
