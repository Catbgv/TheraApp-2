import React from 'react';
import { ReflectionTakeaway } from '../types';
import {
  CheckCircle2,
  Circle,
  X,
  Sparkles,
  ClipboardList,
  Compass,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface HomeworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentTakeaway: ReflectionTakeaway | null;
  onUpdateWorkPlan: (itemId: string, completed: boolean) => void;
  onStartNewEntry: () => void;
}

export const HomeworkModal: React.FC<HomeworkModalProps> = ({
  isOpen,
  onClose,
  recentTakeaway,
  onUpdateWorkPlan,
  onStartNewEntry,
}) => {
  if (!isOpen) return null;

  const hasTakeaway = Boolean(recentTakeaway && recentTakeaway.workPlan.length > 0);
  const completedCount = hasTakeaway
    ? recentTakeaway!.workPlan.filter((w) => w.completed).length
    : 0;

  const handleClose = () => {
    if (!hasTakeaway) {
      try {
        sessionStorage.setItem('thera_empty_hw_shown_v1', 'true');
      } catch (e) {}
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-7 shadow-2xl border border-stone-200/90 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E8F3F3] text-[#2C6E72] flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-stone-900">
                Your Work Plan
              </h3>
              <p className="text-[11px] text-stone-500">
                {hasTakeaway
                  ? `From your session on ${recentTakeaway!.date}`
                  : 'Actionable micro-steps developed in reflection'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-xl hover:bg-stone-100 cursor-pointer"
            aria-label="Close work plan popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {hasTakeaway ? (
          <div className="space-y-4">
            {/* Grounding Reminder Card */}
            <div className="p-3.5 bg-gradient-to-br from-[#F4F9F8] to-[#EAF4F3] rounded-2xl border border-[#CCE7E6] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#215E62] block">
                Balanced Perspective
              </span>
              <p className="text-xs font-serif italic text-stone-800 leading-relaxed">
                "{recentTakeaway!.balancedPerspective}"
              </p>
            </div>

            {/* Progress Counter */}
            <div className="flex items-center justify-between text-xs text-stone-600 px-1">
              <span className="font-semibold">Action Steps:</span>
              <span className="text-[11px] text-[#2C6E72] font-medium">
                {completedCount} of {recentTakeaway!.workPlan.length} completed
              </span>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              {recentTakeaway!.workPlan.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onUpdateWorkPlan(item.id, !item.completed)}
                  className={`w-full flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    item.completed
                      ? 'bg-stone-50 border-stone-200 text-stone-400 line-through'
                      : 'bg-white border-stone-200 hover:border-[#7FB8BD] text-stone-800 shadow-2xs'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300 hover:text-stone-500" />
                    )}
                  </div>
                  <span className="text-xs font-medium leading-relaxed">{item.text}</span>
                </button>
              ))}
            </div>

            <p className="text-[11px] text-stone-400 italic text-center pt-1">
              Practicing these micro-actions strengthens realistic, self-supportive thinking.
            </p>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-stone-900">
                No active work plan yet
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                Complete a guided reflection through the glowing TheraApp logo to generate your custom CBT work plan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                handleClose();
                onStartNewEntry();
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <span>Begin Reflection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            {hasTakeaway ? "I'm on it!" : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
