export type MoodType =
  | "joyful"
  | "peaceful"
  | "balanced"
  | "reflective"
  | "anxious"
  | "drained"
  | "overwhelmed";

export interface MoodCheckIn {
  id: string;
  timestamp: string; // ISO string
  mood: MoodType;
  intensity: number; // 1 - 10
  reasons: string[];
  note: string;
}

export interface UserProfile {
  name: string;
  phone?: string;
  avatar: string; // emoji or animal code
  intention: string;
  joinDate: string;
  streak: number;
  longestStreak: number;
  totalMindfulMinutes: number;
  preferences: {
    soundEffects: boolean;
    dailyReminderTime: string;
    anonymousMode: boolean;
    softChimes: boolean;
  };
}

export interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  content: string;
  tags: string[];
  moodSnapshot?: MoodType;
}

export interface ThoughtDump {
  id: string;
  timestamp: string;
  content: string;
  released: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestedAction?: {
    type: "breathing" | "grounding" | "journal" | "fun_zone" | "body_scan" | "professional_support";
    label: string;
    actionKey?: string;
  };
  suggestProfessionalSupport?: boolean;
  isSafetyConcern?: boolean;
}

export interface CommunityReply {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  author?: string;
  authorAlias?: string;
  avatar: string;
  topic?: string;
  tag?: string;
  timestamp: string;
  content: string;
  reactions?: number;
  hearts?: number;
  hugs?: number;
  sparkles?: number;
  replies?: CommunityReply[];
  hasReacted?: {
    hearts?: boolean;
    hugs?: boolean;
    sparkles?: boolean;
  };
}

export interface WellnessRecommendation {
  id: string;
  title: string;
  category: "Breathwork" | "Grounding" | "Reflection" | "Fun & Unwind" | "Rest";
  duration: string;
  reasonWhy: string;
  iconName: string;
  actionView: string;
  actionSubKey?: string;
}

export interface ResourceArticle {
  id: string;
  title: string;
  category: "Anxiety & Stress" | "Sleep & Unwinding" | "Focus & Reset" | "Self-Compassion" | "Relationships";
  readTime: string;
  description: string;
  keyTakeaways: string[];
  practicalExercise: string;
}

export interface Affirmation {
  id: string;
  text: string;
  category: string;
  reflectionPrompt: string;
  isFavorite?: boolean;
}

export type FunZoneTab = "play" | "listen" | "watch" | "laugh";

export type TicTacToeDifficulty = "easy" | "medium" | "hard";
export type Player = "X" | "O" | null;

export interface MusicTrack {
  title: string;
  artist: string;
  duration: string;
  tag?: string;
  whyGood?: string;
  tags?: string[];
}

export interface MusicVibe {
  id?: string;
  vibe: string;
  emoji: string;
  description: string;
  color?: string;
  tracks?: MusicTrack[];
  featuredTracks?: Array<{
    title: string;
    artist: string;
    duration: string;
    tags: string[];
  }>;
}

export interface WatchItem {
  id?: string;
  title: string;
  genre?: string;
  type?: "Movie" | "Series" | "Animation" | string;
  year?: string;
  runtime?: string;
  platform?: string;
  synopsis: string;
  whyWatch: string;
  moodFit?: string;
  rating?: string;
  comfortRating?: string;
}

export interface WatchCategory {
  genre: string;
  items: WatchItem[];
}

export interface JokeItem {
  id?: string;
  category: string;
  setup: string;
  punchline: string;
  pandaReaction: string;
}

export interface HealthcareProvider {
  id: string;
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  distanceKm?: number;
  types?: string[];
}
