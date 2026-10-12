import React from 'react';
import { Logo } from './Logo';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../i18n';
import {
  Archive,
  Compass,
  LifeBuoy,
  Home,
  Trophy,
  Plus,
  Sparkles,
} from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenSafety: () => void;
  onOpenBreathe: () => void;
  onOpenOnboarding: () => void;
  onCenterLogoClick: () => void;
  onNewEntry: () => void;
  hasActiveSession?: boolean;
  hasHomework?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenSafety,
  onOpenBreathe,
  onOpenOnboarding,
  onCenterLogoClick,
  onNewEntry,
  hasActiveSession = false,
  hasHomework = false,
}) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
          {/* 
            Brand Logo in Header -> Starts a NEW JOURNAL ENTRY
          */}
          <button
            type="button"
            onClick={onNewEntry}
            className="cursor-pointer text-left focus-visible:outline-none hover:opacity-85 transition-opacity flex items-center gap-1.5 group shrink-0"
            title="Tap logo to start a new reflection journal entry"
            aria-label="Start new journal reflection entry"
          >
            <Logo size="sm" />
            <span className="hidden md:inline-flex items-center gap-1 text-[10.5px] font-extrabold uppercase tracking-wider text-[#154E48] bg-[#E8F8F5] px-2.5 py-0.5 rounded-full border border-[#BDE7E1]">
              <Plus className="w-3 h-3 text-[#34A895]" />
              <span>{t.navNewEntry}</span>
            </span>
          </button>

          {/* Top Right Actions: Spanish Flag Toggle, Onboarding Guide & Safety Support */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Spanish Flag Language Switcher */}
            <LanguageToggle />

            {/* Onboarding Guide / Tour Button */}
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-[#154E48] bg-[#E8F8F5] hover:bg-[#D5F2EC] border border-[#BDE7E1] rounded-xl transition-colors cursor-pointer min-h-[38px] shadow-2xs"
              title="View Onboarding Tour & Guide"
              aria-label="View Onboarding Tour"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#34A895]" />
              <span className="hidden xs:inline">{t.navGuide}</span>
            </button>

            {/* Safety Support */}
            <button
              type="button"
              onClick={onOpenSafety}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer min-h-[38px]"
              title="Crisis Support & Help"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden xs:inline">{t.navSupport}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Bottom Navigation Bar with Home & Progress */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 pb-safe shadow-lg"
        aria-label="TheraApp Navigation"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1 relative">
          {/* Tab 1: HOME */}
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer relative ${
              currentTab === 'home' ? 'text-[#154E48]' : 'text-stone-400 hover:text-stone-600'
            }`}
            title={t.navHome}
            aria-label={t.navHome}
          >
            <Home className={`w-5 h-5 transition-transform ${currentTab === 'home' ? 'scale-110' : ''}`} />
            <span className={`text-[10px] tracking-tight mt-1 ${currentTab === 'home' ? 'font-extrabold' : 'font-medium'}`}>
              {t.navHome}
            </span>
            {currentTab === 'home' && (
              <span className="absolute bottom-1 w-4 h-0.5 rounded-full bg-[#154E48]" />
            )}
          </button>

          {/* Tab 2: JOURNAL HISTORY */}
          <button
            type="button"
            onClick={() => onSelectTab('journal')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer relative ${
              currentTab === 'journal' ? 'text-[#154E48]' : 'text-stone-400 hover:text-stone-600'
            }`}
            title={t.navJournal}
            aria-label={t.navJournal}
          >
            <Archive className={`w-5 h-5 transition-transform ${currentTab === 'journal' ? 'scale-110' : ''}`} />
            <span className={`text-[10px] tracking-tight mt-1 ${currentTab === 'journal' ? 'font-extrabold' : 'font-medium'}`}>
              {t.navJournal}
            </span>
            {currentTab === 'journal' && (
              <span className="absolute bottom-1 w-4 h-0.5 rounded-full bg-[#154E48]" />
            )}
          </button>

          {/* Center Floating Action Button: Logo -> Starts New Reflection Entry */}
          <div className="flex justify-center -mt-5">
            <button
              type="button"
              onClick={onNewEntry}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-white via-[#EBF6F6] to-[#D5EEF0] border-2 border-[#7FB8BD] shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative group"
              title="Start New Reflection Journal Entry"
              aria-label="Start New Journal Entry"
            >
              {/* Inner subtle glow */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-xs">
                {/* TheraApp 3-Heads Emblem */}
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-2xs"
                >
                  <path
                    d="M 34 88 C 35 74 30 63 28 50 C 26 34 35 16 56 16 C 72 16 83 26 87 40 C 88 43 87 46 85 48 C 88 49 93 51 95 53 C 98 56 97 58 94 59 C 90 61 87 61 87 63 C 88 64 90 66 91 67 C 92 68 91 70 89 71 C 87 72 86 74 87 76 C 88 78 86 81 82 82 C 78 84 73 85 70 87 C 68 88 67 89 67 90 C 66 84 64 78 62 74 C 61 71 58 69 56 68 C 60 66 62 63 61 60 C 59 58 57 57 56 56 C 57 54 59 53 58 50 C 56 48 54 47 52 46 C 54 44 55 41 53 38 C 50 34 45 32 41 33 C 33 35 30 48 32 62 C 33 72 34 81 34 88 Z"
                    fill="#62A4AC"
                  />
                  <path
                    d="M 40 88 C 41 76 36 65 34 54 C 32 40 40 24 58 24 C 72 24 80 33 83 45 C 84 48 83 50 81 52 C 84 54 88 55 89 57 C 91 60 90 61 87 63 C 84 64 82 64 82 66 C 83 67 85 68 86 70 C 87 71 86 73 83 74 C 81 75 80 77 81 79 C 82 80 80 83 77 84 C 73 85 69 86 66 87 C 65 88 64 89 64 90 C 62 83 60 78 58 74 C 56 71 54 69 52 68 C 56 66 57 63 56 60 C 55 58 53 57 52 56 C 53 54 55 52 54 49 C 52 47 50 46 49 45 C 50 43 51 40 49 38 C 47 35 43 33 40 34 C 35 36 33 46 36 57 C 38 66 39 77 40 88 Z"
                    fill="#A0D2D7"
                  />
                  <path
                    d="M 47 88 C 48 80 44 72 42 63 C 40 51 46 37 60 37 C 71 37 77 44 79 53 C 80 55 79 57 77 58 C 80 60 83 61 84 63 C 85 65 84 66 81 67 C 78 68 77 69 77 70 C 78 71 79 72 80 73 C 81 74 80 76 77 77 C 75 78 74 80 75 82 C 76 83 74 85 71 86 C 68 87 65 88 63 89 C 62 90 61 90 61 90 L 47 88 Z"
                    fill="#FFFFFF"
                  />
                </svg>
              </div>

              {/* Notification dot if homework is available */}
              {hasHomework && (
                <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
              )}
            </button>
          </div>

          {/* Tab 4: Cognitive Distortions Map */}
          <button
            type="button"
            onClick={() => onSelectTab('distortions')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer relative ${
              currentTab === 'distortions' ? 'text-[#154E48]' : 'text-stone-400 hover:text-stone-600'
            }`}
            title={t.navDistortions}
            aria-label={t.navDistortions}
          >
            <Compass className={`w-5 h-5 transition-transform ${currentTab === 'distortions' ? 'scale-110' : ''}`} />
            <span className={`text-[10px] tracking-tight mt-1 ${currentTab === 'distortions' ? 'font-extrabold' : 'font-medium'}`}>
              {t.navDistortions}
            </span>
            {currentTab === 'distortions' && (
              <span className="absolute bottom-1 w-4 h-0.5 rounded-full bg-[#154E48]" />
            )}
          </button>

          {/* Tab 5: PROGRESS */}
          <button
            type="button"
            onClick={() => onSelectTab('progress')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer relative ${
              currentTab === 'progress' ? 'text-[#154E48]' : 'text-stone-400 hover:text-stone-600'
            }`}
            title={t.navProgress}
            aria-label={t.navProgress}
          >
            <Trophy className={`w-5 h-5 transition-transform ${currentTab === 'progress' ? 'scale-110 text-amber-600' : ''}`} />
            <span className={`text-[10px] tracking-tight mt-1 ${currentTab === 'progress' ? 'font-extrabold text-[#154E48]' : 'font-medium'}`}>
              {t.navProgress}
            </span>
            {currentTab === 'progress' && (
              <span className="absolute bottom-1 w-4 h-0.5 rounded-full bg-[#154E48]" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};

