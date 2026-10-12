import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n';
import { StructuredEntry, ChatMessage, ReflectionTakeaway } from '../types';
import { useVoiceInput } from '../hooks/useVoiceInput';
import {
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Wind,
  RotateCcw,
  CheckCircle2,
  Lock,
  Heart,
  Brain,
  Camera,
  Activity,
  LifeBuoy,
  Mic,
  MicOff,
} from 'lucide-react';

interface ChatSessionProps {
  userName?: string;
  entry: StructuredEntry;
  initialMessages?: ChatMessage[];
  onConclude: (takeaway: ReflectionTakeaway) => void;
  onExit: () => void;
  onOpenBreathe: () => void;
  onOpenSafety: () => void;
}

export const ChatSession: React.FC<ChatSessionProps> = ({
  userName,
  entry,
  initialMessages = [],
  onConclude,
  onExit,
  onOpenBreathe,
  onOpenSafety,
}) => {
  const { t, language, isSpanish } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [stage, setStage] = useState<'CLARIFY' | 'EXPLORE' | 'SUMMARIZE' | 'WORK_PLAN'>('CLARIFY');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConcluding, setIsConcluding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEntryExpanded, setIsEntryExpanded] = useState(false);
  const [safetyNotice, setSafetyNotice] = useState<string | null>(null);

  const { isListening, error: voiceError, startListening, stopListening } = useVoiceInput();

  const handleToggleVoiceInput = () => {
    if (isListening) {
      stopListening();
      return;
    }

    startListening((transcriptText: string) => {
      setInputValue((prev) => (prev ? `${prev} ${transcriptText}` : transcriptText));
    });
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isConcluding]);

  // Initial greeting from Gemini when starting fresh session
  useEffect(() => {
    if (messages.length === 0) {
      startInitialExchange();
    }
  }, []);

  const startInitialExchange = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry,
          userName,
          messages: [],
          language,
          stage: 'CLARIFY',
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.stage) setStage(data.stage);
      const initialReply: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'model',
        content: data.reply,
        timestamp: Date.now(),
      };
      setMessages([initialReply]);
    } catch (err: any) {
      console.error('Chat start error:', err);
      const primaryEmotion = entry.emotions && entry.emotions.length > 0 ? entry.emotions[0] : null;
      const emoName = primaryEmotion ? primaryEmotion.name.toLowerCase() : (isSpanish ? 'malestar' : 'heaviness');
      const emoInt = primaryEmotion ? `${primaryEmotion.intensity}/10` : (isSpanish ? 'fuerte' : 'strong');
      const shortEv = entry.event?.trim() ? entry.event.trim().slice(0, 60) : (isSpanish ? 'lo que pasó' : 'what happened');

      const fallbackOpening = isSpanish
        ? `Sentir ${emoName} en ${emoInt} ante ${shortEv} es una carga pesada de sostener, especialmente con varios pensamientos rondando en la cabeza. De lo que te vino a la mente, ¿cuál es el pensamiento que más te duele cuando te detienes en él?`
        : `Feeling ${emoName} at ${emoInt} over ${shortEv} is a lot to carry, especially with rapid thoughts spinning around it. Of the thoughts that showed up for you, which one hits hardest when you sit with it?`;

      setMessages([
        {
          id: `msg-${Date.now()}`,
          role: 'model',
          content: fallbackOpening,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check crisis keywords for instant client-side empathy & safety banner
  const checkSafetyKeywords = (text: string) => {
    const lower = text.toLowerCase();
    const crisisPatterns = [
      'kill myself',
      'suicide',
      'want to die',
      'end my life',
      'self harm',
      'hurt myself',
      'no reason to live',
    ];
    return crisisPatterns.some((p) => lower.includes(p));
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading || isConcluding) return;

    const userText = inputValue.trim();
    setInputValue('');

    // Check crisis safety
    if (checkSafetyKeywords(userText)) {
      setSafetyNotice(
        'If you are feeling overwhelmed, hopeless, or having thoughts of self-harm, please reach out for immediate support. TheraApp is a self-reflection tool, not an emergency service.'
      );
    }

    const newMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry,
          userName,
          language,
          stage,
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.stage) setStage(data.stage);
      const modelMsg: ChatMessage = {
        id: `mod-${Date.now()}`,
        role: 'model',
        content: data.reply,
        timestamp: Date.now(),
      };
      setMessages([...updatedMessages, modelMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setError('Connection interrupted. You can retry sending your message.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLastMessage = async () => {
    if (messages.length === 0 || isLoading) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) {
      startInitialExchange();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry,
          language,
          stage,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error('Retry failed');
      const data = await res.json();
      if (data.stage) setStage(data.stage);
      setMessages([
        ...messages,
        {
          id: `mod-${Date.now()}`,
          role: 'model',
          content: data.reply,
          timestamp: Date.now(),
        },
      ]);
    } catch (err: any) {
      setError('Still unable to reach the reflection coach. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Conclude session and generate Takeaway
  const handleConcludeSession = async () => {
    if (isConcluding || isLoading) return;
    setIsConcluding(true);
    setError(null);

    try {
      const res = await fetch('/api/conclude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry,
          language,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('Conclude request failed');
      }

      const takeawayData = await res.json();

      const rawPerspective = takeawayData?.balancedPerspective;
      const isPerspectiveTBD =
        !rawPerspective ||
        rawPerspective.trim() === '' ||
        rawPerspective.trim().toUpperCase() === 'TBD' ||
        rawPerspective.trim().toLowerCase().startsWith('tbd');

      const newTakeaway: ReflectionTakeaway = {
        id: `takeaway-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        timestamp: Date.now(),
        title: entry.event ? entry.event.slice(0, 48) + '...' : 'Reflection',
        entry,
        messages,
        dominantThought: takeawayData?.dominantThought || entry.thoughts,
        pattern: takeawayData?.pattern || {
          name: isSpanish ? 'Patrón por explorar' : 'Pattern to be explored',
          description: isSpanish
            ? 'Los patrones de pensamiento se identifican a medida que avanza la reflexión.'
            : 'Thinking patterns are identified and explored as the reflection progresses.',
          identified: false,
        },
        balancedPerspective: isPerspectiveTBD ? 'TBD' : rawPerspective.trim(),
        insights: takeawayData?.insights || [
          isSpanish ? 'Se aclaró la situación y el pensamiento que generaba más malestar.' : 'Clarified the situation and the thoughts carrying the most emotional weight.',
        ],
        workPlan: (takeawayData?.workPlan || []).map((wp: any, i: number) => ({
          id: wp.id || `wp-${i}`,
          text: wp.text,
          completed: false,
        })),
      };

      onConclude(newTakeaway);
    } catch (err: any) {
      console.error('Conclude error:', err);
      // Fallback takeaway with explicit TBD - never fill fake text!
      const fallbackTakeaway: ReflectionTakeaway = {
        id: `takeaway-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        timestamp: Date.now(),
        title: entry.event ? entry.event.slice(0, 48) + '...' : 'Reflection',
        entry,
        messages,
        dominantThought: entry.thoughts || (isSpanish ? 'Pensamiento registrado.' : 'Recorded thought.'),
        pattern: {
          name: isSpanish ? 'Patrón por explorar' : 'Pattern to be explored',
          description: isSpanish
            ? 'Los patrones de pensamiento se identifican al explorar la evidencia en el diálogo.'
            : 'Thinking patterns are identified as evidence is examined during dialogue.',
          identified: false,
        },
        balancedPerspective: 'TBD',
        insights: [
          isSpanish ? 'Registro inicial guardado para continuar la reflexión.' : 'Initial entry preserved to continue reflection.',
        ],
        workPlan: [
          {
            id: 'wp-1',
            text: isSpanish ? 'Continuar la reflexión para formular una perspectiva equilibrada.' : 'Continue reflection to formulate a balanced perspective.',
            completed: false,
          },
          {
            id: 'wp-2',
            text: isSpanish ? 'Practicar 2 minutos de respiración pausada hoy.' : 'Practice 2 minutes of paced breathing today.',
            completed: false,
          },
        ],
      };
      onConclude(fallbackTakeaway);
    } finally {
      setIsConcluding(false);
    }
  };

  const userMessageCount = messages.filter((m) => m.role === 'user').length;

  return (
    <div className="flex flex-col h-[calc(100vh-70px)] max-w-2xl mx-auto">
      {/* Session Top Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-2.5 rounded-2xl shadow-2xs mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExit}
              className="text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-stone-100"
            >
              Exit
            </button>
            <span className="text-stone-300">/</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-stone-700">
                {isSpanish ? 'Guía de Reflexión' : 'Reflection Coach'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick calming breath trigger */}
            <button
              type="button"
              onClick={onOpenBreathe}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              title="Pause & take a breath"
            >
              <Wind className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">{isSpanish ? 'Respirar' : 'Pause'}</span>
            </button>

            {/* Conclude Entry CTA in Header */}
            <button
              type="button"
              onClick={handleConcludeSession}
              disabled={isConcluding}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#154E48] hover:bg-[#0F3B36] text-white shadow-xs transition-all cursor-pointer ring-2 ring-[#154E48]/20 active:scale-95"
              title={isSpanish ? 'Concluir esta reflexión y guardar tu síntesis' : 'Conclude this reflection and save your takeaway'}
            >
              {isConcluding ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>{isSpanish ? 'Sintetizando...' : 'Synthesizing...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isSpanish ? 'Concluir Registro' : 'Conclude Entry'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CBT 4-Stage Progress Track */}
        <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] font-semibold">
          <div className="flex items-center gap-1 sm:gap-2">
            <span
              className={`px-2 py-0.5 rounded-full transition-colors ${
                stage === 'CLARIFY'
                  ? 'bg-[#154E48] text-white font-bold shadow-2xs'
                  : 'bg-stone-100 text-stone-500'
              }`}
            >
              1. {isSpanish ? 'Aclarar' : 'Clarify'}
            </span>
            <span className="text-stone-300">→</span>
            <span
              className={`px-2 py-0.5 rounded-full transition-colors ${
                stage === 'EXPLORE'
                  ? 'bg-[#154E48] text-white font-bold shadow-2xs'
                  : 'bg-stone-100 text-stone-500'
              }`}
            >
              2. {isSpanish ? 'Explorar' : 'Explore'}
            </span>
            <span className="text-stone-300">→</span>
            <span
              className={`px-2 py-0.5 rounded-full transition-colors ${
                stage === 'SUMMARIZE'
                  ? 'bg-[#154E48] text-white font-bold shadow-2xs'
                  : 'bg-stone-100 text-stone-500'
              }`}
            >
              3. {isSpanish ? 'Resumir' : 'Summarize'}
            </span>
            <span className="text-stone-300">→</span>
            <span
              className={`px-2 py-0.5 rounded-full transition-colors ${
                stage === 'WORK_PLAN'
                  ? 'bg-[#154E48] text-white font-bold shadow-2xs'
                  : 'bg-stone-100 text-stone-500'
              }`}
            >
              4. {isSpanish ? 'Plan' : 'Work Plan'}
            </span>
          </div>
          <span className="text-stone-400 font-normal hidden sm:inline">
            {stage === 'CLARIFY' && (isSpanish ? 'Identificando pensamiento clave' : 'Finding the hot thought')}
            {stage === 'EXPLORE' && (isSpanish ? 'Examinando evidencia y perspectivas' : 'Examining evidence together')}
            {stage === 'SUMMARIZE' && (isSpanish ? 'Formulando perspectiva equilibrada' : 'Reframing in your own words')}
            {stage === 'WORK_PLAN' && (isSpanish ? 'Definiendo acciones concretas' : 'Agreeing on concrete steps')}
          </span>
        </div>

        {/* Small Expandable "View Entry" Control */}
        <div className="mt-2 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setIsEntryExpanded(!isEntryExpanded)}
            className="w-full flex items-center justify-between text-xs text-stone-600 hover:text-stone-900 transition-colors py-0.5 cursor-pointer"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <span>View original entry context</span>
              <span className="text-[10px] text-stone-400">
                ({entry.emotions.length} emotions recorded)
              </span>
            </span>
            {isEntryExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            )}
          </button>

          {isEntryExpanded && (
            <div className="mt-2.5 p-3.5 bg-stone-50 rounded-2xl text-xs space-y-2 border border-stone-200/60 animate-in fade-in duration-200">
              <div className="flex items-start gap-2">
                <Camera className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-700 block">Event:</span>
                  <p className="text-stone-600 leading-relaxed">{entry.event}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Brain className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-700 block">Thoughts:</span>
                  <p className="text-stone-600 leading-relaxed">{entry.thoughts}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Heart className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-700 block">Emotions:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {entry.emotions.map((em) => (
                      <span
                        key={em.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-stone-200 rounded-md text-[11px] text-stone-700"
                      >
                        <span>{em.name}</span>
                        <span className="font-semibold text-stone-500">{em.intensity}/10</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Activity className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-700 block">Actions:</span>
                  <p className="text-stone-600 leading-relaxed">{entry.actions}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Safety Notice Banner if triggered */}
      {safetyNotice && (
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl mb-3 flex items-start justify-between gap-3 text-xs text-rose-900 animate-in fade-in">
          <div className="flex items-start gap-2">
            <LifeBuoy className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Immediate Support Available</p>
              <p className="mt-0.5 leading-relaxed">{safetyNotice}</p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenSafety}
                  className="font-bold underline cursor-pointer hover:text-rose-800"
                >
                  View Crisis Helplines (988, 741741)
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSafetyNotice(null)}
            className="text-rose-400 hover:text-rose-600 p-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 pb-4">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div className="text-[11px] text-stone-400 mb-1 px-1 flex items-center gap-1.5">
                <span>{isUser ? 'You' : 'Reflection Coach'}</span>
                <span>·</span>
                <span>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div
                className={`rounded-3xl p-4 md:p-5 max-w-[90%] md:max-w-[85%] text-sm leading-relaxed transition-all ${
                  isUser
                    ? 'bg-stone-900 text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-xs shadow-xs'
                }`}
              >
                {/* Render paragraphs cleanly */}
                <div className="space-y-3 whitespace-pre-wrap">
                  {message.content.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Coach indicator */}
        {isLoading && (
          <div className="flex flex-col items-start max-w-full">
            <div className="text-[11px] text-stone-400 mb-1 px-1">
              <span>Reflection Coach is reflecting...</span>
            </div>
            <div className="bg-white rounded-3xl p-4 border border-stone-200/80 rounded-bl-xs shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7FB8BD] animate-bounce"></span>
              <span
                className="w-2 h-2 rounded-full bg-[#7FB8BD] animate-bounce"
                style={{ animationDelay: '150ms' }}
              ></span>
              <span
                className="w-2 h-2 rounded-full bg-[#7FB8BD] animate-bounce"
                style={{ animationDelay: '300ms' }}
              ></span>
            </div>
          </div>
        )}

        {/* Error message card with retry */}
        {error && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={handleRetryLastMessage}
              className="flex items-center gap-1 font-semibold text-amber-800 hover:text-amber-950 underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Inline Conclude Prompt at bottom of stream once user has engaged */}
        {userMessageCount >= 1 && !isLoading && (
          <div className="flex justify-center pt-2 pb-1">
            <button
              type="button"
              onClick={handleConcludeSession}
              disabled={isConcluding}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#F2FAF9] border border-[#BDE3DD] hover:border-[#154E48] text-[#154E48] font-bold text-xs rounded-2xl shadow-2xs transition-all cursor-pointer hover:shadow-xs active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-[#154E48]" />
              <span>
                {isSpanish
                  ? '¿Listo para terminar? Concluir Registro y Ver Síntesis'
                  : 'Ready to finish? Conclude Entry & View Takeaway'}
              </span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Prominent Always-Visible Conclude Action Bar directly above input */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-gradient-to-r from-[#EBF6F4] via-[#F2FAF8] to-emerald-50/70 border border-[#BDE3DD] rounded-2xl mb-2 text-xs shadow-2xs">
        <div className="flex items-center gap-2 text-[#154E48]">
          <Sparkles className="w-4 h-4 text-[#154E48] shrink-0" />
          <span className="font-bold text-stone-800">
            {isSpanish
              ? '¿Listo para concluir?'
              : 'Conclude reflection?'}
          </span>
          <span className="hidden sm:inline text-stone-500 text-[11px]">
            {isSpanish
              ? 'Guarda tu aprendizaje y plan de acción en el archivo'
              : 'Save your takeaway & action plan'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleConcludeSession}
          disabled={isConcluding}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#154E48] hover:bg-[#0F3B36] text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
        >
          {isConcluding ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{isSpanish ? 'Sintetizando...' : 'Concluding...'}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSpanish ? 'Concluir Registro' : 'Conclude Entry'}</span>
            </>
          )}
        </button>
      </div>

      {/* Input Composer */}
      <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-3xl p-2 shadow-sm relative">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your response... (e.g. 'What makes me think that is...')"
            rows={1}
            disabled={isLoading || isConcluding}
            className="flex-1 max-h-32 p-3 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 resize-none text-stone-800 placeholder-stone-400"
          />

          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Dictate message with voice'}
            aria-label="Voice input"
          >
            {isListening ? (
              <Mic className="w-4 h-4 animate-bounce" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading || isConcluding}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              inputValue.trim() && !isLoading && !isConcluding
                ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-xs'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="px-3 pt-1 flex items-center justify-between text-[11px] text-stone-400">
          <span>Press Enter to send · Shift+Enter for new line</span>
          <span>End session whenever ready with "Conclude Entry"</span>
        </div>
      </div>
    </div>
  );
};
