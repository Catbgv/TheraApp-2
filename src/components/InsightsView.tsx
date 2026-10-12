import React from 'react';
import { ReflectionTakeaway } from '../types';
import { useLanguage } from '../i18n';
import {
  Calendar,
  CheckCircle2,
  Compass,
  ArrowRight,
  Archive,
  Plus,
  Trash2,
  Database,
} from 'lucide-react';

interface InsightsViewProps {
  takeaways: ReflectionTakeaway[];
  onSelectTakeaway: (takeaway: ReflectionTakeaway) => void;
  onStartNewReflection: () => void;
  onDeleteTakeaway?: (id: string) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  takeaways,
  onSelectTakeaway,
  onStartNewReflection,
  onDeleteTakeaway,
}) => {
  const { t, isSpanish } = useLanguage();

  const confirmDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm(isSpanish ? '¿Eliminar esta reflexión del archivo?' : 'Delete this reflection from your archive?')) {
      onDeleteTakeaway?.(id);
    }
  };

  if (takeaways.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <div className="w-14 h-14 mx-auto rounded-3xl bg-[#E8F8F5] text-[#154E48] flex items-center justify-center mb-4">
          <Archive className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
          {isSpanish ? 'Tu Archivo' : 'Your Archive'}
        </h3>
        <p className="text-xs text-stone-500 leading-relaxed mb-6">
          {isSpanish
            ? 'Tus reflexiones guardadas, pensamientos examinados y conclusiones aparecerán aquí. Todo lo que llenas se almacena en la memoria del navegador.'
            : 'Your saved reflections, examined thoughts, and dialogue takeaways will appear here. Everything you fill stays saved in local memory.'}
        </p>
        <button
          type="button"
          onClick={onStartNewReflection}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#154E48] hover:bg-[#0F3B36] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isSpanish ? 'Iniciar Primera Entrada' : 'Start First Entry'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-24 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-serif font-extrabold text-stone-900 tracking-tight">
              {t.navJournal}
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#154E48] bg-[#E8F8F5] px-2.5 py-0.5 rounded-full border border-[#BDE7E1]">
              <Database className="w-3 h-3 text-[#34A895]" />
              <span>
                {takeaways.length}{' '}
                {isSpanish
                  ? takeaways.length === 1
                    ? 'entrada guardada'
                    : 'entradas guardadas'
                  : takeaways.length === 1
                  ? 'saved reflection'
                  : 'saved reflections'}
              </span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-medium">
            {isSpanish
              ? 'Tu archivo en memoria de entradas ABC guardadas, pensamientos examinados y conclusiones'
              : 'Your persistent archive of submitted ABC entries, reframed perspectives, and action plans'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onStartNewReflection}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#154E48] hover:bg-[#0F3B36] rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.navNewEntry}</span>
          </button>
        </div>
      </div>

      {/* Memory Status Banner */}
      <div className="p-3 bg-stone-100/80 rounded-2xl border border-stone-200/80 flex items-center gap-2 text-xs text-stone-600">
        <Archive className="w-4 h-4 text-[#154E48] shrink-0" />
        <span className="text-[11px] font-medium">
          {isSpanish
            ? 'Tus entradas permanecen guardadas localmente en la memoria de este navegador.'
            : 'All filled reflections are automatically preserved in your browser memory.'}
        </span>
      </div>

      {/* List of completed reflections */}
      <div className="space-y-4">
        {takeaways.map((takeaway) => {
          const primaryEmotion =
            takeaway.entry.emotions && takeaway.entry.emotions.length > 0
              ? takeaway.entry.emotions[0]
              : null;
          const completedWorkPlanCount = takeaway.workPlan ? takeaway.workPlan.filter((w) => w.completed).length : 0;
          const totalWorkPlanCount = takeaway.workPlan ? takeaway.workPlan.length : 0;

          return (
            <div
              key={takeaway.id}
              onClick={() => onSelectTakeaway(takeaway)}
              className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs hover:border-[#7FB8BD] hover:shadow-sm transition-all cursor-pointer group relative"
            >
              {/* Card Meta Row */}
              <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                <span className="flex items-center gap-1.5 font-medium text-stone-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{takeaway.date}</span>
                </span>

                <div className="flex items-center gap-2">
                  {primaryEmotion && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 text-stone-700">
                      {primaryEmotion.name} ({primaryEmotion.intensity}/10)
                    </span>
                  )}
                  {onDeleteTakeaway && (
                    <button
                      type="button"
                      onClick={(e) => confirmDelete(e, takeaway.id)}
                      className="p-1 rounded-lg text-stone-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title={isSpanish ? 'Eliminar del archivo' : 'Delete reflection'}
                      aria-label="Delete reflection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title & dominant thought */}
              <h3 className="text-base font-serif font-semibold text-stone-900 group-hover:text-[#2C6E72] transition-colors line-clamp-1 mb-1.5">
                {takeaway.title}
              </h3>

              {/* Possible pattern badge */}
              <div className="mb-3">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
                    takeaway.pattern.identified
                      ? 'bg-purple-50 text-purple-800 border border-purple-200/60'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <Compass className="w-3 h-3 text-current" />
                  <span>
                    {isSpanish ? 'Patrón:' : 'Pattern:'} {takeaway.pattern.name}
                  </span>
                </span>
              </div>

              {/* Balanced perspective quote */}
              <div className="bg-[#FAF9F6] p-3 rounded-2xl border border-stone-100 mb-3">
                <p className="text-xs text-stone-700 italic line-clamp-2 leading-relaxed">
                  {!takeaway.balancedPerspective || takeaway.balancedPerspective.trim() === '' || takeaway.balancedPerspective.trim().toUpperCase() === 'TBD' || takeaway.balancedPerspective.trim().toLowerCase().startsWith('tbd') ? (
                    <span className="text-amber-800 font-semibold not-italic">
                      {isSpanish ? 'Por definir (TBD) — Continuar reflexión' : 'TBD — Continue reflection to reframe'}
                    </span>
                  ) : (
                    `"${takeaway.balancedPerspective}"`
                  )}
                </p>
              </div>

              {/* Footer: Work Plan Progress and Chevron */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      completedWorkPlanCount === totalWorkPlanCount && totalWorkPlanCount > 0
                        ? 'text-emerald-600'
                        : 'text-stone-400'
                    }`}
                  />
                  <span>
                    {isSpanish ? 'Plan de acción:' : 'Work plan:'} {completedWorkPlanCount}/{totalWorkPlanCount}{' '}
                    {isSpanish ? 'completado' : 'completed'}
                  </span>
                </span>

                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#154E48] group-hover:translate-x-0.5 transition-transform">
                  <span>{isSpanish ? 'Ver reflexión' : 'View takeaway'}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
