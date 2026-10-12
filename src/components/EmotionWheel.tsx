import React, { useState, useMemo } from 'react';
import { EmotionItem } from '../types';
import { useLanguage } from '../i18n';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  X,
  Sparkles,
  Info,
  Check,
  Sliders,
  Heart,
} from 'lucide-react';

export interface EmotionWheelProps {
  selectedEmotions: EmotionItem[];
  onChange: (emotions: EmotionItem[]) => void;
}

export interface EmotionCategory {
  id: string;
  name: string;
  fractionLabel: string;
  color: string;
  accentColor: string;
  bgLight: string;
  borderLight: string;
  textDark: string;
  secondary: string[];
  nuances: string[];
}

export const FIVE_EMOTION_SECTORS: EmotionCategory[] = [
  {
    id: 'fear',
    name: 'Fear',
    fractionLabel: '1/5 Fear & Anxiety',
    color: '#4F46E5', // Indigo
    accentColor: '#6366F1',
    bgLight: '#EEF2FF',
    borderLight: '#C7D2FE',
    textDark: '#312E81',
    secondary: ['Anxious', 'Insecure', 'Overwhelmed'],
    nuances: [
      'Worried',
      'Apprehensive',
      'Inadequate',
      'Inferior',
      'Helpless',
      'Frightened',
    ],
  },
  {
    id: 'sadness',
    name: 'Sadness',
    fractionLabel: '2/5 Sadness & Grief',
    color: '#2563EB', // Blue
    accentColor: '#3B82F6',
    bgLight: '#EFF6FF',
    borderLight: '#BFDBFE',
    textDark: '#1E3A8A',
    secondary: ['Lonely', 'Vulnerable', 'Despair'],
    nuances: [
      'Isolated',
      'Abandoned',
      'Fragile',
      'Exposed',
      'Hopeless',
      'Grief-stricken',
    ],
  },
  {
    id: 'anger',
    name: 'Anger',
    fractionLabel: '3/5 Anger & Frustration',
    color: '#DC2626', // Red
    accentColor: '#EF4444',
    bgLight: '#FEF2F2',
    borderLight: '#FECACA',
    textDark: '#7F1D1D',
    secondary: ['Frustrated', 'Resentful', 'Critical'],
    nuances: [
      'Annoyed',
      'Infuriated',
      'Bitter',
      'Indignant',
      'Judgmental',
      'Dismissive',
    ],
  },
  {
    id: 'disgust',
    name: 'Disgust',
    fractionLabel: '4/5 Disgust & Shame',
    color: '#059669', // Emerald
    accentColor: '#10B981',
    bgLight: '#ECFDF5',
    borderLight: '#A7F3D0',
    textDark: '#064E3B',
    secondary: ['Disapproving', 'Disappointed', 'Awful'],
    nuances: [
      'Repelled',
      'Contemptuous',
      'Let down',
      'Appalled',
      'Nauseated',
      'Detestable',
    ],
  },
  {
    id: 'joy',
    name: 'Joy',
    fractionLabel: '5/5 Joy & Contentment',
    color: '#D97706', // Amber
    accentColor: '#F59E0B',
    bgLight: '#FFFBEB',
    borderLight: '#FDE68A',
    textDark: '#78350F',
    secondary: ['Peaceful', 'Confident', 'Grateful'],
    nuances: [
      'Serene',
      'Relieved',
      'Empowered',
      'Courageous',
      'Appreciative',
      'Hopeful',
    ],
  },
];

// Short psychology definitions for all emotions to validate user's feeling on toggle
export const EMOTION_DEFINITIONS: Record<string, string> = {
  // Fear & Anxiety
  fear: 'A primal survival response to perceived danger, threat, or acute vulnerability.',
  anxious: 'Unease or apprehension about future uncertainties, risks, or upcoming events.',
  insecure: 'Feeling uncertain of your worth, emotional safety, or standing in a situation.',
  overwhelmed: 'Submerged under excessive mental, emotional, or sensory demands.',
  worried: 'Repetitive mental focus on potential negative outcomes and difficulties.',
  apprehensive: 'A cautious foreboding that something unpleasant or awkward is about to happen.',
  inadequate: 'Feeling incapable or lacking the necessary competence, skill, or worth.',
  inferior: 'Believing you compare unfavorably to others in ability, value, or status.',
  helpless: 'Feeling unable to protect yourself, alter your circumstances, or take effective action.',
  frightened: 'Sudden, acute alarm or terror sparked by an immediate perceived threat.',

  // Sadness & Grief
  sadness: 'Painful grief, heavy emotional ache, or sorrow over a loss or disappointment.',
  lonely: 'The ache of feeling disconnected, unseen, or lacking warm companionship.',
  vulnerable: 'Feeling emotionally exposed, defenseless, and susceptible to hurt or critique.',
  despair: 'The painful absence of hope, feeling that relief or resolution is impossible.',
  isolated: 'Cut off physically or emotionally from meaningful connection and community.',
  abandoned: 'Feeling discarded, deserted, or left behind by people you trusted.',
  fragile: 'Easily shattered; feeling emotionally or physically close to breaking under strain.',
  exposed: 'Unprotected, with inner flaws or tender sensitivities visible to outside judgment.',
  hopeless: 'Convinced that future improvement or happiness is entirely out of reach.',
  'grief-stricken': 'Intense bereavement and profound mourning for what has been lost.',

  // Anger & Frustration
  anger: 'A powerful surge of defensive energy provoked by a perceived boundary violation or harm.',
  frustrated: 'Blocked or thwarted from achieving an important goal or fulfilling a need.',
  resentful: 'Lingering bitterness over being treated unfairly, exploited, or taken for granted.',
  critical: 'An urge to find fault, condemn imperfections, or focus on errors.',
  annoyed: 'Mild irritation or impatience sparked by petty nuisances or interruptions.',
  infuriated: 'Burning outrage and blinding indignation at an intolerable injustice or mistreatment.',
  bitter: 'Deep-seated cynicism and sour resentment over unhealed past grievances.',
  indignant: 'Anger and offense sparked by what is perceived as unfair, unethical, or disrespectful treatment.',
  judgmental: 'Mentally ranking, blaming, or condemning others with harsh moral scrutiny.',
  dismissive: 'Rejecting someone or something as unworthy of consideration, time, or respect.',

  // Disgust & Shame
  disgust: 'A strong visceral aversion or revulsion toward something noxious or offensive.',
  disapproving: 'Holding an unfavorable moral, ethical, or behavioral opinion of an action.',
  disappointed: 'Sorrow or distress when reality fails to live up to positive hopes or promises.',
  awful: 'A heavy sensation of dread, wretchedness, or profound unpleasantness.',
  repelled: 'Viscerally driven back or disgusted by an idea, person, or behavior.',
  contemptuous: 'Scornful superiority; looking down upon someone as utterly unworthy or beneath you.',
  'let down': 'Hurt by someone’s broken promise, unreliability, or failure to show up.',
  appalled: 'Deep shock and moral dismay at something atrocious, careless, or unacceptable.',
  nauseated: 'Physical or emotional sickness sparked by repulsive circumstances.',
  detestable: 'Deserving intense moral rejection, disgust, or total avoidance.',

  // Joy & Contentment
  joy: 'A bright, uplifting state of deep pleasure, vitality, and gratitude.',
  peaceful: 'Inner calm, harmony, and liberation from mental agitation or conflict.',
  confident: 'Firm trust in your self-worth, capabilities, and decision-making power.',
  grateful: 'Warm thankfulness and heartfelt appreciation for kindness or goodness received.',
  serene: 'Untroubled stillness and tranquil clarity, untouched by external storms.',
  relieved: 'Release from acute anxiety, tension, or threat after danger passes.',
  empowered: 'Equipped with agency, self-determination, and inner strength to act.',
  courageous: 'Willingness to face fear, adversity, or discomfort despite feeling trembling.',
  appreciative: 'Mindfully recognizing, honoring, and savoring the beauty or value of life.',
  hopeful: 'Expectant confidence that positive outcomes and brighter days are ahead.',
};

// Backwards compatibility alias
export const EMOTION_CATEGORIES = FIVE_EMOTION_SECTORS;

// Helper function to create an SVG annular sector (pie wedge / arc band)
function describeArc(
  cx: number,
  cy: number,
  rIn: number,
  rOut: number,
  startDeg: number,
  endDeg: number
): string {
  const startRad = (startDeg * Math.PI) / 180;
  const endRad = (endDeg * Math.PI) / 180;

  const x1 = cx + rIn * Math.cos(startRad);
  const y1 = cy + rIn * Math.sin(startRad);
  const x2 = cx + rOut * Math.cos(startRad);
  const y2 = cy + rOut * Math.sin(startRad);
  const x3 = cx + rOut * Math.cos(endRad);
  const y3 = cy + rOut * Math.sin(endRad);
  const x4 = cx + rIn * Math.cos(endRad);
  const y4 = cy + rIn * Math.sin(endRad);

  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return [
    `M ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${rOut} ${rOut} 0 ${largeArc} 1 ${x3} ${y3}`,
    `L ${x4} ${y4}`,
    `A ${rIn} ${rIn} 0 ${largeArc} 0 ${x1} ${y1}`,
    'Z',
  ].join(' ');
}

export const EmotionWheel: React.FC<EmotionWheelProps> = ({
  selectedEmotions,
  onChange,
}) => {
  const { isSpanish } = useLanguage();

  // Sector index (0 to 4: Fear, Sadness, Anger, Disgust, Joy)
  const [activeSectorIndex, setActiveSectorIndex] = useState(0);

  // Currently focused emotion definition to display when toggled
  const [activeDefinition, setActiveDefinition] = useState<{
    name: string;
    category: string;
    definition: string;
  } | null>(null);

  const [customInput, setCustomInput] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);

  const currentSector = FIVE_EMOTION_SECTORS[activeSectorIndex];

  // Helper to check if an emotion is selected
  const isEmotionSelected = (emotionName: string) => {
    return selectedEmotions.some(
      (e) => e.name.toLowerCase() === emotionName.toLowerCase()
    );
  };

  const handleToggleEmotion = (emotionName: string, categoryName: string) => {
    const key = emotionName.toLowerCase();
    const definition =
      EMOTION_DEFINITIONS[key] ||
      (isSpanish
        ? `Sensaciones asociadas a ${categoryName.toLowerCase()}.`
        : `Experiencing feelings connected with ${categoryName.toLowerCase()}.`);

    // Always show the definition when toggled/clicked
    setActiveDefinition({
      name: emotionName,
      category: categoryName,
      definition,
    });

    const existingIndex = selectedEmotions.findIndex(
      (e) => e.name.toLowerCase() === key
    );

    if (existingIndex >= 0) {
      // Deselect
      onChange(selectedEmotions.filter((_, idx) => idx !== existingIndex));
    } else {
      // Add with default intensity 7
      const newEmotion: EmotionItem = {
        id: `${key}-${Date.now()}`,
        name: emotionName,
        category: categoryName,
        intensity: 7,
      };
      onChange([...selectedEmotions, newEmotion]);
    }
  };

  const handleSetIntensity = (id: string, newIntensity: number) => {
    const bounded = Math.max(1, Math.min(10, Math.round(newIntensity)));
    onChange(
      selectedEmotions.map((e) =>
        e.id === id ? { ...e, intensity: bounded } : e
      )
    );
  };

  const handleRemoveEmotion = (id: string) => {
    onChange(selectedEmotions.filter((e) => e.id !== id));
  };

  const handlePrevSector = () => {
    setActiveSectorIndex((prev) =>
      prev === 0 ? FIVE_EMOTION_SECTORS.length - 1 : prev - 1
    );
  };

  const handleNextSector = () => {
    setActiveSectorIndex((prev) =>
      prev === FIVE_EMOTION_SECTORS.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddCustomEmotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const trimmed = customInput.trim();
    const existing = selectedEmotions.find(
      (em) => em.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (!existing) {
      const newEmotion: EmotionItem = {
        id: `custom-${Date.now()}`,
        name: trimmed,
        category: 'Custom',
        intensity: 7,
      };
      onChange([...selectedEmotions, newEmotion]);
      setActiveDefinition({
        name: trimmed,
        category: isSpanish ? 'Sentimiento personalizado' : 'Custom Feeling',
        definition: isSpanish
          ? 'Una sensación personal con la que te identificas en este momento.'
          : 'A personal feeling or sensation you identify with right now.',
      });
    }
    setCustomInput('');
    setShowAddCustom(false);
  };

  const getIntensityMeta = (val: number) => {
    if (val <= 3) {
      return {
        label: isSpanish ? 'Leve' : 'Mild',
        badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
      };
    }
    if (val <= 6) {
      return {
        label: isSpanish ? 'Moderada' : 'Moderate',
        badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
      };
    }
    if (val <= 8) {
      return {
        label: isSpanish ? 'Intensa' : 'Strong',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    }
    return {
      label: isSpanish ? 'Muy intensa' : 'Severe / Acute',
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    };
  };

  // Precomputed geometry for 1/5th sector fan view
  const sectorGeometry = useMemo(() => {
    const cx = 200;
    const cy = 330;
    const baseStart = -126;
    const totalSpan = 72; // 1/5th

    // Tier 1: Core (single wedge)
    const coreArc = describeArc(cx, cy, 60, 130, baseStart, baseStart + totalSpan);
    const coreTextPos = {
      x: cx,
      y: cy - 95,
      angle: 0,
    };

    // Tier 2: Secondary (3 wedges, 24° each)
    const secondaryWedges = currentSector.secondary.map((secName, idx) => {
      const span = totalSpan / 3;
      const start = baseStart + idx * span;
      const end = start + span;
      const arcPath = describeArc(cx, cy, 134, 222, start, end);
      const midAngle = (start + end) / 2;
      const midRad = (midAngle * Math.PI) / 180;
      const r = 178;
      return {
        name: secName,
        arcPath,
        textX: cx + r * Math.cos(midRad),
        textY: cy + r * Math.sin(midRad),
        rotation: midAngle + 90,
      };
    });

    // Tier 3: Nuances (6 wedges, 12° each)
    const nuanceWedges = currentSector.nuances.map((nuanceName, idx) => {
      const span = totalSpan / 6;
      const start = baseStart + idx * span;
      const end = start + span;
      const arcPath = describeArc(cx, cy, 226, 320, start, end);
      const midAngle = (start + end) / 2;
      const midRad = (midAngle * Math.PI) / 180;
      const r = 273;
      return {
        name: nuanceName,
        arcPath,
        textX: cx + r * Math.cos(midRad),
        textY: cy + r * Math.sin(midRad),
        rotation: midAngle + 90,
      };
    });

    return {
      coreArc,
      coreTextPos,
      secondaryWedges,
      nuanceWedges,
    };
  }, [currentSector]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* 1. LEFT MAIN PANEL: Emotion Wheel (lg:col-span-7) */}
      <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 shadow-xs p-4 sm:p-5 space-y-4">
        {/* Title & Active Sector Badge */}
        <div className="flex items-center justify-between pb-1 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#154E48]" />
            <h3 className="text-lg font-serif font-extrabold text-stone-900 tracking-tight">
              {isSpanish ? 'Rueda de Emociones' : 'Wheel of Emotions'}
            </h3>
          </div>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full border shadow-2xs transition-colors"
            style={{
              backgroundColor: currentSector.bgLight,
              color: currentSector.textDark,
              borderColor: currentSector.borderLight,
            }}
          >
            {currentSector.name}
          </span>
        </div>

        {/* Number Bar (1 to 5) */}
        <div className="flex items-center justify-center gap-2 py-1">
          <button
            type="button"
            onClick={handlePrevSector}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title={isSpanish ? 'Sector anterior' : 'Previous sector'}
            aria-label="Previous sector"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center p-1 bg-stone-100/90 rounded-2xl border border-stone-200/70 shadow-2xs gap-1.5">
            {[1, 2, 3, 4, 5].map((num, idx) => {
              const isActive = idx === activeSectorIndex;
              const sector = FIVE_EMOTION_SECTORS[idx];
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setActiveSectorIndex(idx);
                    const key = sector.name.toLowerCase();
                    setActiveDefinition({
                      name: sector.name,
                      category: sector.name,
                      definition:
                        EMOTION_DEFINITIONS[key] ||
                        `Core emotion family: ${sector.name}.`,
                    });
                  }}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center ${
                    isActive
                      ? 'bg-[#154E48] text-white shadow-xs scale-105'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                  }`}
                  aria-label={`Sector ${num}: ${sector.name}`}
                  title={`Sector ${num}: ${sector.name}`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNextSector}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title={isSpanish ? 'Siguiente sector' : 'Next sector'}
            aria-label="Next sector"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Enlarged Radial 1/5th Arc */}
        <div className="relative w-full aspect-[400/285] select-none my-1">
          <svg
            viewBox="0 5 400 285"
            className="w-full h-full drop-shadow-sm transition-all duration-300"
          >
            {/* Arc Ring Background track */}
            <path
              d={describeArc(200, 330, 56, 324, -128, -52)}
              fill="#F8FAF9"
              stroke="#E2E8F0"
              strokeWidth="1.5"
            />

            {/* Tier 1: Core Emotion Wedge (Inner hub, 72° arc) */}
            {(() => {
              const isSelected = isEmotionSelected(currentSector.name);
              return (
                <g
                  key={currentSector.id}
                  onClick={() => handleToggleEmotion(currentSector.name, currentSector.name)}
                  className="cursor-pointer group"
                >
                  <path
                    d={sectorGeometry.coreArc}
                    fill={isSelected ? currentSector.color : currentSector.bgLight}
                    stroke={isSelected ? '#154E48' : currentSector.borderLight}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-colors hover:brightness-95"
                  />
                  <text
                    x={sectorGeometry.coreTextPos.x}
                    y={sectorGeometry.coreTextPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="13"
                    fontWeight="bold"
                    className={`pointer-events-none select-none tracking-wide ${
                      isSelected ? 'fill-white' : ''
                    }`}
                    style={{ fill: isSelected ? '#FFFFFF' : currentSector.textDark }}
                  >
                    {isSelected ? `✓ ${currentSector.name}` : currentSector.name}
                  </text>
                </g>
              );
            })()}

            {/* Tier 2: Secondary Emotions (3 Wedges, 24° each) */}
            {sectorGeometry.secondaryWedges.map((sec) => {
              const isSelected = isEmotionSelected(sec.name);
              return (
                <g
                  key={sec.name}
                  onClick={() => handleToggleEmotion(sec.name, currentSector.name)}
                  className="cursor-pointer group"
                >
                  <path
                    d={sec.arcPath}
                    fill={
                      isSelected
                        ? currentSector.color
                        : `${currentSector.color}18`
                    }
                    stroke={isSelected ? '#154E48' : '#FFFFFF'}
                    strokeWidth={isSelected ? 2.5 : 1.8}
                    className="transition-colors hover:brightness-95"
                  />
                  <text
                    x={sec.textX}
                    y={sec.textY}
                    transform={`rotate(${sec.rotation}, ${sec.textX}, ${sec.textY})`}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="12"
                    fontWeight={isSelected ? 'bold' : '600'}
                    className="pointer-events-none select-none tracking-tight"
                    style={{
                      fill: isSelected ? '#FFFFFF' : currentSector.textDark,
                    }}
                  >
                    {isSelected ? `✓ ${sec.name}` : sec.name}
                  </text>
                </g>
              );
            })}

            {/* Tier 3: Nuance Emotions (6 Wedges, 12° each) */}
            {sectorGeometry.nuanceWedges.map((nuance) => {
              const isSelected = isEmotionSelected(nuance.name);
              return (
                <g
                  key={nuance.name}
                  onClick={() => handleToggleEmotion(nuance.name, currentSector.name)}
                  className="cursor-pointer group"
                >
                  <path
                    d={nuance.arcPath}
                    fill={
                      isSelected
                        ? currentSector.accentColor
                        : `${currentSector.color}10`
                    }
                    stroke={isSelected ? '#154E48' : '#FFFFFF'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-colors hover:brightness-95"
                  />
                  <text
                    x={nuance.textX}
                    y={nuance.textY}
                    transform={`rotate(${nuance.rotation}, ${nuance.textX}, ${nuance.textY})`}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="10.5"
                    fontWeight={isSelected ? 'bold' : '600'}
                    className="pointer-events-none select-none tracking-tight"
                    style={{
                      fill: isSelected ? '#FFFFFF' : '#334155',
                    }}
                  >
                    {isSelected ? `✓ ${nuance.name}` : nuance.name}
                  </text>
                </g>
              );
            })}

            {/* Center Pivot Point Label */}
            <circle cx="200" cy="330" r="22" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <text
              x="200"
              y="330"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fontWeight="bold"
              fill="#64748B"
            >
              {activeSectorIndex + 1}/5
            </text>
          </svg>
        </div>

        {/* DEFINITION ON TOGGLE: Short emotion definition displayed when toggled */}
        {activeDefinition && (
          <div className="p-3 bg-[#F4F9F8] rounded-2xl border border-[#CCE8E4] flex items-start gap-2.5 transition-all">
            <div className="w-5 h-5 rounded-full bg-[#154E48] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Info className="w-3 h-3" />
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">
                  {activeDefinition.name}
                </span>
                <span className="text-[10px] font-semibold text-[#154E48] bg-white px-2 py-0.5 rounded-full border border-[#BDE3DD]">
                  {activeDefinition.category}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                {activeDefinition.definition}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveDefinition(null)}
              className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
              title="Dismiss definition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Add unlisted custom emotion input */}
        <div className="pt-1 border-t border-stone-100">
          {showAddCustom ? (
            <form onSubmit={handleAddCustomEmotion} className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={
                  isSpanish
                    ? 'Escribe otra emoción (ej. nostálgico, entumecido)...'
                    : 'Type other feeling (e.g. nostalgic, numb)...'
                }
                className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#154E48]"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold bg-[#154E48] text-white rounded-xl hover:bg-[#0F3B36] transition-colors"
              >
                {isSpanish ? 'Agregar' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="px-2.5 py-1.5 text-xs text-stone-500 hover:text-stone-800"
              >
                {isSpanish ? 'Cancelar' : 'Cancel'}
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddCustom(true)}
              className="text-xs font-semibold text-[#154E48] hover:text-[#0F3B36] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSpanish ? 'Agregar otra emoción no listada' : 'Add unlisted emotion'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. RIGHT PANEL: DEDICATED EMOTIONS SIDEBAR (lg:col-span-5) */}
      <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/90 shadow-xs p-4 sm:p-5 space-y-4 lg:sticky lg:top-4">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#154E48]" />
            <h4 className="text-base font-serif font-bold text-stone-900 tracking-tight">
              {isSpanish ? 'Panel de Intensidad' : 'Emotions Sidebar'}
            </h4>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EBF6F4] text-[#154E48] border border-[#BCE4DE] shadow-2xs">
            {selectedEmotions.length} {isSpanish ? 'seleccionadas' : 'selected'}
          </span>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed">
          {isSpanish
            ? 'Ajusta el nivel de intensidad (1 a 10) arrastrando el control o usando los botones + y -.'
            : 'Set your emotional intensity (1 to 10) by dragging the slider or tapping + and -.'}
        </p>

        {/* Emotions List in Sidebar */}
        {selectedEmotions.length > 0 ? (
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {selectedEmotions.map((emotion) => {
              const meta = getIntensityMeta(emotion.intensity);
              const sectorMatch = FIVE_EMOTION_SECTORS.find(
                (s) => s.name.toLowerCase() === emotion.category.toLowerCase()
              );
              const accentBg = sectorMatch?.bgLight || '#F3F4F6';
              const accentText = sectorMatch?.textDark || '#374151';
              const accentBorder = sectorMatch?.borderLight || '#E5E7EB';

              return (
                <div
                  key={emotion.id}
                  className="p-3.5 rounded-2xl bg-stone-50/95 border border-stone-200/90 space-y-2.5 hover:border-stone-300 transition-all shadow-2xs"
                >
                  {/* Emotion title & category badge & remove */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sectorMatch?.color || '#154E48' }}></span>
                      <span className="font-bold text-stone-900 text-sm truncate">
                        {emotion.name}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0"
                        style={{
                          backgroundColor: accentBg,
                          color: accentText,
                          borderColor: accentBorder,
                        }}
                      >
                        {emotion.category}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveEmotion(emotion.id)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
                      title={isSpanish ? `Eliminar ${emotion.name}` : `Remove ${emotion.name}`}
                      aria-label={`Remove ${emotion.name}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Intensity numeric display & level badge */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-extrabold text-stone-900 text-base tabular-nums">
                        {emotion.intensity}
                      </span>
                      <span className="text-stone-400 font-medium">/ 10</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badgeClass}`}
                    >
                      {meta.label}
                    </span>
                  </div>

                  {/* Slider & Stepper Controls */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSetIntensity(emotion.id, emotion.intensity - 1)}
                      disabled={emotion.intensity <= 1}
                      className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs shrink-0"
                      aria-label="Decrease intensity"
                      title="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex-1 relative flex items-center px-1">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={emotion.intensity}
                        onChange={(e) =>
                          handleSetIntensity(emotion.id, parseInt(e.target.value, 10))
                        }
                        className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#154E48]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSetIntensity(emotion.id, emotion.intensity + 1)}
                      disabled={emotion.intensity >= 10}
                      className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs shrink-0"
                      aria-label="Increase intensity"
                      title="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State in Sidebar */
          <div className="py-8 px-4 text-center rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#EBF6F4] text-[#154E48] flex items-center justify-center mx-auto shadow-2xs">
              <Heart className="w-5 h-5 text-[#154E48]" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-stone-700">
                {isSpanish ? 'Sin emociones seleccionadas' : 'No emotions in sidebar yet'}
              </p>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {isSpanish
                  ? 'Toca cualquier emoción en la rueda de la izquierda para listarla aquí y ajustar su intensidad.'
                  : 'Tap feelings on the wheel to the left to list them here in this sidebar and set their intensity.'}
              </p>
            </div>

            {/* Quick popular suggestions */}
            <div className="pt-2">
              <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider mb-1.5">
                {isSpanish ? 'Añadir rápidamente' : 'Quick add'}
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {['Anxious', 'Insecure', 'Frustrated', 'Overwhelmed'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleToggleEmotion(item, 'Fear')}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white border border-stone-200 hover:border-[#154E48] hover:text-[#154E48] transition-colors cursor-pointer shadow-2xs"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Clear all action if multiple */}
        {selectedEmotions.length > 1 && (
          <div className="pt-2 border-t border-stone-100 flex justify-end">
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-[11px] text-stone-500 hover:text-rose-600 transition-colors cursor-pointer font-medium"
            >
              {isSpanish ? 'Quitar todas' : 'Clear all'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
