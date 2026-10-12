import React from 'react';
import { useLanguage } from '../i18n';
import { SpanishFlag } from './SpanishFlag';
import { USFlag } from './USFlag';

interface LanguageToggleProps {
  className?: string;
  variant?: 'segmented' | 'button';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = '',
  variant = 'segmented',
}) => {
  const { language, setLanguage, toggleLanguage, isSpanish } = useLanguage();

  if (variant === 'button') {
    // Single button mode showing current language with one-tap toggle
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer min-h-[38px] select-none ${
          isSpanish
            ? 'bg-[#AA151B]/10 hover:bg-[#AA151B]/15 border-[#AA151B]/30 text-[#8B0E14]'
            : 'bg-white/95 hover:bg-white border-stone-200 text-stone-800 shadow-2xs'
        } ${className}`}
        title={isSpanish ? 'Actualmente en Español. Toca para cambiar a Inglés' : 'Currently in English. Tap to switch to Spanish'}
        aria-label={isSpanish ? 'Switch to English' : 'Switch to Spanish'}
      >
        {isSpanish ? (
          <>
            <SpanishFlag size="sm" className="group-hover:scale-105 transition-transform" />
            <span className="text-xs font-extrabold tracking-wide font-mono">ES</span>
            <span className="text-[10px] text-stone-500 font-sans">⇄ EN</span>
          </>
        ) : (
          <>
            <USFlag size="sm" className="group-hover:scale-105 transition-transform" />
            <span className="text-xs font-extrabold tracking-wide font-mono">EN</span>
            <span className="text-[10px] text-stone-500 font-sans">⇄ ES</span>
          </>
        )}
      </button>
    );
  }

  // Segmented control: shows both US/EN and ES flags clearly with active state
  return (
    <div
      className={`inline-flex items-center bg-stone-100/90 p-1 rounded-xl border border-stone-200/90 shadow-2xs select-none gap-0.5 ${className}`}
      role="group"
      aria-label="Language Selector"
    >
      {/* English (EN) Option with US Flag */}
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer min-h-[32px] ${
          language === 'en'
            ? 'bg-white text-stone-900 shadow-xs border border-stone-200/90 font-extrabold'
            : 'text-stone-500 hover:text-stone-800 opacity-70 hover:opacity-100'
        }`}
        title="View in English (United States)"
        aria-pressed={language === 'en'}
      >
        <USFlag size="sm" />
        <span className="font-mono text-[11px] font-bold">EN</span>
      </button>

      {/* Spanish (ES) Option with Spanish Flag */}
      <button
        type="button"
        onClick={() => setLanguage('es')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer min-h-[32px] ${
          language === 'es'
            ? 'bg-white text-[#8B0E14] shadow-xs border border-[#AA151B]/30 font-extrabold'
            : 'text-stone-500 hover:text-stone-800 opacity-70 hover:opacity-100'
        }`}
        title="Ver en Español"
        aria-pressed={language === 'es'}
      >
        <SpanishFlag size="sm" />
        <span className="font-mono text-[11px] font-bold">ES</span>
      </button>
    </div>
  );
};
