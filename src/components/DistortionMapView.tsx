import React, { useState, useEffect } from 'react';
import { useLanguage, SPANISH_DISTORTIONS_DATA } from '../i18n';
import { ReflectionTakeaway } from '../types';
import {
  Compass,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Lightbulb,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Trophy,
  Shield,
  Zap,
  BookmarkCheck,
  RotateCcw,
  MessageSquare,
  Swords,
  Flame,
  Award,
} from 'lucide-react';
import {
  TEN_COGNITIVE_DISTORTIONS,
  type CognitiveDistortion,
  DistortionIcon,
} from './DistortionIcons';
import { DistortionDetailModal } from './DistortionDetailModal';

// Re-export for any other files that might import them
export { TEN_COGNITIVE_DISTORTIONS, type CognitiveDistortion };

interface DistortionMapViewProps {
  onStartWithDistortion?: (distortionName: string) => void;
  takeaways?: ReflectionTakeaway[];
  onSelectTakeaway?: (takeaway: ReflectionTakeaway) => void;
  initialDistortionName?: string | null;
  onRevisitChat?: (takeaway: ReflectionTakeaway) => void;
  onLoadSampleTakeaways?: () => void;
}

const SCOUTED_STORAGE_KEY = 'thera_scouted_distortions';

export function getMatchingTakeawaysForDistortion(
  takeaways: ReflectionTakeaway[],
  distortion: CognitiveDistortion
): ReflectionTakeaway[] {
  if (!takeaways || takeaways.length === 0) return [];
  const dName = distortion.name.toLowerCase();
  const dId = distortion.id.toLowerCase();
  const dKeywords: Record<string, string[]> = {
    'all-or-nothing': ['all-or-nothing', 'black-and-white', 'polar', 'always', 'never', 'ruined', 'completely'],
    'catastrophizing': ['catastroph', 'worst', 'disaster', 'terrible', 'ruin', 'fired'],
    'mind-reading': ['mind reading', 'mind-reading', 'telepathy', 'think of me', 'they think', 'hate me', 'judging me', 'awkward', 'stranger'],
    'fortune-telling': ['fortune', 'fortune-telling', 'predicting', 'going to happen', 'predict', 'losing interest'],
    'mental-filter': ['mental filter', 'filter', 'filtering', 'tunnel', 'only focus on the bad'],
    'disqualifying-positive': ['disqualif', 'doesn\'t count', 'discount', 'fluke'],
    'emotional-reasoning': ['emotional reasoning', 'feels like fact', 'feel like', 'feel guilty'],
    'labeling': ['label', 'labeling', 'loser', 'stupid', 'idiot', 'failure', 'fool'],
    'should-statements': ['should', 'must', 'ought', 'have to', 'supposed to'],
    'personalization': ['personaliz', 'blame myself', 'my fault', 'self-blam', 'because of me'],
  };

  const keywords = dKeywords[dId] || [dName];

  return takeaways.filter((t) => {
    const patternName = (t.pattern?.name || '').toLowerCase();
    const patternDesc = (t.pattern?.description || '').toLowerCase();
    const thoughts = ((t.dominantThought || '') + ' ' + (t.entry?.thoughts || '')).toLowerCase();
    const event = (t.entry?.event || '').toLowerCase();
    const actions = (t.entry?.actions || '').toLowerCase();
    const insights = (t.insights || []).join(' ').toLowerCase();
    const messages = (t.messages || []).map((m) => m.content).join(' ').toLowerCase();

    // Direct pattern name match
    if (patternName.includes(dName) || dName.includes(patternName)) return true;
    if (distortion.aka && patternName.includes(distortion.aka.toLowerCase())) return true;

    // Keyword match in pattern name, description, thoughts, event, actions, insights, or messages
    return keywords.some(
      (kw) =>
        patternName.includes(kw) ||
        patternDesc.includes(kw) ||
        thoughts.includes(kw) ||
        event.includes(kw) ||
        actions.includes(kw) ||
        insights.includes(kw) ||
        messages.includes(kw)
    );
  });
}

export const DistortionMapView: React.FC<DistortionMapViewProps> = ({
  onStartWithDistortion,
  takeaways = [],
  onSelectTakeaway,
  initialDistortionName,
  onRevisitChat,
  onLoadSampleTakeaways,
}) => {
  const { t, isSpanish } = useLanguage();

  const getLocalizedDistortion = (d: CognitiveDistortion): CognitiveDistortion => {
    if (!isSpanish) return d;
    const es = SPANISH_DISTORTIONS_DATA[d.id];
    if (!es) return d;
    return {
      ...d,
      name: es.name,
      line1: es.line1,
      line2: es.line2,
      definition: es.definition,
      whyBrainDoesIt: es.whyBrainDoesIt,
      bookExample: es.bookExample,
      bookReframe: es.bookReframe,
      coreQuestion: es.coreQuestion,
      antidoteSteps: es.antidoteSteps,
    };
  };

  // Selected landmark
  const [selectedDistortion, setSelectedDistortion] = useState<CognitiveDistortion | null>(
    TEN_COGNITIVE_DISTORTIONS[0]
  );
  const [isReframeRevealed, setIsReframeRevealed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'cards'>('map');

  // Customization: personal entries vs standard CBT lore
  const [exampleTab, setExampleTab] = useState<'personal' | 'cbt'>('personal');
  const [personalEntryIndex, setPersonalEntryIndex] = useState(0);

  // Mini-game boss battle state
  const [isBossDisarmed, setIsBossDisarmed] = useState(false);
  const [testReframeInput, setTestReframeInput] = useState('');
  const [customReframeResult, setCustomReframeResult] = useState<string | null>(null);

  // Track discovered landmarks for game progression
  const [scoutedIds, setScoutedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SCOUTED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['all-or-nothing'];
    } catch {
      return ['all-or-nothing'];
    }
  });

  // Auto-select distortion when initialDistortionName is provided
  useEffect(() => {
    if (initialDistortionName) {
      const match = TEN_COGNITIVE_DISTORTIONS.find(
        (d) =>
          d.name.toLowerCase().includes(initialDistortionName.toLowerCase()) ||
          initialDistortionName.toLowerCase().includes(d.name.toLowerCase()) ||
          (d.aka && initialDistortionName.toLowerCase().includes(d.aka.toLowerCase()))
      );
      if (match) {
        setSelectedDistortion(match);
      }
    }
  }, [initialDistortionName]);

  // Calculate matching takeaways for current distortion
  const currentMatchingTakeaways = selectedDistortion
    ? getMatchingTakeawaysForDistortion(takeaways, selectedDistortion)
    : [];

  // Update example tab when selected distortion changes
  useEffect(() => {
    if (selectedDistortion) {
      const matches = getMatchingTakeawaysForDistortion(takeaways, selectedDistortion);
      if (matches.length > 0) {
        setExampleTab('personal');
        setPersonalEntryIndex(0);
      } else {
        setExampleTab('cbt');
      }
      setIsBossDisarmed(false);
      setCustomReframeResult(null);
      setTestReframeInput('');
    }
  }, [selectedDistortion?.id, takeaways.length]);

  const handleSelectDistortion = (distortion: CognitiveDistortion) => {
    setSelectedDistortion(distortion);
    setIsReframeRevealed(false);
    setPersonalEntryIndex(0);
    setIsBossDisarmed(false);
    setCustomReframeResult(null);
    setTestReframeInput('');

    // Mark as scouted
    if (!scoutedIds.includes(distortion.id)) {
      const updated = [...scoutedIds, distortion.id];
      setScoutedIds(updated);
      try {
        localStorage.setItem(SCOUTED_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }
  };

  const handleSelectNextDistortion = () => {
    if (!selectedDistortion) return;
    const currentIndex = TEN_COGNITIVE_DISTORTIONS.findIndex(
      (d) => d.id === selectedDistortion.id
    );
    const nextIndex = (currentIndex + 1) % TEN_COGNITIVE_DISTORTIONS.length;
    handleSelectDistortion(TEN_COGNITIVE_DISTORTIONS[nextIndex]);
  };

  const handleSelectPrevDistortion = () => {
    if (!selectedDistortion) return;
    const currentIndex = TEN_COGNITIVE_DISTORTIONS.findIndex(
      (d) => d.id === selectedDistortion.id
    );
    const prevIndex =
      (currentIndex - 1 + TEN_COGNITIVE_DISTORTIONS.length) %
      TEN_COGNITIVE_DISTORTIONS.length;
    handleSelectDistortion(TEN_COGNITIVE_DISTORTIONS[prevIndex]);
  };

  const scoutedProgressPercent = Math.round(
    (scoutedIds.length / TEN_COGNITIVE_DISTORTIONS.length) * 100
  );

  const totalPersonalEncounterCount = TEN_COGNITIVE_DISTORTIONS.filter(
    (d) => getMatchingTakeawaysForDistortion(takeaways, d).length > 0
  ).length;

  const activeDistortion = selectedDistortion ? getLocalizedDistortion(selectedDistortion) : null;
  const activePersonalTakeaway =
    currentMatchingTakeaways.length > 0
      ? currentMatchingTakeaways[personalEntryIndex % currentMatchingTakeaways.length]
      : null;

  return (
    <div className="max-w-4xl mx-auto pb-28 space-y-6 pt-2">
      {/* 1. Game Quest Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-300 bg-amber-50/90 text-amber-900 text-xs font-extrabold tracking-wider uppercase shadow-2xs mx-auto">
          <Compass className="w-3.5 h-3.5 text-amber-700 animate-spin-slow" />
          <span>{t.distortionsExpedition}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>{isSpanish ? 'Nivel 1' : 'Level 1 Quest'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-stone-900 tracking-tight">
          {t.distortionsTitle}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed font-medium">
          {t.distortionsSubtitle}
        </p>
      </div>

      {/* Quest Progress Tracker Bar */}
      <div className="bg-white/95 rounded-2xl p-3.5 sm:p-4 border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-900">
                {isSpanish ? 'Distorsiones Exploradas:' : 'Landmarks Scouted:'} {scoutedIds.length} / {TEN_COGNITIVE_DISTORTIONS.length}
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {scoutedProgressPercent}% {isSpanish ? 'Completado' : 'Explored'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              {scoutedIds.length === 10
                ? (isSpanish ? '🏆 ¡Cartógrafo Maestro! Las 10 distorsiones han sido identificadas.' : '🏆 Master Cartographer! All 10 cognitive distortions identified.')
                : (isSpanish ? 'Toca los puntos en el mapa para descubrir distorsiones y antídotos.' : 'Tap pins on the map below to discover distortions & antidotes.')}
            </p>
          </div>
        </div>

        {/* View Mode Toggle: Interactive Map vs Landmarks Roster */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            🗺️ Exploration Map
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            📋 Landmark Roster
          </button>
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE EXPLORATION MAP */}
      {viewMode === 'map' ? (
        <div className="relative w-full rounded-3xl overflow-hidden border-2 border-stone-300 shadow-lg bg-[#FAF6EE] select-none">
          {/* Map Topographic Background & Compass Rose */}
          <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#C2B296_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Decorative Compass Rose */}
          <div className="absolute top-4 right-4 pointer-events-none opacity-20 flex flex-col items-center">
            <span className="text-[9px] font-bold text-stone-700">N</span>
            <Compass className="w-16 h-16 text-stone-700" />
          </div>

          {/* Region Boundaries / Labels in Antique Style */}
          <div className="absolute top-3 left-4 text-[10px] font-extrabold uppercase tracking-widest text-stone-500 pointer-events-none">
            🌲 The Mind Wilderness
          </div>
          <div className="absolute bottom-3 left-4 text-[10px] font-extrabold uppercase tracking-widest text-stone-400 pointer-events-none">
            ⚓ Rationality Coastline
          </div>
          <div className="absolute bottom-3 right-4 text-[10px] font-extrabold uppercase tracking-widest text-stone-400 pointer-events-none">
            🔥 Drama Peaks Sector
          </div>

          {/* SVG Winding Expedition Trail Connecting the 10 Landmarks */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 16 18 Q 30 12 44 15 T 74 18 T 86 42 Q 74 48 60 52 T 30 46 T 14 70 Q 28 78 42 78 T 70 76 T 88 80"
              fill="none"
              stroke="#D4B996"
              strokeWidth="0.8"
              strokeDasharray="1.5 1.5"
            />
          </svg>

          {/* Map Canvas with Responsive Aspect Ratio */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] p-4">
            {TEN_COGNITIVE_DISTORTIONS.map((distortion) => {
              const isSelected = selectedDistortion?.id === distortion.id;
              const isScouted = scoutedIds.includes(distortion.id);

              return (
                <button
                  key={distortion.id}
                  type="button"
                  onClick={() => handleSelectDistortion(distortion)}
                  style={{
                    left: `${distortion.mapCoords.x}%`,
                    top: `${distortion.mapCoords.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300 focus:outline-none z-20 ${
                    isSelected ? 'scale-115 z-30' : 'hover:scale-105'
                  }`}
                  aria-label={distortion.gameLandmark}
                  title={`${distortion.gameLandmark} (${distortion.name})`}
                >
                  {/* Pin Body */}
                  <div className="flex flex-col items-center">
                    {/* Glowing pulse ring if selected */}
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-amber-400/40 animate-ping pointer-events-none" />
                    )}

                    {/* Circular Pin Icon */}
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-md border-2 transition-all relative ${
                        isSelected
                          ? 'bg-[#154E48] text-white border-amber-300 ring-4 ring-[#154E48]/20 scale-105'
                          : isScouted
                          ? 'bg-white border-stone-300 hover:border-[#154E48]'
                          : 'bg-stone-200/90 border-dashed border-stone-400 opacity-80'
                      }`}
                    >
                      <span>{distortion.gameEmoji}</span>

                      {/* Scouted Badge Checkmark */}
                      {isScouted && !isSelected && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#154E48] text-white text-[9px] flex items-center justify-center font-bold">
                          ✓
                        </span>
                      )}

                      {/* Personal Encounter Badge */}
                      {getMatchingTakeawaysForDistortion(takeaways, distortion).length > 0 && (
                        <span
                          className="absolute -bottom-1.5 -left-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-900 text-[8px] font-black border border-white shadow-xs flex items-center gap-0.5"
                          title={`${getMatchingTakeawaysForDistortion(takeaways, distortion).length} real-life reflection(s)`}
                        >
                          ⚡ {getMatchingTakeawaysForDistortion(takeaways, distortion).length}
                        </span>
                      )}
                    </div>

                    {/* Landmark & Clinical Name Banner */}
                    <div
                      className={`mt-1 px-2.5 py-1 rounded-xl text-center shadow-xs transition-colors border max-w-[130px] sm:max-w-[150px] ${
                        isSelected
                          ? 'bg-[#154E48] text-white border-[#154E48]'
                          : 'bg-white/95 text-stone-800 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="text-[9.5px] sm:text-[11px] font-extrabold leading-tight">
                        {distortion.name}
                      </div>
                      <div
                        className={`text-[8px] sm:text-[9px] font-semibold leading-tight mt-0.5 truncate ${
                          isSelected ? 'text-amber-200' : 'text-stone-500'
                        }`}
                      >
                        {distortion.gameLandmark}
                      </div>
                      {getMatchingTakeawaysForDistortion(takeaways, distortion).length > 0 && (
                        <div className="text-[7.5px] sm:text-[8px] font-bold text-amber-600 flex items-center justify-center gap-0.5 mt-0.5">
                          <span>⚡ Real Experience</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* 2B. ROSTER GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEN_COGNITIVE_DISTORTIONS.map((item) => {
            const isSelected = selectedDistortion?.id === item.id;
            const isScouted = scoutedIds.includes(item.id);
            const matches = getMatchingTakeawaysForDistortion(takeaways, item);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectDistortion(item)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 relative ${
                  isSelected
                    ? 'bg-[#EBF6F4] border-[#154E48] ring-2 ring-[#154E48]/20 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
                  {item.gameEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#154E48]">
                      CBT #{item.number} • {item.gameRegion}
                    </span>
                    {isScouted && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Scouted ✓
                      </span>
                    )}
                  </div>
                  {/* Clinical Term Primary */}
                  <h4 className="text-sm font-extrabold text-stone-900 truncate">
                    {item.name}
                  </h4>
                  {/* Gamified Landmark & AKA Secondary */}
                  <p className="text-xs text-amber-900 font-semibold truncate flex items-center gap-1 mt-0.5">
                    <span>{item.gameLandmark}</span>
                    {item.aka && (
                      <span className="text-stone-400 font-normal">
                        ({item.aka})
                      </span>
                    )}
                  </p>

                  {/* Real Life Encounters Tag */}
                  {matches.length > 0 && (
                    <div className="mt-1.5 pt-1.5 border-t border-stone-100 flex items-center gap-1.5 text-[10.5px]">
                      <span className="font-extrabold bg-emerald-100/80 text-emerald-900 px-1.5 py-0.5 rounded text-[10px]">
                        ⚡ {matches.length} Encounter{matches.length > 1 ? 's' : ''}
                      </span>
                      <span className="text-stone-500 truncate italic text-[10px]">
                        "{matches[0].entry.event.slice(0, 32)}..."
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. ENCOUNTER / SCOUT INSPECTION CARD */}
      {selectedDistortion && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden transition-all duration-300">
          {/* Card Top: Clinical Term & Landmark Lore */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-50/80 via-[#F8FAF9] to-white border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-amber-300 flex items-center justify-center text-3xl shadow-xs shrink-0">
                {selectedDistortion.gameEmoji}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#154E48] text-white">
                    Clinical Concept
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    {selectedDistortion.gameRegion}
                  </span>
                  <span className="text-xs text-stone-500 font-bold">
                    Distortion #{selectedDistortion.number} of 10
                  </span>
                </div>
                {/* Clinical Term Headline */}
                <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-stone-900">
                  {selectedDistortion.name}
                </h3>
                {/* Paired Landmark Name & Boss Info */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-extrabold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-200">
                    Map Landmark: {selectedDistortion.gameLandmark}
                  </span>
                  {selectedDistortion.aka && (
                    <span className="text-stone-500 font-medium">
                      (aka <em>{selectedDistortion.aka}</em>)
                    </span>
                  )}
                  <span className="text-stone-400">•</span>
                  <span className="text-[#154E48] font-bold">
                    Guarded by: {selectedDistortion.bossNPC}
                  </span>
                </div>
              </div>
            </div>

            {/* Prev / Next Landmark Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleSelectPrevDistortion}
                className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                title="Previous landmark"
                aria-label="Previous landmark"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSelectNextDistortion}
                className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
                title="Next landmark"
                aria-label="Next landmark"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context Switcher Bar: Personal Entries vs Classic CBT Lore */}
          <div className="px-5 sm:px-6 py-2.5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExampleTab('personal')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  exampleTab === 'personal'
                    ? 'bg-[#154E48] text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>⚡</span>
                <span>
                  {isSpanish ? 'Tus Encuentros Reales' : 'Your Real Encounters'} (
                  {currentMatchingTakeaways.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExampleTab('cbt')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  exampleTab === 'cbt'
                    ? 'bg-[#154E48] text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>📜</span>
                <span>{isSpanish ? 'Lore y Libro Clásico CBT' : 'Classic CBT Lore'}</span>
              </button>
            </div>

            {exampleTab === 'personal' && currentMatchingTakeaways.length > 1 && (
              <div className="flex items-center gap-1 text-xs font-bold text-stone-600">
                <button
                  type="button"
                  onClick={() =>
                    setPersonalEntryIndex(
                      (prev) =>
                        (prev - 1 + currentMatchingTakeaways.length) %
                        currentMatchingTakeaways.length
                    )
                  }
                  className="p-1 rounded-md bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
                  title="Previous personal reflection"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span>
                  Encounter {personalEntryIndex + 1} / {currentMatchingTakeaways.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPersonalEntryIndex(
                      (prev) => (prev + 1) % currentMatchingTakeaways.length
                    )
                  }
                  className="p-1 rounded-md bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
                  title="Next personal reflection"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="p-5 sm:p-6 space-y-5">
            {exampleTab === 'personal' ? (
              /* TAB 1: CUSTOMIZED PERSONAL ENCOUNTER FROM PREVIOUS ENTRIES */
              activePersonalTakeaway ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Encounter Header info */}
                  <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-bold text-stone-800">
                        {activePersonalTakeaway.title}
                      </span>
                      <span>• {activePersonalTakeaway.date}</span>
                    </div>
                    {onSelectTakeaway && (
                      <button
                        type="button"
                        onClick={() => onSelectTakeaway(activePersonalTakeaway)}
                        className="text-[#154E48] hover:underline font-bold cursor-pointer"
                      >
                        View in Journal →
                      </button>
                    )}
                  </div>

                  {/* 1. Activating Event they told the coach */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#154E48]" />
                      What Happened (Activating Event you shared):
                    </span>
                    <p className="text-xs sm:text-sm text-stone-900 font-medium leading-relaxed">
                      "{activePersonalTakeaway.entry.event}"
                    </p>
                  </div>

                  {/* 2. Automatic Distorted Thought Bubble */}
                  <div className="p-4 bg-gradient-to-br from-rose-50/90 to-amber-50/60 rounded-2xl border border-rose-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-rose-600" />
                        The Thinking Trap (Your Automatic Thought):
                      </span>
                      <div className="flex items-center gap-1 flex-wrap">
                        {activePersonalTakeaway.entry.emotions.slice(0, 3).map((emo) => (
                          <span
                            key={emo.id}
                            className="text-[10px] font-extrabold bg-white text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full"
                          >
                            {emo.name} {emo.intensity}/10
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-white/95 rounded-xl border border-rose-200/70 text-xs sm:text-sm text-stone-900 font-medium italic">
                      "{activePersonalTakeaway.dominantThought || activePersonalTakeaway.entry.thoughts}"
                    </div>
                    {activePersonalTakeaway.entry.actions && (
                      <p className="text-[11px] text-stone-500 pt-0.5">
                        <span className="font-bold">Resulting action: </span>
                        {activePersonalTakeaway.entry.actions}
                      </p>
                    )}
                  </div>

                  {/* 3. GAMIFIED BOSS ARENA: Disarm the Landmark Boss */}
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-[#103E39] to-[#0A2925] text-white rounded-2xl border-2 border-amber-300/60 shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{selectedDistortion.gameEmoji}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                              Boss Challenge
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span className="text-xs font-bold text-emerald-200">
                              {selectedDistortion.bossNPC}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-white">
                            Disarm the {selectedDistortion.name} at {selectedDistortion.gameLandmark}
                          </h4>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase">
                        +50 XP
                      </span>
                    </div>

                    <div className="p-3 bg-black/30 rounded-xl border border-white/10 text-xs text-amber-100 leading-relaxed">
                      <p className="font-bold text-white mb-0.5">
                        👹 {selectedDistortion.bossNPC} casts your automatic thought:
                      </p>
                      <p className="italic text-amber-200">
                        "{activePersonalTakeaway.dominantThought || activePersonalTakeaway.entry.thoughts}"
                      </p>
                    </div>

                    {/* Boss Counter Action */}
                    {activePersonalTakeaway.balancedPerspective &&
                    !activePersonalTakeaway.balancedPerspective.includes('TBD') &&
                    !activePersonalTakeaway.balancedPerspective.includes('Por definir') ? (
                      <div className="space-y-2 pt-1">
                        {!isBossDisarmed ? (
                          <button
                            type="button"
                            onClick={() => setIsBossDisarmed(true)}
                            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                          >
                            <Zap className="w-4 h-4 text-stone-950" />
                            <span>Cast Your Balanced Counter-Reframe</span>
                          </button>
                        ) : (
                          <div className="p-3.5 bg-emerald-950/80 border border-emerald-400/60 rounded-xl space-y-1.5 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between text-[11px] font-extrabold text-emerald-300">
                              <span className="flex items-center gap-1">
                                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                                Your Balanced Counter-Perspective:
                              </span>
                              <span className="bg-emerald-500 text-stone-950 px-2 py-0.5 rounded text-[10px] font-black">
                                Boss Disarmed ✓
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-emerald-50 font-serif font-medium leading-relaxed italic">
                              "{activePersonalTakeaway.balancedPerspective}"
                            </p>
                            <p className="text-[11px] text-emerald-200/90 font-medium pt-1">
                              ✨ You neutralized this cognitive trap using real evidence rather than catastrophic assumptions.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* If balanced perspective is TBD */
                      <div className="p-3.5 bg-amber-950/60 border border-amber-400/40 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                          <span>⏳ Balanced Perspective is TBD in this session</span>
                          {onRevisitChat && (
                            <button
                              type="button"
                              onClick={() => onRevisitChat(activePersonalTakeaway)}
                              className="text-amber-300 underline font-extrabold hover:text-white cursor-pointer"
                            >
                              Continue in Chat →
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-amber-100/80">
                          Formulate a balanced reframe now to disarm this boss:
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={testReframeInput}
                            onChange={(e) => setTestReframeInput(e.target.value)}
                            placeholder="What is a more grounded, balanced view?"
                            className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/20 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-amber-400"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (testReframeInput.trim()) {
                                setCustomReframeResult(testReframeInput);
                                setIsBossDisarmed(true);
                              }
                            }}
                            className="px-3 py-1.5 bg-amber-400 text-stone-950 font-black rounded-lg text-xs hover:bg-amber-300 cursor-pointer"
                          >
                            Cast
                          </button>
                        </div>
                        {customReframeResult && (
                          <div className="p-2.5 bg-emerald-900/60 rounded-lg border border-emerald-400 text-xs text-emerald-200 mt-2">
                            ✓ Reframe Cast: "{customReframeResult}" — Boss neutralized!
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 4. Coach Dialogue Context & Insights */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#154E48]" />
                      Coach Insights from this Session:
                    </span>
                    <div className="text-xs text-stone-700 leading-relaxed space-y-1">
                      <p className="font-semibold text-stone-900">
                        Pattern: {activePersonalTakeaway.pattern.name} —{' '}
                        <span className="font-normal text-stone-600">
                          {activePersonalTakeaway.pattern.description}
                        </span>
                      </p>
                      {activePersonalTakeaway.insights.length > 0 && (
                        <ul className="list-disc list-inside space-y-0.5 text-stone-600 pt-1">
                          {activePersonalTakeaway.insights.map((ins, i) => (
                            <li key={i}>{ins}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    {onRevisitChat && (
                      <button
                        type="button"
                        onClick={() => onRevisitChat(activePersonalTakeaway)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-[#154E48] text-[#154E48] hover:bg-[#EBF6F4] text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Revisit Chat Dialogue with Coach</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setExampleTab('cbt')}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Compare with Classic CBT Lore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty state when NO personal entries match this distortion yet */
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200/90 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl mx-auto">
                    🛡️
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-stone-900">
                      No Personal Encounters at {selectedDistortion.gameLandmark} Yet
                    </h4>
                    <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                      You haven't logged an event where your mind engaged in{' '}
                      <strong>{selectedDistortion.name}</strong>. As you reflect with the coach,
                      any thoughts caught in this trap will appear right here as customizable game encounters!
                    </p>
                  </div>

                  {takeaways.length > 0 && (
                    <div className="p-3 bg-white rounded-xl border border-stone-200 max-w-md mx-auto text-left text-xs text-stone-700 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-[#154E48]">
                        Recent journal context:
                      </span>
                      <p className="italic text-stone-800">
                        In your reflection about "{takeaways[0].entry.event}", you examined "
                        {takeaways[0].dominantThought}".
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {onStartWithDistortion && (
                      <button
                        type="button"
                        onClick={() => onStartWithDistortion(selectedDistortion.name)}
                        className="px-4 py-2 rounded-xl bg-[#154E48] hover:bg-[#0F3B36] text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Reflect on a Situation with {selectedDistortion.name}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setExampleTab('cbt')}
                      className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                    >
                      Explore Classic CBT Example
                    </button>
                    {takeaways.length === 0 && onLoadSampleTakeaways && (
                      <button
                        type="button"
                        onClick={onLoadSampleTakeaways}
                        className="px-4 py-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold hover:bg-amber-200 cursor-pointer"
                      >
                        🎲 Load Spec Example Entry
                      </button>
                    )}
                  </div>
                </div>
              )
            ) : (
              /* TAB 2: CLASSIC CBT TEXTBOOK LORE */
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Funny Lore Box */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                  <span className="font-extrabold">📜 Landmark Lore: </span>
                  "{selectedDistortion.funnyLore}"
                </div>

                {/* Real CBT Distortion Description */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      {isSpanish ? 'Concepto Psicológico' : 'Psychological Concept'}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900">
                      {(activeDistortion || selectedDistortion).name}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {(activeDistortion || selectedDistortion).definition}
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      {isSpanish ? 'Frases de Alerta' : 'Distortion Warning Phrases'}
                    </span>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {isSpanish
                        ? 'Presta atención a pensamientos como:'
                        : 'Listen for thoughts that say:'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {(activeDistortion || selectedDistortion).cluePhrases.map((phrase, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold bg-white border border-stone-200 px-2 py-0.5 rounded-md text-stone-700"
                        >
                          "{phrase}"
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Antidote Spell Section */}
                <div className="p-4 sm:p-5 bg-[#EBF6F4] rounded-2xl border border-[#BDE7E1] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#154E48]" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#154E48]">
                        {isSpanish ? 'Antídoto:' : 'Counter-Curse:'}{' '}
                        {selectedDistortion.antidoteSpellName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsReframeRevealed(!isReframeRevealed)}
                      className="text-xs font-bold text-[#154E48] hover:underline cursor-pointer"
                    >
                      {isReframeRevealed
                        ? t.distortionsHideReframe
                        : t.distortionsSeeReframe}
                    </button>
                  </div>

                  {isReframeRevealed ? (
                    <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                      <div className="p-3 bg-white rounded-xl border border-[#CCE8E4] space-y-1">
                        <span className="text-[10px] font-bold uppercase text-stone-400">
                          {t.distortionsAutomaticThought}
                        </span>
                        <p className="text-xs text-stone-500 italic">
                          "{(activeDistortion || selectedDistortion).bookExample}"
                        </p>
                        <span className="text-[10px] font-bold uppercase text-emerald-700 block pt-1">
                          {t.distortionsBalancedReframe}
                        </span>
                        <p className="text-xs text-emerald-950 font-semibold leading-relaxed">
                          "{(activeDistortion || selectedDistortion).bookReframe}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-bold text-[#154E48]">
                        <Shield className="w-4 h-4" />
                        <span>
                          {t.distortionsCoreQuestion}: "
                          {(activeDistortion || selectedDistortion).coreQuestion}"
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-600 font-medium">
                      {isSpanish
                        ? 'Toca "Ver Reencuadre Equilibrado" para descubrir cómo desarmar esta trampa cognitiva.'
                        : 'Tap "See Balanced CBT Reframe" to reveal how to reframe this thinking trap.'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer text-center"
              >
                {isSpanish ? 'Guía Completa y Pasos' : 'Inspect Full Guide & Steps'}
              </button>

              {onStartWithDistortion && (
                <button
                  type="button"
                  onClick={() =>
                    onStartWithDistortion((activeDistortion || selectedDistortion).name)
                  }
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#154E48] hover:bg-[#0F3B36] text-white text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t.distortionsReflectButton}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal View if Requested */}
      {selectedDistortion && (
        <DistortionDetailModal
          distortion={activeDistortion || selectedDistortion}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectNext={handleSelectNextDistortion}
          onSelectPrev={handleSelectPrevDistortion}
          currentIndex={TEN_COGNITIVE_DISTORTIONS.findIndex(
            (d) => d.id === selectedDistortion.id
          )}
          totalCount={TEN_COGNITIVE_DISTORTIONS.length}
          onStartReflection={onStartWithDistortion}
          personalTakeaways={currentMatchingTakeaways}
          onRevisitChat={onRevisitChat}
        />
      )}
    </div>
  );
};
