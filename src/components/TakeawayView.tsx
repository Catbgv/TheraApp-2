import React, { useState } from 'react';
import { ReflectionTakeaway } from '../types';
import { useLanguage } from '../i18n';
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  MessageSquare,
  FileText,
  BookmarkCheck,
  Compass,
  Sparkles,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Wind,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

interface TakeawayViewProps {
  takeaway: ReflectionTakeaway;
  onUpdateWorkPlan: (itemId: string, completed: boolean) => void;
  onNewReflection: () => void;
  onRevisitChat: () => void;
  onBackToInsights?: () => void;
  onOpenDistortionMap?: () => void;
  onOpenBreathe?: () => void;
}

export const TakeawayView: React.FC<TakeawayViewProps> = ({
  takeaway,
  onUpdateWorkPlan,
  onNewReflection,
  onRevisitChat,
  onBackToInsights,
  onOpenDistortionMap,
  onOpenBreathe,
}) => {
  const { isSpanish } = useLanguage();
  const [showOriginalEntry, setShowOriginalEntry] = useState(false);
  const [showFullChatHistory, setShowFullChatHistory] = useState(false);

  const completedCount = takeaway.workPlan.filter((w) => w.completed).length;

  return (
    <div className="max-w-2xl mx-auto pb-16 space-y-4 animate-in fade-in duration-150">
      {/* Top Meta Bar - compact */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {onBackToInsights && (
            <button
              type="button"
              onClick={onBackToInsights}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-stone-100"
            >
              {isSpanish ? '← Archivo' : '← Archive'}
            </button>
          )}
          <span className="text-[11px] text-stone-500 font-medium">
            {isSpanish ? 'Registrado el' : 'Recorded'} {takeaway.date}
          </span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-[11px] font-semibold border border-emerald-200/70">
          <BookmarkCheck className="w-3 h-3 text-emerald-600" />
          <span>{isSpanish ? 'Guardado' : 'Saved'}</span>
        </div>
      </div>

      {/* Main Header - compact */}
      <div className="flex items-center justify-between pb-0.5">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            {isSpanish ? 'Tu Aprendizaje' : 'Your Takeaway'}
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            {isSpanish
              ? 'Perspectiva equilibrada desarrollada de tu reflexión'
              : 'Grounded perspective developed from your reflection'}
          </p>
        </div>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAF5F3] text-[#154E48] text-[11px] font-bold border border-[#BCE4DE]">
          <Compass className="w-3 h-3" />
          <span>{isSpanish ? 'TCC' : 'CBT'}</span>
        </div>
      </div>

      {/* 1. INITIAL DISTORTED THOUGHT IN A THOUGHT BUBBLE (Compact) */}
      <div className="relative">
        <section className="bg-stone-50/90 rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-2xs relative">
          <div className="flex items-center justify-between pb-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700 text-[11px] font-bold uppercase tracking-wider">
              <MessageCircle className="w-3 h-3 text-stone-500" />
              <span>
                {isSpanish ? 'Pensamiento Inicial' : 'Initial Distorted Thought'}
              </span>
            </span>
          </div>

          <blockquote className="text-base sm:text-lg font-serif italic text-stone-800 leading-snug">
            "{takeaway.dominantThought}"
          </blockquote>
        </section>

        {/* Thought Bubble Connector */}
        <div className="flex justify-center -my-1.5 relative z-10">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-3 h-3 rounded-full bg-stone-200 border border-stone-300"></div>
            <div className="w-2 h-2 rounded-full bg-[#80C7BC] border border-[#60B5A8]"></div>
          </div>
        </div>
      </div>

      {/* 2. THE MORE BALANCED PERSPECTIVE RIGHT AFTER (Compact, with TBD handling) */}
      {(() => {
        const isPerspectiveTBD =
          !takeaway.balancedPerspective ||
          takeaway.balancedPerspective.trim() === '' ||
          takeaway.balancedPerspective.trim().toUpperCase() === 'TBD' ||
          takeaway.balancedPerspective.trim().toLowerCase().startsWith('tbd');

        if (isPerspectiveTBD) {
          return (
            <section className="bg-gradient-to-br from-amber-50/90 via-stone-50 to-amber-50/40 rounded-2xl p-4 sm:p-5 border-2 border-dashed border-amber-300 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-700" />
                  <span>{isSpanish ? 'Perspectiva Equilibrada' : 'More Balanced Perspective'}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wider">
                  {isSpanish ? 'Por definir (TBD)' : 'TBD'}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-serif font-bold text-amber-950">
                  {isSpanish ? 'Aún por definir en el diálogo' : 'To be determined in reflection'}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {isSpanish
                    ? 'En la TCC, una perspectiva más equilibrada se construye examinando la evidencia en el diálogo. Continúa tu conversación con el guía para formular un reencuadre en tus propias palabras.'
                    : 'In CBT, a balanced perspective is formed collaboratively by testing thoughts against evidence. Continue your conversation with the Reflection Coach to examine the hot thought and formulate a balanced reframe in your own words.'}
                </p>
              </div>

              <div className="pt-2 border-t border-amber-200/70 flex items-center justify-between gap-2">
                <span className="text-[11px] text-amber-900 font-medium">
                  {isSpanish ? 'El diálogo continúa cuando gustes:' : 'Conversation should continue:'}
                </span>
                <button
                  type="button"
                  onClick={onRevisitChat}
                  className="py-1.5 px-3.5 rounded-xl bg-[#154E48] hover:bg-[#0F3B36] text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{isSpanish ? 'Continuar diálogo' : 'Continue Conversation'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
                </button>
              </div>
            </section>
          );
        }

        return (
          <section className="bg-gradient-to-br from-[#EEF7F5] via-[#E7F4F2] to-[#DEF0EC] rounded-2xl p-4 sm:p-5 border-2 border-[#94D6CC] shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#154E48] text-white text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-emerald-200" />
                <span>{isSpanish ? 'Perspectiva Equilibrada' : 'More Balanced Perspective'}</span>
              </div>
              <span className="text-[11px] text-[#206961] font-semibold">
                {isSpanish ? 'Reencuadre' : 'Objective Reframe'}
              </span>
            </div>

            <p className="text-base sm:text-lg font-serif font-medium text-[#0F3B36] leading-snug">
              "{takeaway.balancedPerspective}"
            </p>

            <div className="pt-1.5 border-t border-[#BDE3DD] flex items-center justify-between gap-2 text-[11px]">
              <span className="text-[#2D6A62] font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#206961]"></span>
                <span>
                  {isSpanish
                    ? 'Basado en evidencia objetiva, sin asumir el peor escenario.'
                    : 'Grounded in evidence, without assuming worst-case judgments.'}
                </span>
              </span>
              <button
                type="button"
                onClick={onRevisitChat}
                className="text-[#154E48] hover:text-[#0F3B36] font-bold underline cursor-pointer shrink-0"
              >
                {isSpanish ? 'Refinar en diálogo →' : 'Refine in chat →'}
              </button>
            </div>
          </section>
        );
      })()}

      {/* 3. POSSIBLE PATTERN: A COGNITIVE DISTORTION WITH BUTTON TO GO TO DISTORTION MAP */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            {isSpanish ? 'Patrón Posible: Distorsión Cognitiva' : 'Possible Pattern: Cognitive Distortion'}
          </div>
          {takeaway.pattern.identified && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {isSpanish ? 'Identificado' : 'Identified'}
            </span>
          )}
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-stone-900">
            {takeaway.pattern.name}
          </h3>
          <p className="text-xs text-stone-600 leading-normal font-medium">
            {takeaway.pattern.description}
          </p>
        </div>

        {/* Button to go to the Distortion Map */}
        {onOpenDistortionMap && (
          <button
            type="button"
            onClick={onOpenDistortionMap}
            className="w-full py-2.5 px-4 rounded-xl bg-[#E8F6F3] hover:bg-[#D5F0EB] text-[#154E48] border border-[#B5E2DA] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <Compass className="w-4 h-4 text-[#154E48]" />
            <span>
              {isSpanish
                ? 'Explorar en el Mapa de Distorsiones'
                : 'Explore in the Distortion Map'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#154E48]" />
          </button>
        )}
      </section>

      {/* 4. REMIND THEM TO CONTINUE THEIR BREATHING PRACTICE AS DAILY ROUTINE */}
      <section className="bg-gradient-to-r from-[#F0F8FF] via-[#F4FAFC] to-[#F0FBF8] rounded-2xl p-4 sm:p-5 border border-[#BCE3ED] shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#1A6B85] text-white flex items-center justify-center shrink-0">
              <Wind className="w-4 h-4 text-sky-100" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#1A6B85]">
                {isSpanish ? 'Rutina Diaria' : 'Daily Routine'}
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-stone-900">
                {isSpanish ? 'Práctica de respiración recomendada' : 'Continue your daily breathing practice'}
              </h3>
            </div>
          </div>
          {onOpenBreathe && (
            <button
              type="button"
              onClick={onOpenBreathe}
              className="py-1.5 px-3 rounded-xl bg-[#1A6B85] hover:bg-[#14556A] text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 shrink-0"
            >
              <Wind className="w-3 h-3 text-sky-200" />
              <span>{isSpanish ? 'Respirar' : 'Breathe'}</span>
              <ArrowRight className="w-3 h-3 text-sky-200" />
            </button>
          )}
        </div>

        <p className="text-xs text-stone-600 leading-normal font-medium">
          {isSpanish
            ? '2 minutos de respiración pausada (6s inhalar, 4s exhalar) regulan el sistema nervioso.'
            : '2 minutes of paced breathing (6s inhale, 4s exhale) resets your nervous system.'}
        </p>
      </section>

      {/* 5. What became clearer (Insights) */}
      {takeaway.insights && takeaway.insights.length > 0 && (
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{isSpanish ? 'Puntos Clave Comprendidos' : 'What Became Clearer'}</span>
          </div>

          <div className="space-y-1.5">
            {takeaway.insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-normal font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#154E48] mt-1.5 shrink-0"></span>
                <p>{insight}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Work Plan (Interactive Checklist) */}
      {takeaway.workPlan && takeaway.workPlan.length > 0 && (
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              {isSpanish ? 'Plan de Acción' : 'Work Plan'}
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
              {completedCount}/{takeaway.workPlan.length} {isSpanish ? 'listas' : 'done'}
            </span>
          </div>

          <div className="space-y-1.5">
            {takeaway.workPlan.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onUpdateWorkPlan(item.id, !item.completed)}
                className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  item.completed
                    ? 'bg-stone-50 border-stone-200 text-stone-400 line-through'
                    : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                  ) : (
                    <Circle className="w-4 h-4 text-stone-300 hover:text-stone-500" />
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium leading-normal">{item.text}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Collapsible Revisit Sections: Original ABC Entry & Full Session Conversation */}
      <div className="space-y-2 pt-1">
        {/* Toggle Original Entry */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowOriginalEntry(!showOriginalEntry)}
            className="w-full flex items-center justify-between p-3 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              <span>{isSpanish ? 'Ver Registro ABC Original' : 'Review Original ABC Entry'}</span>
            </span>
            {showOriginalEntry ? (
              <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            )}
          </button>

          {showOriginalEntry && (
            <div className="p-3 pt-1 border-t border-stone-100 text-xs space-y-2 bg-stone-50/70">
              <div>
                <span className="font-bold text-stone-700 block">
                  {isSpanish ? 'Acontecimiento (A):' : 'Activating Event (A):'}
                </span>
                <p className="text-stone-600 mt-0.5">{takeaway.entry.event}</p>
              </div>
              <div>
                <span className="font-bold text-stone-700 block">
                  {isSpanish ? 'Pensamientos (B):' : 'Thoughts (B):'}
                </span>
                <p className="text-stone-600 mt-0.5">{takeaway.entry.thoughts}</p>
              </div>
              <div>
                <span className="font-bold text-stone-700 block">
                  {isSpanish ? 'Emociones (C):' : 'Emotions (C):'}
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {takeaway.entry.emotions.map((em) => (
                    <span
                      key={em.id}
                      className="px-2 py-0.5 bg-white border border-stone-200 rounded-md text-[11px] font-semibold text-stone-700"
                    >
                      {em.name} ({em.intensity}/10)
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-bold text-stone-700 block">
                  {isSpanish ? 'Acciones / Reacciones:' : 'Actions / Behaviors:'}
                </span>
                <p className="text-stone-600 mt-0.5">{takeaway.entry.actions}</p>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Full Chat History */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowFullChatHistory(!showFullChatHistory)}
            className="w-full flex items-center justify-between p-3 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
              <span>
                {isSpanish
                  ? `Ver Diálogo de la Sesión (${takeaway.messages.length} mensajes)`
                  : `Review Session Dialogue (${takeaway.messages.length} messages)`}
              </span>
            </span>
            {showFullChatHistory ? (
              <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            )}
          </button>

          {showFullChatHistory && (
            <div className="p-3 pt-1 border-t border-stone-100 text-xs space-y-2 bg-stone-50/70 max-h-72 overflow-y-auto">
              {takeaway.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-2.5 rounded-xl ${
                    m.role === 'user'
                      ? 'bg-stone-900 text-white ml-6'
                      : 'bg-white border border-stone-200 text-stone-800 mr-6'
                  }`}
                >
                  <span className="text-[9px] opacity-60 block mb-0.5 font-bold uppercase tracking-wider">
                    {m.role === 'user'
                      ? (isSpanish ? 'Tú' : 'You')
                      : (isSpanish ? 'Guía de Reflexión' : 'Reflection Guide')}
                  </span>
                  <p className="leading-snug whitespace-pre-wrap">{m.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action CTAs - compact */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
        <button
          type="button"
          onClick={onRevisitChat}
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{isSpanish ? 'Reanudar diálogo' : 'Resume dialogue'}</span>
        </button>

        <button
          type="button"
          onClick={onNewReflection}
          className="w-full flex-1 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold bg-[#154E48] hover:bg-[#0F3B36] text-white transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isSpanish ? 'Iniciar nueva reflexión' : 'Start a new reflection'}</span>
        </button>
      </div>
    </div>
  );
};
