import React, { useState, useEffect } from 'react';
import {
  TabType,
  ScreenState,
  StructuredEntry,
  ChatMessage,
  ReflectionTakeaway,
} from './types';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { StructuredForm } from './components/StructuredForm';
import { ChatSession } from './components/ChatSession';
import { TakeawayView } from './components/TakeawayView';
import { InsightsView } from './components/InsightsView';
import { BreatheView } from './components/BreatheView';
import { DistortionMapView } from './components/DistortionMapView';
import { SafetyModal } from './components/SafetyModal';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeworkModal } from './components/HomeworkModal';
import { NameModal } from './components/NameModal';
import { CloudBackground } from './components/CloudBackground';
import { ProgressModal } from './components/ProgressModal';
import { ProgressView } from './components/ProgressView';

const STORAGE_KEYS = {
  TAKEAWAYS: 'thera_takeaways_v1',
  UNSUBMITTED_DRAFT: 'thera_unsubmitted_draft_v1',
  ACTIVE_ENTRY: 'thera_active_entry_v1', // legacy migration
  ACTIVE_MESSAGES: 'thera_active_messages_v1',
  ACTIVE_JOURNAL_ID: 'thera_active_journal_id_v1',
  SCREEN_STATE: 'thera_screen_state_v1',
  ONBOARDING_SEEN: 'thera_onboarding_seen_v2',
  USER_NAME: 'thera_user_name_v1',
};

const DEFAULT_ENTRY: StructuredEntry = {
  event: '',
  thoughts: '',
  emotions: [],
  actions: '',
};

const SPEC_SAMPLE_TAKEAWAYS: ReflectionTakeaway[] = [
  {
    id: 'spec-sample-unanswered-text',
    date: 'October 8, 2026',
    timestamp: Date.now() - 3600000 * 4,
    title: 'Waiting on a reply',
    entry: {
      event: 'He never replied to my message.',
      thoughts: "Maybe he didn't like me, he's too immature, maybe there's someone else.",
      emotions: [
        { id: 'emo-1', name: 'Helpless', category: 'vulnerable', intensity: 8 },
        { id: 'emo-2', name: 'Anxious', category: 'anxious', intensity: 7 },
      ],
      actions: 'Kept checking my phone every five minutes, avoided doing work.',
    },
    messages: [
      {
        id: 'msg-1',
        role: 'model',
        content:
          "Waiting on a reply that doesn't come can make your mind spin through every possible reason. Of the three you listed, which one hurts the most when you sit with it?",
        timestamp: Date.now() - 3600000 * 4 + 10000,
      },
      {
        id: 'msg-2',
        role: 'user',
        content: 'they are reasons',
        timestamp: Date.now() - 3600000 * 4 + 20000,
      },
      {
        id: 'msg-3',
        role: 'model',
        content:
          "Got it — they're all explanations you've considered for why he went quiet. If one of them turned out to be true, which would sting the most?",
        timestamp: Date.now() - 3600000 * 4 + 30000,
      },
    ],
    dominantThought:
      "Maybe he didn't like me, he's too immature, maybe there's someone else.",
    pattern: {
      name: 'Mind Reading / Fortune-telling',
      description:
        'Assuming you know what someone else is thinking without evidence, and predicting an unfavorable outcome.',
      identified: true,
    },
    balancedPerspective:
      "I don't know the reason for the silence yet. There are countless ordinary reasons people delay replying, and guessing doesn't give me answers.",
    insights: [
      "Assuming the worst about someone's silence is mind-reading, not evidence.",
      'Constantly checking my phone amplified the feeling of helplessness.',
    ],
    workPlan: [
      { id: 'wp-1', text: 'Put phone in another room for 45 minutes.', completed: false },
      { id: 'wp-2', text: 'Take a slow deep breath if the urge to check returns.', completed: false },
    ],
  },
  {
    id: 'spec-sample-presentation-slip',
    date: 'October 7, 2026',
    timestamp: Date.now() - 3600000 * 24,
    title: 'Work Presentation Feedback',
    entry: {
      event: 'Stumbled over words on slide 3 of the team presentation.',
      thoughts:
        'I completely ruined the entire presentation and everyone thinks I am incompetent.',
      emotions: [
        { id: 'emo-3', name: 'Embarrassed', category: 'vulnerable', intensity: 8 },
        { id: 'emo-4', name: 'Anxious', category: 'anxious', intensity: 7 },
      ],
      actions: 'Left the meeting room immediately and avoided talking to the team.',
    },
    messages: [
      {
        id: 'msg-4',
        role: 'model',
        content:
          "Presentations put us under a magnifying glass, especially when words don't come out smoothly. When you notice that thought that the entire thing was ruined, what feels like the strongest evidence for that?",
        timestamp: Date.now() - 3600000 * 24 + 10000,
      },
    ],
    dominantThought:
      'I completely ruined the entire presentation and everyone thinks I am incompetent.',
    pattern: {
      name: 'All-or-Nothing Thinking',
      description:
        'Viewing a minor hiccup as a total catastrophe with zero middle ground.',
      identified: true,
    },
    balancedPerspective:
      'I stumbled on slide 3, but the other 12 slides went smoothly and answered client questions directly.',
    insights: [
      'One slip-up does not wipe out 15 minutes of solid presentation work.',
      'Perfectionism treats a minor pause like an unmitigated disaster.',
    ],
    workPlan: [
      {
        id: 'wp-3',
        text: 'Send the slide recap deck to the team with confidence.',
        completed: false,
      },
    ],
  },
];

function detectPatternFromThoughts(thoughts: string): string {
  const t = thoughts.toLowerCase();
  if (t.includes('always') || t.includes('never') || t.includes('ruined') || t.includes('completely')) {
    return 'All-or-Nothing Thinking';
  }
  if (t.includes('worst') || t.includes('disaster') || t.includes('terrible') || t.includes('catastrophe')) {
    return 'Catastrophizing';
  }
  if (t.includes('should') || t.includes('must') || t.includes('ought') || t.includes('have to')) {
    return 'Should Statements';
  }
  if (t.includes('think') || t.includes('probably') || t.includes('losing interest') || t.includes('hate me')) {
    return 'Mind Reading / Fortune-telling';
  }
  if (t.includes('my fault') || t.includes('blame myself') || t.includes('inadequate')) {
    return 'Self-Blaming / Personalization';
  }
  return 'Pattern to be explored';
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [screenState, setScreenState] = useState<ScreenState>('home');
  const [userName, setUserName] = useState<string>('');
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  // Unsubmitted Draft state (ONLY exists if user left form without submitting)
  const [unsubmittedDraft, setUnsubmittedDraft] = useState<StructuredEntry | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UNSUBMITTED_DRAFT);
      if (saved) return JSON.parse(saved);
      const legacy = localStorage.getItem(STORAGE_KEYS.ACTIVE_ENTRY);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (parsed && (parsed.event || parsed.thoughts)) return parsed;
      }
    } catch (e) {}
    return null;
  });

  // Active entry currently being edited or actively used in chat
  const [activeEntry, setActiveEntry] = useState<StructuredEntry>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UNSUBMITTED_DRAFT);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_ENTRY;
  });
  const [activeJournalId, setActiveJournalId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_JOURNAL_ID);
    } catch (e) {
      return null;
    }
  });
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_MESSAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Archive History (saved takeaways and submitted entries)
  const [takeaways, setTakeaways] = useState<ReflectionTakeaway[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TAKEAWAYS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not load stored takeaways:', e);
    }
    return SPEC_SAMPLE_TAKEAWAYS;
  });
  const [currentTakeaway, setCurrentTakeaway] = useState<ReflectionTakeaway | null>(null);
  const [distortionForMap, setDistortionForMap] = useState<string | null>(null);

  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    try {
      return !localStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN);
    } catch {
      return true;
    }
  });
  const [isHomeworkOpen, setIsHomeworkOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedName = localStorage.getItem(STORAGE_KEYS.USER_NAME);
      if (savedName) {
        setUserName(savedName);
      }

      const onboardingSeen = localStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN);
      if (!onboardingSeen) {
        setIsOnboardingOpen(true);
      } else if (!savedName) {
        setIsNameModalOpen(true);
      }

      const savedScreen = localStorage.getItem(STORAGE_KEYS.SCREEN_STATE) as ScreenState;
      if (savedScreen && ['home', 'form', 'chat', 'takeaway'].includes(savedScreen)) {
        if (savedScreen === 'chat' && activeMessages.length > 0) {
          setScreenState('chat');
        } else if (savedScreen === 'takeaway') {
          setScreenState('takeaway');
        }
      }
    } catch (e) {
      console.warn('Could not load stored TheraApp session:', e);
    }
  }, []);

  // Save takeaways to LocalStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TAKEAWAYS, JSON.stringify(takeaways));
    } catch (e) {
      console.warn('Could not persist takeaways:', e);
    }
  }, [takeaways]);

  // Persist unsubmitted draft ONLY when it has actual content
  useEffect(() => {
    try {
      if (
        unsubmittedDraft &&
        (unsubmittedDraft.event?.trim() ||
          unsubmittedDraft.thoughts?.trim() ||
          unsubmittedDraft.emotions?.length > 0 ||
          unsubmittedDraft.actions?.trim())
      ) {
        localStorage.setItem(
          STORAGE_KEYS.UNSUBMITTED_DRAFT,
          JSON.stringify(unsubmittedDraft)
        );
      } else {
        localStorage.removeItem(STORAGE_KEYS.UNSUBMITTED_DRAFT);
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_ENTRY);
      }
    } catch (e) {
      console.warn('Could not persist unsubmitted draft:', e);
    }
  }, [unsubmittedDraft]);

  // Save active messages & active journal ID
  useEffect(() => {
    try {
      if (activeMessages.length > 0) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_MESSAGES, JSON.stringify(activeMessages));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_MESSAGES);
      }
    } catch (e) {}
  }, [activeMessages]);

  useEffect(() => {
    try {
      if (activeJournalId) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_JOURNAL_ID, activeJournalId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_JOURNAL_ID);
      }
    } catch (e) {}
  }, [activeJournalId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCREEN_STATE, screenState);
    } catch (e) {}
  }, [screenState]);

  // Tab switching
  const handleSelectTab = (tab: TabType) => {
    setCurrentTab(tab);
    if (tab === 'home') {
      setScreenState('home');
    }
    if (tab === 'journal') {
      setCurrentTakeaway(null);
    }
  };

  // Center logo click -> Go Home.
  // The homework popup should only appear one time per session if there's none, not multiple times.
  const handleCenterLogoClick = () => {
    setCurrentTab('home');
    setScreenState('home');

    const hasActiveHomework = Boolean(
      recentTakeaway && recentTakeaway.workPlan && recentTakeaway.workPlan.length > 0
    );

    if (hasActiveHomework) {
      setIsHomeworkOpen(true);
    } else {
      // If there is NO homework yet, only show once per browser session
      const alreadyShownEmpty = sessionStorage.getItem('thera_empty_hw_shown_v1');
      if (!alreadyShownEmpty) {
        sessionStorage.setItem('thera_empty_hw_shown_v1', 'true');
        setIsHomeworkOpen(true);
      }
      // If already shown once, simply stay on Home without popping up
    }
  };

  // Check whether an unsubmitted draft exists
  const hasUnsubmittedDraft = Boolean(
    unsubmittedDraft &&
      (unsubmittedDraft.event?.trim() ||
        unsubmittedDraft.thoughts?.trim() ||
        (unsubmittedDraft.emotions && unsubmittedDraft.emotions.length > 0) ||
        unsubmittedDraft.actions?.trim())
  );

  // START FRESH ENTRY: Clears active entry and unsubmitted draft
  const handleStartFreshEntry = () => {
    setActiveEntry(DEFAULT_ENTRY);
    setUnsubmittedDraft(null);
    localStorage.removeItem(STORAGE_KEYS.UNSUBMITTED_DRAFT);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ENTRY);
    setCurrentTab('home');
    setScreenState('form');
  };

  // START WITH PREPOPULATED DISTORTION:
  const handleStartWithDistortion = (distortionName: string) => {
    const entry: StructuredEntry = {
      ...DEFAULT_ENTRY,
      thoughts: `I noticed the thought pattern "${distortionName}" in my thinking...`,
    };
    setActiveEntry(entry);
    setUnsubmittedDraft(entry);
    setCurrentTab('home');
    setScreenState('form');
  };

  // RESUME UNFINISHED ENTRY: Only applicable when entry was left without submitting
  const handleResumeDraft = () => {
    if (unsubmittedDraft) {
      setActiveEntry(unsubmittedDraft);
    }
    setCurrentTab('home');
    setScreenState('form');
  };

  // DISCARD DRAFT: User explicitly clears their unsubmitted draft
  const handleDiscardDraft = () => {
    setUnsubmittedDraft(null);
    setActiveEntry(DEFAULT_ENTRY);
    localStorage.removeItem(STORAGE_KEYS.UNSUBMITTED_DRAFT);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ENTRY);
  };

  // AUTO-SAVE DRAFT: As the user types in Step 1-4
  const handleSaveDraft = (draft: StructuredEntry) => {
    setUnsubmittedDraft(draft);
    setActiveEntry(draft);
  };

  // SUBMIT ENTRY:
  // "when I submit the entry it should be now stored in journal history.
  // Resume entry should only be applicable when the entry is left with out submitting it.
  // Once submitted now main menu should be ready for a new entry and current flow should be in journal history."
  const handleSubmitEntry = (entry: StructuredEntry, startDialogue: boolean) => {
    const newId = `journal-${Date.now()}`;
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newJournalItem: ReflectionTakeaway = {
      id: newId,
      date: formattedDate,
      timestamp: Date.now(),
      title: entry.event?.trim()
        ? entry.event.trim().length > 52
          ? entry.event.trim().slice(0, 50) + '...'
          : entry.event.trim()
        : entry.thoughts?.trim()
        ? entry.thoughts.trim().length > 52
          ? entry.thoughts.trim().slice(0, 50) + '...'
          : entry.thoughts.trim()
        : 'Reflection Entry',
      entry,
      messages: [],
      dominantThought: entry.thoughts?.trim() || 'Thoughts recorded.',
      pattern: {
        name: detectPatternFromThoughts(entry.thoughts || ''),
        description: 'Examined trigger event and recorded automatic thoughts.',
        identified: false,
      },
      balancedPerspective: 'TBD',
      insights: [
        `Triggering event: "${entry.event?.trim() ? entry.event.trim().slice(0, 65) : 'Self-reflection'}..."`,
        `Felt emotions: ${
          entry.emotions && entry.emotions.length > 0
            ? entry.emotions.map((e) => `${e.name} (${e.intensity}/10)`).join(', ')
            : 'Acknowledged'
        }`,
        `Action tendency: "${entry.actions?.trim() ? entry.actions.trim().slice(0, 65) : 'Examined'}..."`,
      ],
      workPlan: [
        {
          id: `wp-${Date.now()}-1`,
          text: 'Revisit this entry when feelings settle to review evidence.',
          completed: false,
        },
        {
          id: `wp-${Date.now()}-2`,
          text: 'Practice 1-minute diaphragmatic breathing if emotional intensity rises.',
          completed: false,
        },
      ],
    };

    // 1. Immediately store in Archive & LocalStorage (guarantees memory persistence)
    setTakeaways((prev) => {
      const updated = [newJournalItem, ...prev.filter((t) => t.id !== newId)];
      try {
        localStorage.setItem(STORAGE_KEYS.TAKEAWAYS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not persist takeaways:', e);
      }
      return updated;
    });

    // 2. CLEAR the unsubmitted draft (so Resume is no longer applicable!)
    setUnsubmittedDraft(null);
    localStorage.removeItem(STORAGE_KEYS.UNSUBMITTED_DRAFT);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ENTRY);

    // 3. Handle next flow based on user choice
    if (startDialogue) {
      setActiveJournalId(newId);
      setActiveEntry(entry);
      setActiveMessages([]);
      setScreenState('chat');
    } else {
      // Submitted directly to Archive:
      // Navigate to Archive tab so user sees it right away,
      // and home menu is reset & ready for a new entry!
      setActiveJournalId(null);
      setActiveEntry(DEFAULT_ENTRY);
      setActiveMessages([]);
      setCurrentTab('journal');
      setScreenState('home');
      setCurrentTakeaway(newJournalItem);
    }
  };

  // Exit chat early -> Return to Home.
  // Because entry was ALREADY submitted to Journal History, main menu is clean & ready for a new entry!
  const handleExitChat = () => {
    setActiveJournalId(null);
    setActiveMessages([]);
    setActiveEntry(DEFAULT_ENTRY);
    setScreenState('home');
  };

  // Conclude session -> Update the existing journal history item with AI analysis & work plan
  const handleSessionConclude = (takeaway: ReflectionTakeaway) => {
    const targetId = activeJournalId || takeaway.id;
    const enrichedTakeaway: ReflectionTakeaway = {
      ...takeaway,
      id: targetId,
    };

    setTakeaways((prev) => {
      const filtered = prev.filter((t) => t.id !== targetId);
      const updated = [enrichedTakeaway, ...filtered];
      try {
        localStorage.setItem(STORAGE_KEYS.TAKEAWAYS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setCurrentTakeaway(enrichedTakeaway);
    setScreenState('takeaway');

    // Clean up active chat session
    setActiveJournalId(null);
    setActiveEntry(DEFAULT_ENTRY);
    setActiveMessages([]);
    setUnsubmittedDraft(null);
    localStorage.removeItem(STORAGE_KEYS.UNSUBMITTED_DRAFT);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ENTRY);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_MESSAGES);

    // Reset empty homework session flag since real new homework was generated
    try {
      sessionStorage.removeItem('thera_empty_hw_shown_v1');
    } catch (e) {}

    // Prompt new homework plan after session concludes
    setTimeout(() => {
      setIsHomeworkOpen(true);
    }, 400);
  };

  const handleUpdateWorkPlan = (itemId: string, completed: boolean) => {
    if (currentTakeaway) {
      const updatedWorkPlan = currentTakeaway.workPlan.map((wp) =>
        wp.id === itemId ? { ...wp, completed } : wp
      );
      const updatedTakeaway = { ...currentTakeaway, workPlan: updatedWorkPlan };
      setCurrentTakeaway(updatedTakeaway);
    }

    setTakeaways((prev) => {
      const updated = prev.map((t) => ({
        ...t,
        workPlan: t.workPlan.map((wp) =>
          wp.id === itemId ? { ...wp, completed } : wp
        ),
      }));
      try {
        localStorage.setItem(STORAGE_KEYS.TAKEAWAYS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleDeleteTakeaway = (id: string) => {
    setTakeaways((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.TAKEAWAYS, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (currentTakeaway && currentTakeaway.id === id) {
      setCurrentTakeaway(null);
    }
  };

  const handleNewReflectionFromTakeaway = () => {
    handleStartFreshEntry();
  };

  const handleRevisitChatFromTakeaway = () => {
    if (!currentTakeaway) return;
    setActiveEntry(currentTakeaway.entry);
    setActiveMessages(currentTakeaway.messages);
    setActiveJournalId(currentTakeaway.id);
    setCurrentTab('home');
    setScreenState('chat');
  };

  const recentTakeaway = takeaways.length > 0 ? takeaways[0] : null;

  return (
    <div className="min-h-screen text-stone-800 flex flex-col font-sans relative">
      {/* Moving Flowy Cloud Background */}
      <CloudBackground />

      {/* Navigation Top Bar */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onCenterLogoClick={handleCenterLogoClick}
        onNewEntry={handleStartFreshEntry}
        onOpenSafety={() => setIsSafetyOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenBreathe={() => setCurrentTab('breathe')}
        hasActiveSession={hasUnsubmittedDraft}
        hasHomework={Boolean(recentTakeaway && recentTakeaway.workPlan.length > 0)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-3 pb-16 relative z-10">
        {currentTab === 'home' && (
          <>
            {screenState === 'home' && (
              <HomeView
                userName={userName}
                onEditName={() => setIsNameModalOpen(true)}
                onStartEntry={handleStartFreshEntry}
                hasUnsubmittedDraft={hasUnsubmittedDraft}
                onResumeDraft={handleResumeDraft}
                onDiscardDraft={handleDiscardDraft}
                recentTakeaway={recentTakeaway}
                onOpenHomework={() => setIsHomeworkOpen(true)}
                onOpenBreathe={() => setCurrentTab('breathe')}
                onOpenDistortions={() => setCurrentTab('distortions')}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
                onViewJournalHistory={() => {
                  setCurrentTab('journal');
                  setCurrentTakeaway(null);
                }}
              />
            )}

            {screenState === 'form' && (
              <StructuredForm
                initialEntry={activeEntry}
                onSaveDraft={handleSaveDraft}
                onSubmitAndStartDialogue={(entry) => handleSubmitEntry(entry, true)}
                onSubmitToJournal={(entry) => handleSubmitEntry(entry, false)}
                onCancel={() => setScreenState('home')}
              />
            )}

            {screenState === 'chat' && (
              <ChatSession
                key={activeJournalId || `chat-${activeEntry.event || 'session'}`}
                userName={userName}
                entry={activeEntry}
                initialMessages={activeMessages}
                onConclude={handleSessionConclude}
                onExit={handleExitChat}
                onOpenBreathe={() => setCurrentTab('breathe')}
                onOpenSafety={() => setIsSafetyOpen(true)}
              />
            )}

            {screenState === 'takeaway' && currentTakeaway && (
              <TakeawayView
                takeaway={currentTakeaway}
                onUpdateWorkPlan={handleUpdateWorkPlan}
                onNewReflection={handleNewReflectionFromTakeaway}
                onRevisitChat={handleRevisitChatFromTakeaway}
                onBackToInsights={() => {
                  setCurrentTab('journal');
                  setCurrentTakeaway(null);
                }}
                onOpenDistortionMap={() => {
                  if (currentTakeaway?.pattern?.name) {
                    setDistortionForMap(currentTakeaway.pattern.name);
                  }
                  setCurrentTab('distortions');
                }}
                onOpenBreathe={() => setCurrentTab('breathe')}
              />
            )}
          </>
        )}

        {currentTab === 'journal' && (
          <>
            {currentTakeaway ? (
              <TakeawayView
                takeaway={currentTakeaway}
                onUpdateWorkPlan={handleUpdateWorkPlan}
                onNewReflection={handleNewReflectionFromTakeaway}
                onRevisitChat={handleRevisitChatFromTakeaway}
                onBackToInsights={() => setCurrentTakeaway(null)}
                onOpenDistortionMap={() => {
                  if (currentTakeaway?.pattern?.name) {
                    setDistortionForMap(currentTakeaway.pattern.name);
                  }
                  setCurrentTab('distortions');
                }}
                onOpenBreathe={() => setCurrentTab('breathe')}
              />
            ) : (
              <InsightsView
                takeaways={takeaways}
                onSelectTakeaway={(t) => setCurrentTakeaway(t)}
                onStartNewReflection={handleStartFreshEntry}
                onDeleteTakeaway={handleDeleteTakeaway}
              />
            )}
          </>
        )}

        {currentTab === 'distortions' && (
          <DistortionMapView
            takeaways={takeaways}
            initialDistortionName={distortionForMap}
            onStartWithDistortion={handleStartWithDistortion}
            onSelectTakeaway={(t) => {
              setCurrentTakeaway(t);
              setCurrentTab('journal');
            }}
            onRevisitChat={handleRevisitChatFromTakeaway}
            onLoadSampleTakeaways={() => {
              setTakeaways(SPEC_SAMPLE_TAKEAWAYS);
              try {
                localStorage.setItem(
                  STORAGE_KEYS.TAKEAWAYS,
                  JSON.stringify(SPEC_SAMPLE_TAKEAWAYS)
                );
              } catch {}
            }}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressView
            onOpenBreathwork={() => setCurrentTab('breathe')}
            onOpenDistortionMap={() => setCurrentTab('distortions')}
            onOpenJournal={() => {
              setCurrentTab('journal');
              setCurrentTakeaway(null);
            }}
          />
        )}

        {currentTab === 'breathe' && (
          <BreatheView
            onBack={() => setCurrentTab('home')}
            onOpenProgress={() => setCurrentTab('progress')}
          />
        )}
      </main>

      {/* Weekly Progress Tracker Modal */}
      <ProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        onOpenBreathwork={() => setCurrentTab('breathe')}
        onOpenDistortionMap={() => setCurrentTab('distortions')}
        onOpenJournal={() => {
          setCurrentTab('journal');
          setCurrentTakeaway(null);
        }}
      />

      {/* Emergency Crisis / Safety Modal */}
      <SafetyModal isOpen={isSafetyOpen} onClose={() => setIsSafetyOpen(false)} />

      {/* New Homework Modal Popup */}
      <HomeworkModal
        isOpen={isHomeworkOpen}
        onClose={() => setIsHomeworkOpen(false)}
        recentTakeaway={recentTakeaway}
        onUpdateWorkPlan={handleUpdateWorkPlan}
        onStartNewEntry={handleStartFreshEntry}
      />

      {/* 4-Slide Onboarding Tour Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => {
          setIsOnboardingOpen(false);
          setCurrentTab('home');
          setScreenState('home');
          try {
            localStorage.setItem(STORAGE_KEYS.ONBOARDING_SEEN, 'true');
          } catch (e) {}
          if (!userName) {
            setIsNameModalOpen(true);
          }
        }}
        onStartReflecting={() => {
          setIsOnboardingOpen(false);
          setCurrentTab('home');
          setScreenState('home');
          try {
            localStorage.setItem(STORAGE_KEYS.ONBOARDING_SEEN, 'true');
          } catch (e) {}
          if (!userName) {
            setIsNameModalOpen(true);
          }
        }}
      />

      {/* Name Input Modal */}
      <NameModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        currentName={userName}
        onSaveName={(name) => {
          setUserName(name);
          try {
            localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
          } catch (e) {}
        }}
      />
    </div>
  );
}
