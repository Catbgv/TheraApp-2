import React from 'react';
import {
  X,
  Trophy,
  Wind,
  BookOpen,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { TEN_COGNITIVE_DISTORTIONS } from './DistortionIcons';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBreathwork?: () => void;
  onOpenDistortionMap?: () => void;
  onOpenJournal?: () => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  onOpenBreathwork,
  onOpenDistortionMap,
  onOpenJournal,
}) => {
  if (!isOpen) return null;

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
  // Get Monday of current week
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
  const distanceToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const daysLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const weeklyBreathDays = daysLabels.map((label, idx) => {
    const targetDay = new Date(monday);
    targetDay.setDate(monday.getDate() + idx);
    const dateStr = targetDay.toISOString().split('T')[0];
    const isToday = targetDay.toDateString() === now.toDateString();
    const isPastOrToday = targetDay <= now;

    // Check if any breath session was recorded on this date
    const hasBreath = breathTimestamps.some((ts) => ts.startsWith(dateStr));

    return {
      day: label,
      date: targetDay.getDate(),
      completed: hasBreath,
      isToday,
      isPastOrToday,
    };
  });

  const weeklyBreathCount = weeklyBreathDays.filter((d) => d.completed).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-amber-50/70 to-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-amber-200 text-amber-700 flex items-center justify-center shadow-xs">
              <Trophy className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800">
                Weekly Mastery Tracker
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-extrabold text-stone-900 leading-snug">
                Your Healing Progress
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200/70 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto text-left">
          {/* 1. Daily Breath Completed During the Week */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F4FBF9] border border-[#CCE8E4] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-[#154E48]" />
                <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                  Daily Breathwork (This Week)
                </h4>
              </div>
              <span className="text-xs font-extrabold text-[#154E48] bg-white px-2.5 py-0.5 rounded-full border border-[#CCE8E4]">
                {weeklyBreathCount}/7 Days
              </span>
            </div>

            {/* 7 Days of the Week Visual Badges */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1 text-center">
              {weeklyBreathDays.map((d, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all ${
                    d.completed
                      ? 'bg-[#154E48] text-white border-[#154E48] shadow-xs'
                      : d.isToday
                      ? 'bg-white border-[#154E48] text-[#154E48] ring-2 ring-[#154E48]/20'
                      : 'bg-white/80 border-stone-200 text-stone-500'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">{d.day}</span>
                  <span className="text-xs font-extrabold my-0.5">{d.date}</span>
                  <div className="mt-0.5">
                    {d.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    ) : (
                      <span className="block w-2 h-2 rounded-full bg-stone-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-stone-600 font-medium">
                {weeklyBreathCount >= 4
                  ? '🌟 Strong vagal tone! Consistent pacing calms baseline anxiety.'
                  : 'Practice 4s In · 6s Out for 3 minutes daily to sync heart rate variability.'}
              </p>
              {onOpenBreathwork && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBreathwork();
                  }}
                  className="text-xs font-bold text-[#154E48] hover:underline whitespace-nowrap ml-2 cursor-pointer"
                >
                  Breathe Now →
                </button>
              )}
            </div>
          </div>

          {/* 2. CBT Logs / Reflections */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-stone-700" />
                <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                  CBT Reflections & Logs
                </h4>
              </div>
              <span className="text-xs font-extrabold text-stone-800 bg-white px-2.5 py-0.5 rounded-full border border-stone-200">
                {takeawaysCount} Completed
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-stone-800">
                  Structured Thought Records
                </span>
                <p className="text-[11px] text-stone-500">
                  Separating objective events from automatic negative thoughts & emotions.
                </p>
              </div>
              <div className="text-right pl-3">
                <span className="text-xl font-serif font-extrabold text-[#154E48]">
                  {takeawaysCount}
                </span>
                <span className="text-[10px] text-stone-400 block font-medium">Logs</span>
              </div>
            </div>

            {onOpenJournal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenJournal();
                }}
                className="text-xs font-bold text-[#154E48] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 3. Cognitive Distortion Concepts Covered */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-800" />
                <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                  Cognitive Distortions Covered
                </h4>
              </div>
              <span className="text-xs font-extrabold text-amber-900 bg-white px-2.5 py-0.5 rounded-full border border-amber-200">
                {scoutedDistortionIds.length} / 10 Mastered
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(scoutedDistortionIds.length / 10) * 100}%`,
                }}
              />
            </div>

            {/* Mini landmarks preview */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {TEN_COGNITIVE_DISTORTIONS.map((d) => {
                const isScouted = scoutedDistortionIds.includes(d.id);
                return (
                  <span
                    key={d.id}
                    className={`inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-lg border font-semibold ${
                      isScouted
                        ? 'bg-white text-stone-800 border-amber-300 shadow-2xs'
                        : 'bg-stone-100 text-stone-400 border-stone-200 line-through opacity-60'
                    }`}
                  >
                    <span>{d.gameEmoji}</span>
                    <span>{d.name}</span>
                  </span>
                );
              })}
            </div>

            {onOpenDistortionMap && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDistortionMap();
                }}
                className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1 cursor-pointer pt-1"
              >
                <span>Open Cognitive Distortions Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 flex justify-end bg-stone-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
