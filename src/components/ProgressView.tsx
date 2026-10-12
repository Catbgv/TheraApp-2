import React from 'react';
import { useLanguage } from '../i18n';
import {
  Trophy,
  Wind,
  BookOpen,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { TEN_COGNITIVE_DISTORTIONS } from './DistortionIcons';

interface ProgressViewProps {
  onOpenBreathwork?: () => void;
  onOpenDistortionMap?: () => void;
  onOpenJournal?: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  onOpenBreathwork,
  onOpenDistortionMap,
  onOpenJournal,
}) => {
  const { t, isSpanish } = useLanguage();
  // Retrieve breath sessions from localStorage
  let breathTimestamps: string[] = [];
  try {
    const raw = localStorage.getItem('thera_breath_sessions_v1');
    if (raw) breathTimestamps = JSON.parse(raw);
  } catch {}

  // Retrieve CBT journal takeaways from localStorage
  let takeawaysCount = 0;
  try {
    const raw = localStorage.getItem('thera_takeaways_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      takeawaysCount = Array.isArray(parsed) ? parsed.length : 0;
    }
  } catch {}

  // Retrieve scouted distortion landmarks
  let scoutedDistortionIds: string[] = ['all-or-nothing'];
  try {
    const raw = localStorage.getItem('thera_scouted_distortions');
    if (raw) scoutedDistortionIds = JSON.parse(raw);
  } catch {}

  // Calculate day-of-week completions for the current week (Monday to Sunday)
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
  const distanceToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const daysLabels = t.progressDays;

  const weeklyBreathDays = daysLabels.map((label, idx) => {
    const targetDay = new Date(monday);
    targetDay.setDate(monday.getDate() + idx);
    const dateStr = targetDay.toISOString().split('T')[0];
    const isToday = targetDay.toDateString() === now.toDateString();

    const hasBreath = breathTimestamps.some((ts) => ts.startsWith(dateStr));

    return {
      day: label,
      date: targetDay.getDate(),
      completed: hasBreath,
      isToday,
    };
  });

  const weeklyBreathCount = weeklyBreathDays.filter((d) => d.completed).length;

  return (
    <div className="max-w-2xl mx-auto pb-28 space-y-6 pt-2">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-300 bg-amber-50/90 text-amber-900 text-xs font-extrabold tracking-wider uppercase shadow-2xs mx-auto">
          <Trophy className="w-3.5 h-3.5 text-amber-700" />
          <span>{t.progressMastery}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-900 tracking-tight">
          {t.progressTitle}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed font-medium">
          {t.progressSubtitle}
        </p>
      </div>

      {/* 1. Daily Breathwork Completed During the Week */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4 text-left">
        <div className="flex items-center justify-between pb-1 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E8F8F5] text-[#154E48] flex items-center justify-center">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900">
                {t.progressDailyBreath}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {t.progressBreathSub}
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-[#154E48] bg-[#EBF6F4] px-3 py-1 rounded-full border border-[#CCE8E4]">
            {weeklyBreathCount} / {isSpanish ? '7 Días' : '7 Days'}
          </span>
        </div>

        {/* 7 Days of the Week Visual Cards */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1 text-center">
          {weeklyBreathDays.map((d, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl border transition-all ${
                d.completed
                  ? 'bg-[#154E48] text-white border-[#154E48] shadow-xs scale-102'
                  : d.isToday
                  ? 'bg-white border-[#154E48] text-[#154E48] ring-2 ring-[#154E48]/20'
                  : 'bg-stone-50 border-stone-200 text-stone-400'
              }`}
            >
              <span className="text-[10px] font-bold uppercase">{d.day}</span>
              <span className="text-sm font-extrabold my-0.5">{d.date}</span>
              <div className="mt-1">
                {d.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                ) : (
                  <span className="block w-2 h-2 rounded-full bg-stone-300" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-100">
          <p className="text-xs text-stone-600 font-medium leading-relaxed">
            {weeklyBreathCount >= 4
              ? '🌟 Excellent consistency! You are actively building baseline vagal resilience.'
              : 'Aim for 3 minutes daily to sync heart rate variability and calm your baseline response.'}
          </p>
          {onOpenBreathwork && (
            <button
              type="button"
              onClick={onOpenBreathwork}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#154E48] hover:text-[#0F3B36] hover:underline cursor-pointer whitespace-nowrap self-end sm:self-auto"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. CBT Reflections & Thought Logs */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4 text-left">
        <div className="flex items-center justify-between pb-1 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900">
                CBT Thought Records & Logs
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Separating events from automatic thoughts & emotions
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-stone-900 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
            {takeawaysCount} Completed
          </span>
        </div>

        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-stone-900">
              Structured Therapy Sessions
            </h4>
            <p className="text-xs text-stone-600 max-w-sm">
              Each log validates your core emotions, spots distorted assumptions, and produces a balanced reframe takeaway.
            </p>
          </div>
          <div className="text-right pl-4">
            <span className="text-3xl font-serif font-extrabold text-[#154E48]">
              {takeawaysCount}
            </span>
            <span className="text-[11px] text-stone-400 block font-semibold">Total Logs</span>
          </div>
        </div>

        {onOpenJournal && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onOpenJournal}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#154E48] hover:text-[#0F3B36] hover:underline cursor-pointer"
            >
              <span>{isSpanish ? 'Ver Archivo' : 'View Archive'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 3. Cognitive Distortion Concepts Covered */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4 text-left">
        <div className="flex items-center justify-between pb-1 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900">
                Cognitive Distortion Concepts Covered
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Scouted on the Cognitive Distortions Map
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            {scoutedDistortionIds.length} / 10 Mastered
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600">
            <span>Expedition Discovery</span>
            <span>{Math.round((scoutedDistortionIds.length / 10) * 100)}%</span>
          </div>
          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${(scoutedDistortionIds.length / 10) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Landmarks Pills with Clinical Terms */}
        <div className="flex flex-wrap gap-2 pt-1">
          {TEN_COGNITIVE_DISTORTIONS.map((d) => {
            const isScouted = scoutedDistortionIds.includes(d.id);
            return (
              <span
                key={d.id}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl border font-bold transition-all ${
                  isScouted
                    ? 'bg-amber-50/80 text-amber-950 border-amber-300 shadow-2xs'
                    : 'bg-stone-50 text-stone-400 border-stone-200 opacity-60'
                }`}
                title={`${d.name} (${d.gameLandmark})`}
              >
                <span>{d.gameEmoji}</span>
                <span>{d.name}</span>
                <span className="text-[10px] opacity-75 font-normal">
                  • {d.gameLandmark}
                </span>
                {isScouted && <span className="text-emerald-700 text-[10px]">✓</span>}
              </span>
            );
          })}
        </div>

        {onOpenDistortionMap && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onOpenDistortionMap}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-900 hover:text-amber-950 hover:underline cursor-pointer"
            >
              <span>Explore Map to Scout More Thinking Traps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
