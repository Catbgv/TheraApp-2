import React from 'react';

interface USFlagProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}

export const USFlag: React.FC<USFlagProps> = ({
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
      title="Flag of the United States (English)"
      aria-label="US Flag"
    >
      <svg
        viewBox="0 0 741 390"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 13 Stripes: 7 red, 6 white */}
        <rect width="741" height="390" fill="#B22234" />
        <rect y="30" width="741" height="30" fill="#FFFFFF" />
        <rect y="90" width="741" height="30" fill="#FFFFFF" />
        <rect y="150" width="741" height="30" fill="#FFFFFF" />
        <rect y="210" width="741" height="30" fill="#FFFFFF" />
        <rect y="270" width="741" height="30" fill="#FFFFFF" />
        <rect y="330" width="741" height="30" fill="#FFFFFF" />
        {/* Blue Canton */}
        <rect width="296" height="210" fill="#3C3B6E" />
        {/* Stars representation */}
        <g fill="#FFFFFF" opacity="0.95">
          <circle cx="30" cy="25" r="7" />
          <circle cx="80" cy="25" r="7" />
          <circle cx="130" cy="25" r="7" />
          <circle cx="180" cy="25" r="7" />
          <circle cx="230" cy="25" r="7" />
          <circle cx="266" cy="25" r="7" />

          <circle cx="55" cy="55" r="7" />
          <circle cx="105" cy="55" r="7" />
          <circle cx="155" cy="55" r="7" />
          <circle cx="205" cy="55" r="7" />
          <circle cx="250" cy="55" r="7" />

          <circle cx="30" cy="85" r="7" />
          <circle cx="80" cy="85" r="7" />
          <circle cx="130" cy="85" r="7" />
          <circle cx="180" cy="85" r="7" />
          <circle cx="230" cy="85" r="7" />
          <circle cx="266" cy="85" r="7" />

          <circle cx="55" cy="115" r="7" />
          <circle cx="105" cy="115" r="7" />
          <circle cx="155" cy="115" r="7" />
          <circle cx="205" cy="115" r="7" />
          <circle cx="250" cy="115" r="7" />

          <circle cx="30" cy="145" r="7" />
          <circle cx="80" cy="145" r="7" />
          <circle cx="130" cy="145" r="7" />
          <circle cx="180" cy="145" r="7" />
          <circle cx="230" cy="145" r="7" />
          <circle cx="266" cy="145" r="7" />

          <circle cx="55" cy="175" r="7" />
          <circle cx="105" cy="175" r="7" />
          <circle cx="155" cy="175" r="7" />
          <circle cx="205" cy="175" r="7" />
          <circle cx="250" cy="175" r="7" />
        </g>
      </svg>
    </span>
  );
};
