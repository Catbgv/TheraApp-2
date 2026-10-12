import React, { useState } from 'react';
import { Logo } from './Logo';
import { ReflectionTakeaway } from '../types';
import { useLanguage } from '../i18n';
import {
  Sparkles,
  ArrowRight,
  Wind,
  Compass,
  RotateCcw,
  Pencil,
} from 'lucide-react';

interface HomeViewProps {
  userName: string;
  onEditName: () => void;
  onStartEntry: () => void;
  hasActiveSession?: boolean;
  hasUnsubmittedDraft?: boolean;
  onResumeSession?: () => void;
  onResumeDraft?: () => void;
  onDiscardDraft?: () => void;
  recentTakeaway: ReflectionTakeaway | null;
  onOpenHomework: () => void;
  onOpenBreathe: () => void;
  onOpenDistortions: () => void;
  onOpenOnboarding: () => void;
  onViewJournalHistory?: () => void;
}

// Diverse CBT affirmations designed to rewire negative core beliefs
const CBT_AFFIRMATIONS_EN: string[] = [
  'My worth is inherent; it does not depend on being flawless.',
  'Feelings are real signals, but they are not permanent facts.',
  'I can experience discomfort and still take one gentle step forward.',
  'Other people’s moods are their responsibility, not my failure.',
  'Making a mistake is proof of learning, not a defect of character.',
  'I don’t need to control everything to be safe.',
  'I am worthy of kindness and patience, especially from myself.',
  'I am allowed to take up space, have boundaries, and rest.',
  'My well-being is under my control, one thought at a time.',
  'I have survived 100% of my hardest moments so far.',
  'I separate who I am from temporary thoughts passing through my mind.',
  'I do not have to believe every automatic negative thought I think.',
  'I am enough, exactly as I am right now.',
];

const CBT_AFFIRMATIONS_ES: string[] = [
  'Mi valor es intrínseco; no depende de ser impecable.',
  'Las emociones son señales reales, pero no son hechos permanentes.',
  'Puedo sentir incomodidad y aun así dar un paso adelante con gentileza.',
  'El estado de ánimo de los demás es su responsabilidad, no mi fracaso.',
  'Cometer un error es prueba de aprendizaje, no un defecto de carácter.',
  'No necesito controlarlo todo para estar a salvo.',
  'Merezco bondad y paciencia, especialmente de mí mismo.',
  'Tengo derecho a ocupar espacio, poner límites y descansar.',
  'Mi bienestar está bajo mi control, un pensamiento a la vez.',
  'He superado el 100% de mis momentos más difíciles hasta ahora.',
  'Separo quién soy de los pensamientos pasajeros de mi mente.',
  'No tengo que creer cada pensamiento negativo automático que tengo.',
  'Soy suficiente, exactamente como soy ahora mismo.',
];

export const HomeView: React.FC<HomeViewProps> = ({
  userName,
  onEditName,
  onStartEntry,
  hasActiveSession = false,
  hasUnsubmittedDraft,
  onResumeSession,
  onResumeDraft,
  onDiscardDraft,
  recentTakeaway,
  onOpenBreathe,
  onOpenDistortions,
  onOpenOnboarding,
  onViewJournalHistory,
}) => {
  const { t, isSpanish } = useLanguage();
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  const isResumable = Boolean(hasUnsubmittedDraft ?? hasActiveSession);
  const handleResume = onResumeDraft || onResumeSession || onStartEntry;

  const affirmations = isSpanish ? CBT_AFFIRMATIONS_ES : CBT_AFFIRMATIONS_EN;
  const currentAffirmation = affirmations[affirmationIndex % affirmations.length];

  const handleNextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % affirmations.length);
  };

  return (
    <div className="max-w-xl mx-auto pb-28 pt-2 space-y-6 relative z-10">
      {/* Top Greeting & Seamless CBT Affirmation */}
      <div className="space-y-2 text-center">
        {userName ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5">
            <div className="flex items-center gap-1.5">
              <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-900 tracking-tight">
                {isSpanish ? `¡Hola, ${userName}!` : `Hello, ${userName}!`}
              </h1>
              <button
                type="button"
                onClick={onEditName}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                title={isSpanish ? 'Editar tu nombre' : 'Edit your name'}
                aria-label="Edit your name"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-[#154E48] bg-stone-100/90 hover:bg-[#E8F8F5] px-2.5 py-0.5 rounded-full border border-stone-200/80 transition-colors cursor-pointer"
              title={isSpanish ? 'Ver guía y recorrido' : 'View Onboarding Tour'}
            >
              <Sparkles className="w-3 h-3 text-[#34A895]" />
              <span>{t.navGuide}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5">
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-900 tracking-tight">
              {isSpanish ? '¡Hola!' : 'Hello!'}
            </h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onEditName}
                className="inline-flex items-center gap-1.5 text-xs text-[#154E48] hover:text-[#0F3B36] bg-[#E8F8F5] hover:bg-[#D5F2EC] px-3.5 py-1 rounded-full font-bold transition-colors cursor-pointer border border-[#BDE7E1]"
              >
                <Sparkles className="w-3 h-3 text-[#34A895]" />
                <span>{isSpanish ? 'Configura tu nombre' : 'Set your name'}</span>
              </button>
              <button
                type="button"
                onClick={onOpenOnboarding}
                className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1 rounded-full font-bold transition-colors cursor-pointer border border-stone-200"
                title="View Onboarding Tour"
              >
                <Compass className="w-3 h-3 text-[#34A895]" />
                <span>{t.navGuide}</span>
              </button>
            </div>
          </div>
        )}

        {/* Seamless CBT Affirmation */}
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto px-4 py-1">
          <p className="text-sm sm:text-base font-serif font-bold text-stone-700 leading-snug italic transition-all duration-300">
            "{currentAffirmation}"
          </p>
          <button
            type="button"
            onClick={handleNextAffirmation}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
            title={isSpanish ? 'Siguiente afirmación' : 'Next CBT affirmation'}
            aria-label="Next CBT affirmation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Centerpiece: Glowing Floating Orb Button with Logo */}
      <div className="py-2 flex flex-col items-center justify-center text-center">
        <div className="relative flex items-center justify-center">
          {/* Animated concentric soft gradient rings */}
          <div className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-[#E5F5F3]/70 blur-xl animate-pulse pointer-events-none" />
          <div className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-[#C7ECE7]/40 blur-md pointer-events-none" />

          {/* Central Orb Button */}
          <button
            type="button"
            onClick={isResumable ? handleResume : onStartEntry}
            className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-white via-[#F4FBF9] to-[#E3F4F1] border-4 border-[#7FB8BD]/40 shadow-xl flex items-center justify-center p-3 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer animate-orb-glow"
            title={isResumable ? (isSpanish ? 'Reanudar borrador' : 'Resume unsubmitted draft entry') : (isSpanish ? 'Toca para reflexionar' : 'Tap to initiate reflection')}
            aria-label={isResumable ? 'Resume unsubmitted draft entry' : 'Initiate new reflection entry'}
          >
            {/* Soft inner ring with centered branding */}
            <div className="w-38 h-38 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-white/95 to-[#E1F5F2]/80 flex flex-col items-center justify-center shadow-inner px-2">
              <Logo size="orb" />
              <span className="text-[11px] sm:text-xs font-extrabold text-[#154E48] tracking-widest uppercase mt-2">
                {isResumable ? (isSpanish ? 'Reanudar Borrador' : 'Resume Draft') : (isSpanish ? 'Toca para Reflexionar' : 'Tap to Reflect')}
              </span>
            </div>
          </button>
        </div>

        <div className="mt-3.5 space-y-1">
          <span className="text-xs sm:text-sm font-bold text-stone-800 block">
            {isResumable
              ? (isSpanish ? 'Borrador sin enviar en progreso' : 'Unsubmitted draft in progress')
              : (isSpanish ? 'Inicia una reflexión estructurada' : 'Initiate a structured reflection')}
          </span>
          <p className="text-xs text-stone-500 font-medium">
            {isResumable
              ? (isSpanish ? 'Tienes una reflexión pendiente. Toca arriba para continuarla.' : 'You have an unsubmitted reflection. Tap above to resume it.')
              : (isSpanish ? 'Separa hechos de pensamientos, emociones e impulsos' : 'Separate facts from thoughts, emotions, and urges')}
          </p>

          {isResumable && onDiscardDraft && (
            <div className="pt-0.5">
              <button
                type="button"
                onClick={onDiscardDraft}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
              >
                {isSpanish ? 'Descartar Borrador e Iniciar de Nuevo' : 'Discard Draft & Start Clean'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Breath Work Rectangle (Full-Width Card) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onOpenBreathe}
          className="w-full p-4 sm:p-5 rounded-2xl bg-white/90 border border-stone-200/80 shadow-2xs hover:shadow-xs transition-all hover:border-[#7FB8BD] text-left cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#E8F8F5] text-[#154E48] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900">
                {t.homeBreathWork}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {t.homeBreathSub} · {isSpanish ? 'Regulación del sistema nervioso' : 'Nervous system regulation'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] font-extrabold text-[#154E48] bg-[#E8F8F5] px-2.5 py-1 rounded-full border border-[#BDE7E1]">
              6s · 4s
            </span>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>
      </div>

      {/* Active takeaway highlight if exists */}
      {recentTakeaway && (
        <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-2xs text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#154E48] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#34A895]" />
              {isSpanish ? 'Último Reencuadre y Conclusiones' : 'Recent Reframe Takeaway'}
            </span>
            {onViewJournalHistory && (
              <button
                type="button"
                onClick={onViewJournalHistory}
                className="text-[11px] font-bold text-stone-500 hover:text-stone-800 flex items-center gap-0.5 cursor-pointer"
              >
                <span>{isSpanish ? 'Ver Archivo' : 'View Archive'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm font-serif font-bold text-stone-900 leading-snug">
            "{recentTakeaway.balancedPerspective}"
          </p>
        </div>
      )}
    </div>
  );
};

