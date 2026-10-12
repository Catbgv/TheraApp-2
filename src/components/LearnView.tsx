import React, { useState } from 'react';
import { BookOpen, Sparkles, ChevronDown, ChevronUp, Layers, HelpCircle } from 'lucide-react';

interface DistortionCard {
  id: string;
  name: string;
  tagline: string;
  exampleOriginal: string;
  exampleReframe: string;
  tip: string;
}

const DISTORTIONS: DistortionCard[] = [
  {
    id: 'fortune-telling',
    name: 'Fortune-telling',
    tagline: 'Predicting a negative outcome before having enough concrete evidence.',
    exampleOriginal: 'They haven’t texted back for 6 hours; they must be losing interest.',
    exampleReframe: 'I don’t know why they haven’t replied yet. There are multiple possibilities.',
    tip: 'Ask: "Do I have definite proof of this future outcome, or is my mind anticipating the worst to protect me?"',
  },
  {
    id: 'mind-reading',
    name: 'Mind Reading',
    tagline: 'Assuming you know what someone else is thinking without them telling you.',
    exampleOriginal: 'Everyone in that meeting thought my suggestion was foolish.',
    exampleReframe: 'People were quiet, but no one criticized the idea. Silence is not disapproval.',
    tip: 'Separate observable cues (neutral facial expression) from invented internal motives.',
  },
  {
    id: 'catastrophizing',
    name: 'Catastrophizing',
    tagline: 'Assuming that the worst-case scenario is the most probable outcome.',
    exampleOriginal: 'I made a mistake in this report; I’m going to be fired.',
    exampleReframe: 'It is a mistake that needs fixing. It does not erase my past contributions.',
    tip: 'Ask: "What is the worst that can happen, what is the best, and what is the most realistic middle ground?"',
  },
  {
    id: 'all-or-nothing',
    name: 'All-or-Nothing Thinking',
    tagline: 'Viewing situations in polarized categories: total success or total failure.',
    exampleOriginal: 'Because I broke my routine today, the whole week is ruined.',
    exampleReframe: 'Today didn’t go as planned, but 4 out of 5 days were consistent.',
    tip: 'Look for the shades of gray between 0% and 100%.',
  },
  {
    id: 'emotional-reasoning',
    name: 'Emotional Reasoning',
    tagline: 'Assuming that because you feel a certain way, it must be the objective reality.',
    exampleOriginal: 'I feel inadequate, therefore I must be incompetent.',
    exampleReframe: 'My feelings of inadequacy are real, but they are emotional signals, not job evaluations.',
    tip: 'Remind yourself: "Feelings are valid emotional experiences, not reliable factual reports."',
  },
  {
    id: 'should-statements',
    name: 'Should Statements',
    tagline: 'Imposing rigid expectations on yourself or others that cause guilt and resentment.',
    exampleOriginal: 'I should have handled that situation without any stress.',
    exampleReframe: 'I prefer to handle things calmly, but feeling stressed during sudden conflict is human.',
    tip: 'Replace "I should" with "I prefer to" or "I would like to".',
  },
];

export const LearnView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('fortune-telling');

  return (
    <div className="max-w-2xl mx-auto pb-24 space-y-6">
      <div className="pt-2">
        <h2 className="text-2xl font-serif font-bold text-stone-900">
          CBT Foundations
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Understanding the mechanism connecting events, interpretations, and behaviors
        </p>
      </div>

      {/* The CBT Model Card */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E8F3F3] text-[#2C6E72] flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">
              The Cognitive Model
            </h3>
            <p className="text-xs text-stone-500">
              It is not the event that creates distress, but the meaning assigned to it.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-stone-100 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-0.5">
              1. Event
            </span>
            <span className="text-xs font-medium text-stone-700">What happened</span>
            <p className="text-[10px] text-stone-400 mt-1">Camera recording</p>
          </div>

          <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-stone-100 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-0.5">
              2. Thought
            </span>
            <span className="text-xs font-medium text-stone-700">What it means</span>
            <p className="text-[10px] text-stone-400 mt-1">Internal story</p>
          </div>

          <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-stone-100 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-0.5">
              3. Emotion
            </span>
            <span className="text-xs font-medium text-stone-700">How it feels</span>
            <p className="text-[10px] text-stone-400 mt-1">Physical sensation</p>
          </div>

          <div className="bg-[#FAF9F5] p-3 rounded-2xl border border-stone-100 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-0.5">
              4. Action
            </span>
            <span className="text-xs font-medium text-stone-700">What you do</span>
            <p className="text-[10px] text-stone-400 mt-1">Behaviors & urges</p>
          </div>
        </div>
      </section>

      {/* Common Thinking Patterns Directory */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-600">
            Common Cognitive Patterns
          </h3>
          <span className="text-xs text-stone-400">Click to explore reframes</span>
        </div>

        <div className="space-y-2.5">
          {DISTORTIONS.map((card) => {
            const isExpanded = expandedId === card.id;
            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : card.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50/60 transition-colors cursor-pointer"
                >
                  <div className="pr-2">
                    <span className="text-sm font-serif font-semibold text-stone-900 block">
                      {card.name}
                    </span>
                    <span className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                      {card.tagline}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-stone-100 bg-[#FAF9F6] text-xs space-y-3">
                    <div className="space-y-1">
                      <span className="font-semibold text-rose-800 block">Initial Thought:</span>
                      <p className="text-stone-700 italic bg-white p-2.5 rounded-xl border border-stone-200/60">
                        "{card.exampleOriginal}"
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-semibold text-emerald-800 block">Balanced Reframe:</span>
                      <p className="text-stone-700 italic bg-white p-2.5 rounded-xl border border-stone-200/60">
                        "{card.exampleReframe}"
                      </p>
                    </div>

                    <div className="pt-1 flex items-start gap-1.5 text-stone-500">
                      <HelpCircle className="w-3.5 h-3.5 text-[#2C6E72] shrink-0 mt-0.5" />
                      <span>{card.tip}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
