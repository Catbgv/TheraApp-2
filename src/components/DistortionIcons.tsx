import React from 'react';
import {
  Split,
  Flame,
  Radio,
  Hourglass,
  ZoomIn,
  ZoomOut,
  Waves,
  Tag,
  Gavel,
  Target,
} from 'lucide-react';

export interface DistortionColor {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  badgeText: string;
}

export interface CognitiveDistortion {
  id: string;
  number: number;
  name: string;
  line1: string;
  line2: string;
  aka?: string;
  category: 'Prediction' | 'Polarization' | 'Filtering' | 'Judgment';
  iconType: string;
  metaphor: string;
  iconDescription: string;
  definition: string;
  whyBrainDoesIt: string;
  cluePhrases: string[];
  bookExample: string;
  bookReframe: string;
  coreQuestion: string;
  antidoteSteps: {
    step: string;
    action: string;
  }[];
  color: DistortionColor;
  // Gamified Exploration Map Properties
  gameLandmark: string;
  gameEmoji: string;
  gameRegion: string;
  bossNPC: string;
  funnyLore: string;
  antidoteSpellName: string;
  mapCoords: { x: number; y: number };
}

export const TEN_COGNITIVE_DISTORTIONS: CognitiveDistortion[] = [
  {
    id: 'all-or-nothing',
    number: 1,
    name: 'All-or-Nothing Thinking',
    line1: 'All-or-Nothing',
    line2: 'Thinking',
    aka: 'Black-and-White Thinking',
    category: 'Polarization',
    iconType: 'split',
    metaphor: 'The Divided Road',
    iconDescription:
      'The split path icon represents splitting reality into 0% or 100% absolutes, erasing the rich 99% middle ground of human growth.',
    definition:
      'Perceiving situations in extreme binary categories (e.g., flawless triumph vs complete failure) with zero room for partial success or minor mistakes.',
    whyBrainDoesIt:
      'Our ancient brain craved simple binary safety classifications: safe or predator, edible or poison. In complex modern life, this causes harsh perfectionism.',
    cluePhrases: ['Always', 'Never', 'Completely ruined', 'Total failure', 'Either/or'],
    bookExample: "I ate ice cream today so I've ruined my diet completely.",
    bookReframe: 'Even while eating healthy, I can enjoy treats without invalidating my overall progress.',
    coreQuestion: 'Is this truly 0% or 100%, or is there a realistic 60–80% middle ground?',
    antidoteSteps: [
      { step: 'Notice the absolute', action: 'Catch words like "always", "never", or "ruined".' },
      { step: 'Rate on a spectrum', action: 'Where does this fall on a 0 to 100% scale instead of pass/fail?' },
      { step: 'Find the middle ground', action: 'Acknowledge both the hiccup and the ongoing progress.' },
    ],
    color: {
      bg: 'bg-stone-100',
      text: 'text-stone-800',
      border: 'border-stone-300',
      badgeBg: 'bg-stone-50',
      badgeText: 'text-stone-700',
    },
    gameLandmark: 'All-or-Nothing Shack',
    gameEmoji: '🛖',
    gameRegion: 'The Polar Cliffs',
    bossNPC: 'Sir Absolutus the Rigid',
    funnyLore: 'No grey shades permitted inside this rickety shack! You are either the greatest legend in human history or belong straight in the garbage disposal.',
    antidoteSpellName: 'The Spectrum Prism',
    mapCoords: { x: 16, y: 18 },
  },
  {
    id: 'catastrophizing',
    number: 2,
    name: 'Catastrophizing',
    line1: 'Catastrophizing',
    line2: '(Worst-Case)',
    aka: 'Magnifying Disasters',
    category: 'Prediction',
    iconType: 'flame',
    metaphor: 'The Spreading Flame',
    iconDescription:
      'The flame icon symbolizes how a single spark of uncertainty quickly snowballs into an all-consuming mental inferno.',
    definition:
      'Fixating on worst-case disaster scenarios based on minor setbacks, convincing yourself that the absolute worst outcome is inevitable.',
    whyBrainDoesIt:
      'The brain is wired for threat detection; it escalates worst-case possibilities to prepare emergency adrenaline, but mistakes anxious feelings for facts.',
    cluePhrases: ['What if...', 'This will destroy everything', 'I will never recover', 'Unmitigated disaster'],
    bookExample:
      "I botched that interview question; they will definitely reject me, I'll never get hired, and my degree is worthless.",
    bookReframe:
      'I answered that question imperfectly, but other answers were strong. Even if this job doesn\'t work out, I still have options and skills.',
    coreQuestion: 'What is the most realistic outcome rather than the apocalyptic extreme?',
    antidoteSteps: [
      { step: 'Check the odds', action: 'How often has the absolute worst disaster actually occurred?' },
      { step: 'Name best, worst, & realistic', action: 'Write down best-case, worst-case, and most probable case.' },
      { step: 'Remind coping ability', action: 'Remember that you have survived and handled challenges before.' },
    ],
    color: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-300',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-800',
    },
    gameLandmark: 'Catastrophizing Cyclone',
    gameEmoji: '🌪️',
    gameRegion: 'The Drama Peaks',
    bossNPC: 'Twister the Overthinker',
    funnyLore: 'A mild 3mph breeze blew? Quick, construct an underground bunker and write your last will, because civilization is obviously crumbling before dinner.',
    antidoteSpellName: 'Anchor of Reality',
    mapCoords: { x: 44, y: 15 },
  },
  {
    id: 'mind-reading',
    number: 3,
    name: 'Mind Reading',
    line1: 'Mind',
    line2: 'Reading',
    aka: 'Assumed Intentions',
    category: 'Prediction',
    iconType: 'radio',
    metaphor: 'Unchecked Telepathy',
    iconDescription:
      'The radio broadcast waves icon signifies assuming you have psychic receivers to detect secret judgment and disapproval in other people’s heads.',
    definition:
      'Assuming you know exactly what others are secretly thinking and judging about you without asking or having verifiable evidence.',
    whyBrainDoesIt:
      'As social creatures, maintaining tribe acceptance was vital for survival. When anxious, we project our own internal self-doubts onto neutral faces.',
    cluePhrases: ['They think I am...', 'Everyone noticed that', 'They must secretly hate me', 'They are judging me'],
    bookExample: "The cashier must think I'm some weirdo for wearing this outfit to the store.",
    bookReframe:
      'I feel self-conscious right now, but the cashier is likely focused on their job and thinking about their own day.',
    coreQuestion: 'Did they actually express this, or am I projecting my own fears onto them?',
    antidoteSteps: [
      { step: 'Separate fact from story', action: 'Did they state this out loud, or did I invent their dialogue?' },
      { step: 'Consider alternate thoughts', action: 'What else could be on their mind (hunger, fatigue, busy)?' },
      { step: 'Communicate directly', action: 'If important, ask a gentle clarifying question rather than guessing.' },
    ],
    color: {
      bg: 'bg-[#E8F3F3]',
      text: 'text-[#2C6E72]',
      border: 'border-[#CCE7E6]',
      badgeBg: 'bg-[#F2F9F9]',
      badgeText: 'text-[#1F5C60]',
    },
    gameLandmark: 'Mind-Reader’s Telepathy Tower',
    gameEmoji: '📡',
    gameRegion: 'The Psychic Plateau',
    bossNPC: 'Madame Telepathica',
    funnyLore: 'Intercepts psychic broadcasts of disapproval from strangers 50 yards away. "He blinked twice—he clearly thinks my voice is irritating!"',
    antidoteSpellName: 'Signal Jammer of Fact',
    mapCoords: { x: 74, y: 18 },
  },
  {
    id: 'fortune-telling',
    number: 4,
    name: 'Fortune Telling',
    line1: 'Fortune',
    line2: 'Telling',
    aka: 'Premature Foretelling',
    category: 'Prediction',
    iconType: 'hourglass',
    metaphor: 'The Dark Crystal Ball',
    iconDescription:
      'The hourglass icon illustrates predicting doomed future moments ahead of time, locking down tomorrow before it even arrives.',
    definition:
      'Treating negative predictions about the future as foregone conclusions, convincing yourself that failure is sealed before you even begin.',
    whyBrainDoesIt:
      'Predicting doom feels like a defense mechanism to avoid disappointment. If you expect the worst, you believe you won\'t be caught off guard.',
    cluePhrases: ['I already know it won\'t work', 'There is no point trying', 'It is going to go horribly', 'I know how this ends'],
    bookExample: 'The last relationship only lasted 2 months... this new one will fail too.',
    bookReframe:
      'Every person and relationship is unique. I will show up authentically and take it one day at a time.',
    coreQuestion: 'Do I have facts to prove this outcome, or is it an anxious prediction disguised as fact?',
    antidoteSteps: [
      { step: 'Drop the crystal ball', action: 'Recognize that nobody can predict the future with 100% accuracy.' },
      { step: 'Identify what you control', action: 'Focus energy on your present actions, not unknowable futures.' },
      { step: 'Allow positive possibilities', action: 'What if things go surprisingly well or simply okay?' },
    ],
    color: {
      bg: 'bg-sky-100',
      text: 'text-sky-800',
      border: 'border-sky-300',
      badgeBg: 'bg-sky-50',
      badgeText: 'text-sky-800',
    },
    gameLandmark: 'Fortune Telling Gypsy Valley',
    gameEmoji: '🔮',
    gameRegion: 'The Mystic Mirage Valleys',
    bossNPC: 'Madame Cassandra the Gloom-Seer',
    funnyLore: 'Gazing deeply into a cracked crystal ball: "Aha! I foresee awkwardness at tomorrow’s meeting, followed by lifelong solitude and despair!"',
    antidoteSpellName: 'The Blank Page Charm',
    mapCoords: { x: 86, y: 42 },
  },
  {
    id: 'magnifying-negative',
    number: 5,
    name: 'Magnifying the Negative',
    line1: 'Magnifying',
    line2: 'the Negative',
    aka: 'Mental Filtering & Tunnel Vision',
    category: 'Filtering',
    iconType: 'zoom-in',
    metaphor: 'The Negative Zoom Lens',
    iconDescription:
      'The magnifying glass icon represents zooming in tightly on a single defect or flaw while completely blurring out everything that went well.',
    definition:
      'Fixating attention exclusively on a single flaw, irritation, or negative detail while entirely ignoring all positive and neutral aspects of a situation.',
    whyBrainDoesIt:
      'Negativity bias: humans evolved to prioritize red-alert hazards over peaceful scenery to stay alive in nature.',
    cluePhrases: ['Look at this flaw', 'The whole thing is ruined because of X', 'Nothing went right', 'All I see is mistakes'],
    bookExample:
      'I got an A on 9 assignments, but made a C on this quiz, so I\'m doing terribly in this class.',
    bookReframe:
      'One low quiz grade is a bummer, but my 9 A\'s show I understand the material. I can review the quiz topics and improve.',
    coreQuestion: 'Am I viewing the entire landscape, or squinting at a single speck of dust?',
    antidoteSteps: [
      { step: 'Zoom out', action: 'Take a step back to view the whole picture, not just the single flaw.' },
      { step: 'List three positives', action: 'Deliberately identify three things that went smoothly or well.' },
      { step: 'Balance perspective', action: 'Place the flaw into proportion with the larger context.' },
    ],
    color: {
      bg: 'bg-rose-100',
      text: 'text-rose-800',
      border: 'border-rose-300',
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-800',
    },
    gameLandmark: 'The Doom-Goggles Swamp',
    gameEmoji: '🕳️',
    gameRegion: 'The Murky Bogs',
    bossNPC: 'Inspector Nitpicker',
    funnyLore: 'Equipped with heavy lead goggles that filter out 99 beautiful compliments to zoom in on a single typo in a 40-page report.',
    antidoteSpellName: 'Wide-Angle Sunburst',
    mapCoords: { x: 60, y: 52 },
  },
  {
    id: 'minimizing-positive',
    number: 6,
    name: 'Minimizing the Positive',
    line1: 'Minimizing',
    line2: 'the Positive',
    aka: 'Disqualifying the Good',
    category: 'Filtering',
    iconType: 'zoom-out',
    metaphor: 'The Sieve of Dismissal',
    iconDescription:
      'The dismissive hand icon portrays batting away sincere achievements and praise as if they were accidental or unearned.',
    definition:
      'Rejecting positive experiences, compliments, or accomplishments by insisting that they "don\'t count" or were merely pure luck.',
    whyBrainDoesIt:
      'When core self-esteem feels vulnerable, accepting a compliment creates cognitive dissonance, so the mind quickly shrugs it off as an accident.',
    cluePhrases: ['That doesn\'t count', 'Anyone could have done it', 'They were just being polite', 'It was pure luck'],
    bookExample: "My boss praised my presentation, but she was probably just saying that so I wouldn't feel bad.",
    bookReframe:
      "My boss doesn't hand out compliments for fun. She praised my work because I put genuine effort into it and did well.",
    coreQuestion: 'Why am I disqualifying evidence that proves my competence?',
    antidoteSteps: [
      { step: 'Accept the compliment', action: 'Say "Thank you" without immediately adding an excuse.' },
      { step: 'Own your agency', action: 'Identify what skill or effort you contributed to this win.' },
      { step: 'Allow credit', action: 'Let positive evidence update your self-image instead of rejecting it.' },
    ],
    color: {
      bg: 'bg-teal-100',
      text: 'text-teal-800',
      border: 'border-teal-300',
      badgeBg: 'bg-teal-50',
      badgeText: 'text-teal-800',
    },
    gameLandmark: 'The "Doesn\'t Count" Trapdoor',
    gameEmoji: '🗑️',
    gameRegion: 'The Denial Dungeon',
    bossNPC: 'The Discounter Goblin',
    funnyLore: 'Every time you accomplish something cool, this goblin pulls a trapdoor cord: "Psh, pure fluke! Anyone with two neurons could do that!"',
    antidoteSpellName: 'Trophy of Credit',
    mapCoords: { x: 30, y: 46 },
  },
  {
    id: 'emotional-reasoning',
    number: 7,
    name: 'Emotional Reasoning',
    line1: 'Emotional',
    line2: 'Reasoning',
    aka: 'Feelings as Facts',
    category: 'Judgment',
    iconType: 'waves',
    metaphor: 'The Emotional Undertow',
    iconDescription:
      'The waves icon signifies mistaking an internal wave of emotion for the physical, objective terrain outside of your body.',
    definition:
      'Assuming that because you strongly feel a certain emotion, it must reflect objective, verified truth ("If I feel scared, danger is guaranteed; if I feel guilty, I did wrong").',
    whyBrainDoesIt:
      'Emotions feel intense and physical in the chest and stomach, creating a convincing illusion that they are external physical realities.',
    cluePhrases: ['I feel it, therefore it is true', 'I feel like a fraud', 'I feel overwhelmed so it\'s hopeless', 'I feel stupid'],
    bookExample: 'I feel angry. That means this waiter is definitely treating me unfairly and disrespectfully.',
    bookReframe:
      'I feel tense and irritated today from poor sleep, but the restaurant is simply busy and the waiter isn\'t targeting me.',
    coreQuestion: 'Is this an internal emotional reaction in my body, or a verified external fact?',
    antidoteSteps: [
      { step: 'Label the feeling', action: 'Say: "I am experiencing the feeling of anxiety," rather than "This is unsafe."' },
      { step: 'Inspect physical triggers', action: 'Am I hungry, tired, caffeinated, or stressed?' },
      { step: 'Consult external facts', action: 'What does verifiable evidence say independent of my emotional wave?' },
    ],
    color: {
      bg: 'bg-rose-100',
      text: 'text-rose-800',
      border: 'border-rose-300',
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-800',
    },
    gameLandmark: '"Feels-Like-Fact" Rapids',
    gameEmoji: '🌊',
    gameRegion: 'The Emotional Estuary',
    bossNPC: 'Captain Emotion',
    funnyLore: 'Rafting down churning rapids where logic drowns: "I feel like an imposter, therefore Harvard is revoking my high school diploma!"',
    antidoteSpellName: 'Lighthouse of Evidence',
    mapCoords: { x: 14, y: 70 },
  },
  {
    id: 'labeling',
    number: 8,
    name: 'Labeling & Mislabeling',
    line1: 'Labeling &',
    line2: 'Mislabeling',
    aka: 'Global Judgments',
    category: 'Judgment',
    iconType: 'tag',
    metaphor: 'The Permanent Sticker',
    iconDescription:
      'The label tag icon illustrates slapping an indelible, permanent sticker on your whole identity because of an isolated human mistake.',
    definition:
      'Assigning global, harsh character labels to yourself or other people (e.g. "I\'m a loser", "He\'s a jerk") based on a single action or moment.',
    whyBrainDoesIt:
      'Mental shortcut: labeling puts complex humans into fixed neat boxes, saving mental cognitive energy at the cost of empathy and truth.',
    cluePhrases: ['I am a loser', 'I am stupid', 'They are completely toxic', 'I am hopeless', 'I am a failure'],
    bookExample: "I sent the calendar invite to the wrong person. I am so completely stupid.",
    bookReframe:
      'I made an honest human scheduling mistake because I was rushing. Making a mistake does not make me stupid.',
    coreQuestion: 'Can I separate a single human mistake from my complete identity and human worth?',
    antidoteSteps: [
      { step: 'Peel off the sticker', action: 'Replace the identity noun ("I am a failure") with a behavior verb ("I made an error").' },
      { step: 'Recognize complexity', action: 'No human can be summarized by a single derogatory word.' },
      { step: 'Practice self-compassion', action: 'Speak to yourself like you would to a friend who dropped a glass.' },
    ],
    color: {
      bg: 'bg-teal-100',
      text: 'text-teal-800',
      border: 'border-teal-300',
      badgeBg: 'bg-teal-50',
      badgeText: 'text-teal-800',
    },
    gameLandmark: 'Permanent Marker Graveyard',
    gameEmoji: '🏷️',
    gameRegion: 'The Stereotype Slums',
    bossNPC: 'The Defamer Ghoul',
    funnyLore: 'Dropped a fork at a café? Quick, slap a permanent ink stamp directly onto your forehead: "CERTIFIED VILLAGE BUFFOON FOR LIFE."',
    antidoteSpellName: 'Label Solvent Elixir',
    mapCoords: { x: 42, y: 78 },
  },
  {
    id: 'should-statements',
    number: 9,
    name: 'Should Statements',
    line1: 'Should',
    line2: 'Statements',
    aka: 'Inflexible Demands',
    category: 'Polarization',
    iconType: 'gavel',
    metaphor: 'The Iron Rulebook',
    iconDescription:
      'The judge\'s gavel icon reflects slamming down rigid, unyielding demands on yourself and the world, generating automatic guilt and resentment.',
    definition:
      'Imposing narrow, rigid rules on how you or others "should", "must", or "ought to" behave, leaving no grace for human reality.',
    whyBrainDoesIt:
      'We use "shoulds" as whip-cracks to motivate ourselves, mistakenly believing self-criticism creates discipline, when it actually causes burnout.',
    cluePhrases: ['I should have known', 'They must do this', 'I shouldn\'t feel this way', 'I have to be perfect'],
    bookExample: "I shouldn't have been so upset with her. I should always remain calm and composed.",
    bookReframe:
      'It is natural that I felt upset in that moment. I prefer to communicate calmly, and next time I can take a breath first.',
    coreQuestion: 'What happens if I replace "I should" with "I would prefer to" or "It is understandable that"?',
    antidoteSteps: [
      { step: 'Catch the gavel', action: 'Listen for "should", "must", "have to", and "ought".' },
      { step: 'Swap to preference', action: 'Rephrase to: "I would prefer..." or "It would be ideal if..."' },
      { step: 'Grant human permission', action: 'Accept that you and others have limits, moods, and learning curves.' },
    ],
    color: {
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-300',
      badgeBg: 'bg-slate-50',
      badgeText: 'text-slate-800',
    },
    gameLandmark: 'The Tyrant’s "Should" Citadel',
    gameEmoji: '🏰',
    gameRegion: 'The Guilt Highlands',
    bossNPC: 'King Imperative the Demanding',
    funnyLore: 'Issues 500 mandatory royal decrees before dawn: "You SHOULD have anticipated rainy weather! You SHOULD have mastered violin by now!"',
    antidoteSpellName: 'The Scroll of Preferences',
    mapCoords: { x: 70, y: 76 },
  },
  {
    id: 'self-blaming',
    number: 10,
    name: 'Self-Blaming',
    line1: 'Self-Blaming',
    line2: '(Personalization)',
    aka: 'Personalization',
    category: 'Judgment',
    iconType: 'target',
    metaphor: 'The Universal Target',
    iconDescription:
      'The bullseye target icon symbolizes standing at the center of the universe and absorbing 100% blame for events outside your control.',
    definition:
      'Believing you are solely responsible for negative events, other people\'s bad moods, or uncontrollable outcomes even when many external factors were at play.',
    whyBrainDoesIt:
      'Counterintuitively, taking 100% blame gives an illusion of control: "If it\'s all my fault, then I can control everything." Real life is shared and unpredictable.',
    cluePhrases: ['It\'s all my fault', 'If only I hadn\'t...', 'I ruined everything for them', 'I am to blame'],
    bookExample: "I was late to meet my friend and ruined what would have otherwise been a perfect evening for everyone.",
    bookReframe:
      'Being late was inconvenient and I apologized, but my friend\'s overall mood also involved her stressful day at work.',
    coreQuestion: 'What other external variables, people, and factors played a role besides my own actions?',
    antidoteSteps: [
      { step: 'Draw a responsibility pie', action: 'Slice a pie chart with all contributing factors (traffic, weather, others).' },
      { step: 'Recognize other autonomy', action: 'Remember that other adults are responsible for regulating their own feelings.' },
      { step: 'Own only your piece', action: 'Take ownership for your true 20% while letting go of the other 80%.' },
    ],
    color: {
      bg: 'bg-[#EAF3F2]',
      text: 'text-[#236064]',
      border: 'border-[#BCDEDC]',
      badgeBg: 'bg-[#F2F8F8]',
      badgeText: 'text-[#1B4F52]',
    },
    gameLandmark: 'Main-Character Blame Crater',
    gameEmoji: '🎯',
    gameRegion: 'The Self-Blame Crater',
    bossNPC: 'Atlas the Universal Blamer',
    funnyLore: 'A satellite fell out of orbit over the Pacific? Obviously, your bad posture this morning threw off the Earth’s gravitational magnetic pull.',
    antidoteSpellName: 'The Shield of Boundaries',
    mapCoords: { x: 88, y: 80 },
  },
];

interface DistortionIconProps {
  id?: string;
  iconType?: string;
  className?: string;
}

export const DistortionIcon: React.FC<DistortionIconProps> = ({
  id,
  iconType,
  className = 'w-5 h-5',
}) => {
  const type = iconType || (id ? TEN_COGNITIVE_DISTORTIONS.find((d) => d.id === id)?.iconType : '');

  switch (type) {
    case 'split':
      return <Split className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'radio':
      return <Radio className={className} />;
    case 'hourglass':
      return <Hourglass className={className} />;
    case 'zoom-in':
      return <ZoomIn className={className} />;
    case 'zoom-out':
      return <ZoomOut className={className} />;
    case 'waves':
      return <Waves className={className} />;
    case 'tag':
      return <Tag className={className} />;
    case 'gavel':
      return <Gavel className={className} />;
    case 'target':
      return <Target className={className} />;
    default:
      return <Target className={className} />;
  }
};
