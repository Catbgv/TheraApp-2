export interface EmotionItem {
  id: string;
  name: string;
  category: string;
  intensity: number; // 1 to 10
}

export interface StructuredEntry {
  event: string;
  thoughts: string;
  emotions: EmotionItem[];
  actions: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface WorkPlanItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ReflectionTakeaway {
  id: string;
  date: string;
  timestamp: number;
  title: string;
  entry: StructuredEntry;
  messages: ChatMessage[];
  dominantThought: string;
  pattern: {
    name: string;
    description: string;
    identified: boolean;
  };
  balancedPerspective: string;
  insights: string[];
  workPlan: WorkPlanItem[];
}

export type TabType = 'home' | 'journal' | 'distortions' | 'progress' | 'breathe';

export type ScreenState = 
  | 'home'
  | 'form'
  | 'chat'
  | 'takeaway';
