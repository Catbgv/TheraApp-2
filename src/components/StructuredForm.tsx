import React, { useState, useEffect } from 'react';
import { StructuredEntry, EmotionItem } from '../types';
import { EmotionWheel } from './EmotionWheel';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useLanguage } from '../i18n';
import {
  ChevronLeft,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Mic,
  Camera,
  Brain,
  Heart,
  Activity,
  CheckCircle2,
  Info,
  MessageSquare,
  Archive,
} from 'lucide-react';

interface StructuredFormProps {
  initialEntry: StructuredEntry;
  onStartSession?: (entry: StructuredEntry) => void;
  onSubmitAndStartDialogue?: (entry: StructuredEntry) => void;
  onSubmitToJournal?: (entry: StructuredEntry) => void;
  onSaveDraft?: (entry: StructuredEntry) => void;
  onCancel: () => void;
}

export const StructuredForm: React.FC<StructuredFormProps> = ({
  initialEntry,
  onStartSession,
  onSubmitAndStartDialogue,
  onSubmitToJournal,
  onSaveDraft,
  onCancel,
}) => {
  const { isSpanish } = useLanguage();
  // Steps: 1 = Event, 2 = Thoughts, 3 = Emotions, 4 = Actions, 5 = Prompt Dialogue
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [event, setEvent] = useState(initialEntry.event || '');
  const [thoughts, setThoughts] = useState(initialEntry.thoughts || '');
  const [emotions, setEmotions] = useState<EmotionItem[]>(initialEntry.emotions || []);
  const [actions, setActions] = useState(initialEntry.actions || '');
  const [activeVoiceField, setActiveVoiceField] = useState<'event' | 'thoughts' | 'actions' | null>(null);
  const [validationHint, setValidationHint] = useState<string | null>(null);

  // Auto-notify parent whenever draft state changes
  useEffect(() => {
    onSaveDraft?.({
      event,
      thoughts,
      emotions,
      actions,
    });
  }, [event, thoughts, emotions, actions]);

  const { isListening, error: voiceError, startListening, stopListening } = useVoiceInput();

  const handleToggleVoice = (field: 'event' | 'thoughts' | 'actions') => {
    if (isListening && activeVoiceField === field) {
      stopListening();
      setActiveVoiceField(null);
      return;
    }

    if (isListening) {
      stopListening();
    }

    setActiveVoiceField(field);

    startListening((transcriptText: string) => {
      if (field === 'event') {
        setEvent((prev) => (prev ? `${prev} ${transcriptText}` : transcriptText));
      } else if (field === 'thoughts') {
        setThoughts((prev) => (prev ? `${prev} ${transcriptText}` : transcriptText));
      } else if (field === 'actions') {
        setActions((prev) => (prev ? `${prev} ${transcriptText}` : transcriptText));
      }
      setActiveVoiceField(null);
    });
  };

  // Demo loader
  const handleLoadDemo = () => {
    setEvent('I sent someone a message this morning, and they have not replied for six hours.');
    setThoughts('They are probably losing interest. Maybe I said something wrong.');
    setEmotions([
      { id: 'anxious-demo', name: 'Anxious', category: 'Fear', intensity: 8 },
      { id: 'rejected-demo', name: 'Rejected', category: 'Sadness', intensity: 6 },
    ]);
    setActions('I kept checking my phone, reread our previous messages, and thought about sending another text.');
    setValidationHint(null);
  };

  const handleClear = () => {
    setEvent('');
    setThoughts('');
    setEmotions([]);
    setActions('');
    setCurrentStep(1);
    setValidationHint(null);
  };

  // Step Validation logic
  const handleNext = () => {
    setValidationHint(null);

    if (currentStep === 1) {
      if (!event.trim()) {
        setValidationHint('Please describe what happened (even a brief note).');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!thoughts.trim()) {
        setValidationHint('Please write what went through your mind.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (emotions.length === 0) {
        setValidationHint('Please select or add at least one emotion.');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!actions.trim()) {
        setValidationHint('Please describe your actions, behaviors, or physical sensations.');
        return;
      }
      // Advance to dialogue prompt screen
      setCurrentStep(5);
    }
  };

  const handleBack = () => {
    setValidationHint(null);
    if (currentStep === 1) {
      onCancel();
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const getCompletedEntry = (): StructuredEntry => ({
    event: event.trim(),
    thoughts: thoughts.trim(),
    emotions,
    actions: actions.trim(),
  });

  const handleStartDialogue = () => {
    const entryData = getCompletedEntry();
    if (onSubmitAndStartDialogue) {
      onSubmitAndStartDialogue(entryData);
    } else if (onStartSession) {
      onStartSession(entryData);
    }
  };

  const handleSaveToJournalOnly = () => {
    const entryData = getCompletedEntry();
    if (onSubmitToJournal) {
      onSubmitToJournal(entryData);
    } else if (onStartSession) {
      onStartSession(entryData);
    }
  };

  const handleQuickSaveToArchive = () => {
    if (!event.trim() && !thoughts.trim() && emotions.length === 0 && !actions.trim()) {
      setValidationHint(
        isSpanish
          ? 'Escribe al menos una descripción breve o pensamiento antes de guardar en el archivo.'
          : 'Please write at least a brief description or thought before saving to the archive.'
      );
      return;
    }
    const entryData = getCompletedEntry();
    if (onSubmitToJournal) {
      onSubmitToJournal(entryData);
    } else if (onStartSession) {
      onStartSession(entryData);
    }
  };

  return (
    <div
      className={`mx-auto pb-24 pt-1 animate-in fade-in duration-200 transition-all ${
        currentStep === 3 ? 'max-w-5xl' : 'max-w-xl'
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between py-3 mb-2">
        <button
          type="button"
          onClick={handleBack}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-serif font-bold text-stone-900 tracking-tight">
          {isSpanish ? 'Registro ABC' : 'ABC Entry'}
        </h1>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleQuickSaveToArchive}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#154E48] bg-[#E8F8F5] hover:bg-[#D5F2EC] border border-[#BDE7E1] rounded-xl transition-colors cursor-pointer shadow-2xs"
            title={isSpanish ? 'Guardar en el Archivo' : 'Save what you filled to Archive'}
          >
            <Archive className="w-3.5 h-3.5 text-[#34A895]" />
            <span className="hidden xs:inline">{isSpanish ? 'Guardar' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={handleLoadDemo}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            title="Preload sample ABC situation"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Demo</span>
          </button>
        </div>
      </div>

      {/* 4 Segmented Progress Bars matching Screenshot: - - - - 1/4 */}
      {currentStep <= 4 && (
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((stepNum) => {
              const isFilled = stepNum <= currentStep;
              return (
                <div
                  key={stepNum}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isFilled ? 'bg-[#2D6A5D]' : 'bg-stone-200'
                  }`}
                />
              );
            })}
          </div>
          <span className="text-xs font-semibold text-stone-400 font-mono tabular-nums">
            {currentStep}/4
          </span>
        </div>
      )}

      {/* Voice input error message if any */}
      {voiceError && (
        <div className="p-3 mb-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center justify-between">
          <span>{voiceError}</span>
        </div>
      )}

      {/* Validation hint */}
      {validationHint && (
        <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2 animate-in fade-in">
          <Info className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{validationHint}</span>
        </div>
      )}

      {/* SCREEN 1: A. What happened? */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              A. What happened?
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Describe the triggering event. Be objective, without emotions.
            </p>
          </div>

          <div className="relative bg-white/95 rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs text-stone-400">Objective Camera View</span>

              {/* Microphone Voice dictation button */}
              <button
                type="button"
                onClick={() => handleToggleVoice('event')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isListening && activeVoiceField === 'event'
                    ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
                title="Dictate with voice"
              >
                <Mic className={`w-3.5 h-3.5 ${isListening && activeVoiceField === 'event' ? 'animate-bounce' : 'text-stone-500'}`} />
                <span>{isListening && activeVoiceField === 'event' ? 'Listening...' : 'Voice'}</span>
              </button>
            </div>

            <textarea
              value={event}
              onChange={(e) => {
                setEvent(e.target.value);
                if (validationHint) setValidationHint(null);
              }}
              placeholder="e.g. My boss gave me critical feedback during the meeting."
              rows={6}
              autoFocus
              className={`w-full p-2 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 resize-y leading-relaxed text-stone-800 placeholder-stone-400 font-medium ${
                isListening && activeVoiceField === 'event' ? 'text-rose-900' : ''
              }`}
            />
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-4 px-6 rounded-2xl bg-[#2D6A5D] hover:bg-[#235349] text-white text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: B. What are your thoughts? */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              B. What are your thoughts?
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              What automatic thoughts went through your mind? Be honest with yourself.
            </p>
          </div>

          <div className="relative bg-white/95 rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs text-stone-400">Internal Story & Predictions</span>

              {/* Microphone Voice dictation button */}
              <button
                type="button"
                onClick={() => handleToggleVoice('thoughts')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isListening && activeVoiceField === 'thoughts'
                    ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
                title="Dictate with voice"
              >
                <Mic className={`w-3.5 h-3.5 ${isListening && activeVoiceField === 'thoughts' ? 'animate-bounce' : 'text-stone-500'}`} />
                <span>{isListening && activeVoiceField === 'thoughts' ? 'Listening...' : 'Voice'}</span>
              </button>
            </div>

            <textarea
              value={thoughts}
              onChange={(e) => {
                setThoughts(e.target.value);
                if (validationHint) setValidationHint(null);
              }}
              placeholder="e.g. I thought I am not good enough and everyone noticed my mistake."
              rows={6}
              autoFocus
              className={`w-full p-2 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 resize-y leading-relaxed text-stone-800 placeholder-stone-400 font-medium ${
                isListening && activeVoiceField === 'thoughts' ? 'text-rose-900' : ''
              }`}
            />
          </div>

          {/* Bottom Action Bar: Back & Next */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="py-4 px-6 rounded-2xl bg-white border border-stone-200 text-stone-700 text-sm font-semibold hover:bg-stone-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-4 px-6 rounded-2xl bg-[#2D6A5D] hover:bg-[#235349] text-white text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 3: C. How do you feel? */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              {isSpanish ? 'C. ¿Cómo te sientes?' : 'C. How do you feel?'}
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed font-medium">
              {isSpanish
                ? 'Explora la rueda de emociones a la izquierda y gradúa la intensidad de cada emoción en el panel lateral a la derecha.'
                : 'Explore the emotion wheel on the left, and set your emotional intensity in the sidebar on the right.'}
            </p>
          </div>

          <div>
            <EmotionWheel
              selectedEmotions={emotions}
              onChange={(newEmotions) => {
                setEmotions(newEmotions);
                if (validationHint) setValidationHint(null);
              }}
            />
          </div>

          {/* Bottom Action Bar: Back & Next */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="py-4 px-6 rounded-2xl bg-white border border-stone-200 text-stone-700 text-sm font-semibold hover:bg-stone-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-4 px-6 rounded-2xl bg-[#2D6A5D] hover:bg-[#235349] text-white text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 4: C. What did you do? */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              C. What did you do?
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Describe your actions, behaviors, or physical bodily reactions.
            </p>
          </div>

          <div className="relative bg-white/95 rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs text-stone-400">Actions & Bodily Reactions</span>

              {/* Microphone Voice dictation button */}
              <button
                type="button"
                onClick={() => handleToggleVoice('actions')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isListening && activeVoiceField === 'actions'
                    ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
                title="Dictate with voice"
              >
                <Mic className={`w-3.5 h-3.5 ${isListening && activeVoiceField === 'actions' ? 'animate-bounce' : 'text-stone-500'}`} />
                <span>{isListening && activeVoiceField === 'actions' ? 'Listening...' : 'Voice'}</span>
              </button>
            </div>

            <textarea
              value={actions}
              onChange={(e) => {
                setActions(e.target.value);
                if (validationHint) setValidationHint(null);
              }}
              placeholder="e.g. I stayed silent, withdrew to my desk, and felt tightness in my chest."
              rows={6}
              autoFocus
              className={`w-full p-2 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 resize-y leading-relaxed text-stone-800 placeholder-stone-400 font-medium ${
                isListening && activeVoiceField === 'actions' ? 'text-rose-900' : ''
              }`}
            />
          </div>

          {/* Bottom Action Bar: Back & Next to Prompt */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="py-4 px-6 rounded-2xl bg-white border border-stone-200 text-stone-700 text-sm font-semibold hover:bg-stone-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-4 px-6 rounded-2xl bg-[#2D6A5D] hover:bg-[#235349] text-white text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Review & Start</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 5: Prompt to Start Dialogue */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-[#E8F3F3] text-[#2C6E72] flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              Ready to submit your reflection?
            </h2>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              Your ABC matrix is complete. Submitting saves it directly into your Journal History. You can also start an interactive dialogue with the reflection coach.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="bg-white/95 rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-3.5 text-xs">
            <div className="pb-2 border-b border-stone-100 flex items-center justify-between">
              <span className="font-semibold text-stone-700">Structured Summary</span>
              <span className="text-[11px] text-emerald-700 font-medium">4 of 4 complete</span>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-stone-500 block uppercase tracking-wider text-[10px]">
                A · Event (Facts)
              </span>
              <p className="text-stone-800 leading-relaxed pl-2 border-l-2 border-amber-300">
                {event}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-stone-500 block uppercase tracking-wider text-[10px]">
                B · Thoughts (Story)
              </span>
              <p className="text-stone-800 leading-relaxed pl-2 border-l-2 border-purple-300">
                {thoughts}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-stone-500 block uppercase tracking-wider text-[10px]">
                C · Emotions ({emotions.length})
              </span>
              <div className="flex flex-wrap gap-1.5 pl-2 pt-0.5">
                {emotions.map((em) => (
                  <span
                    key={em.id}
                    className="px-2.5 py-0.5 bg-stone-100 border border-stone-200 rounded-lg text-stone-800 text-[11px] font-medium"
                  >
                    {em.name} ({em.intensity}/10)
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-stone-500 block uppercase tracking-wider text-[10px]">
                C · Actions / Reactions
              </span>
              <p className="text-stone-800 leading-relaxed pl-2 border-l-2 border-teal-300">
                {actions}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleStartDialogue}
              className="w-full py-4 px-6 rounded-2xl bg-[#154E48] hover:bg-[#0F3B36] text-white text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isSpanish ? 'Guardar en Archivo e Iniciar Diálogo' : 'Submit & Start Dialogue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSaveToJournalOnly}
              className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 text-xs font-semibold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Archive className="w-4 h-4 text-[#154E48]" />
              <span>{isSpanish ? 'Guardar Directamente en el Archivo' : 'Submit Directly to Archive'}</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer text-center block"
            >
              {isSpanish ? '← Editar entradas' : '← Edit entries'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
