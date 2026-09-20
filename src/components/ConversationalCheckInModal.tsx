import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  X,
  Sparkles,
  ArrowRight,
  Wind,
  Compass,
  BookHeart,
  Music,
  HelpCircle,
  Stethoscope,
  Check,
} from "lucide-react";
import { MoodCheckIn, MoodType } from "../types";
import { soundEngine } from "../utils/audio";
import { PandaMascot } from "./PandaMascot";

interface ConversationalCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCheckIn: (checkIn: MoodCheckIn) => void;
  onNavigateAction: (view: any, extraKey?: string) => void;
  onOpenProfessionalSupport: () => void;
  userName: string;
}

interface EmotionOption {
  type: MoodType;
  label: string;
  emoji: string;
  tone: string;
  gentlePrompt: string;
}

const emotionList: EmotionOption[] = [
  {
    type: "anxious",
    label: "Anxious / Restless",
    emoji: "🌊",
    tone: "text-indigo-600",
    gentlePrompt: "Fluttery chest, spinning thoughts, or on edge",
  },
  {
    type: "overwhelmed",
    label: "Overwhelmed",
    emoji: "🌪️",
    tone: "text-rose-600",
    gentlePrompt: "Carrying too much, crowded thoughts, heavy pressure",
  },
  {
    type: "drained",
    label: "Tired / Drained",
    emoji: "🔋",
    tone: "text-slate-600",
    gentlePrompt: "Low energy, depleted battery, needing gentle rest",
  },
  {
    type: "peaceful",
    label: "Peaceful / Calm",
    emoji: "🌿",
    tone: "text-emerald-600",
    gentlePrompt: "Unhurried, breathing easily, at ease",
  },
  {
    type: "reflective",
    label: "Reflective / Quiet",
    emoji: "🌙",
    tone: "text-purple-600",
    gentlePrompt: "Thoughtful, introspective, observing within",
  },
  {
    type: "joyful",
    label: "Joyful / Hopeful",
    emoji: "☀️",
    tone: "text-amber-600",
    gentlePrompt: "Grateful, lighthearted, smiling softly",
  },
  {
    type: "balanced",
    label: "Balanced / Steady",
    emoji: "🌱",
    tone: "text-teal-600",
    gentlePrompt: "Grounded, present, navigating day by day",
  },
];

export const ConversationalCheckInModal: React.FC<ConversationalCheckInModalProps> = ({
  isOpen,
  onClose,
  onSaveCheckIn,
  onNavigateAction,
  onOpenProfessionalSupport,
  userName,
}) => {
  const [step, setStep] = useState<"emotion" | "describe" | "suggestions">("emotion");
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionOption | null>(null);
  const [userStory, setUserStory] = useState("");
  const [intensity, setIntensity] = useState(5);

  const resetFlow = () => {
    setStep("emotion");
    setSelectedEmotion(null);
    setUserStory("");
    setIntensity(5);
  };

  const handleSelectEmotion = (emo: EmotionOption) => {
    soundEngine.playPop();
    setSelectedEmotion(emo);
    setStep("describe");
  };

  const handleCompleteCheckIn = () => {
    soundEngine.playChime(528, 2);
    if (selectedEmotion) {
      const newCheckIn: MoodCheckIn = {
        id: `checkin-${Date.now()}`,
        timestamp: new Date().toISOString(),
        mood: selectedEmotion.type,
        intensity,
        reasons: ["Conversational Check-in"],
        note: userStory.trim(),
      };
      onSaveCheckIn(newCheckIn);
    }
    setStep("suggestions");
  };

  // Determine if user's words or emotion suggest professional support
  const storyLower = userStory.toLowerCase();
  const suggestsNeedForSupport =
    selectedEmotion?.type === "overwhelmed" ||
    selectedEmotion?.type === "anxious" ||
    intensity >= 8 ||
    storyLower.includes("therapist") ||
    storyLower.includes("can't handle") ||
    storyLower.includes("hopeless") ||
    storyLower.includes("depression") ||
    storyLower.includes("alone") ||
    storyLower.includes("panic");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22 }}
            className="bg-[#FFFDF9] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-purple-100 relative overflow-hidden my-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100/80 border border-purple-200/80 flex items-center justify-center">
                  <PandaMascot mood="listening" size="sm" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-800">
                    How are you feeling, {userName}?
                  </h3>
                  <p className="text-xs text-purple-700 font-medium">
                    A safe, unhurried check-in with LUMA
                  </p>
                </div>
              </div>
              <button
                id="close-conversational-checkin-btn"
                onClick={() => {
                  onClose();
                  setTimeout(resetFlow, 300);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Emotion Selection */}
            {step === "emotion" && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Take a soft breath. Drop your shoulders away from your ears. What words feel closest to what you're holding inside right now?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {emotionList.map((emo) => (
                    <button
                      key={emo.type}
                      id={`checkin-emotion-${emo.type}`}
                      onClick={() => handleSelectEmotion(emo)}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-300 hover:bg-purple-50/40 text-left transition-all flex items-start gap-3 cursor-pointer group shadow-2xs"
                    >
                      <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                        {emo.emoji}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-purple-700">
                          {emo.label}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                          {emo.gentlePrompt}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Describe what you are going through (optional) */}
            {step === "describe" && selectedEmotion && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 flex items-center gap-3">
                  <span className="text-2xl">{selectedEmotion.emoji}</span>
                  <div>
                    <div className="text-xs font-bold text-purple-900">
                      You selected: {selectedEmotion.label}
                    </div>
                    <div className="text-[11px] text-purple-700">
                      {selectedEmotion.gentlePrompt}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Optionally describe what you are going through:
                  </label>
                  <textarea
                    id="conversational-checkin-story-input"
                    rows={4}
                    value={userStory}
                    onChange={(e) => setUserStory(e.target.value)}
                    placeholder="E.g. Feeling stretched thin between work deadlines and not sleeping well..."
                    className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all resize-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Your words remain private and local to your safe space.
                  </p>
                </div>

                {/* Intensity selector */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Intensity:</span>
                    <span className="text-purple-700 font-bold">{intensity} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setStep("emotion")}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    ← Change feeling
                  </button>
                  <button
                    id="conversational-checkin-continue-btn"
                    onClick={handleCompleteCheckIn}
                    className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Receive Gentle Guidance</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Gentle Personalized Wellness Suggestions */}
            {step === "suggestions" && selectedEmotion && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border border-purple-100">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Thank you for sharing, {userName}</span>
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {selectedEmotion.type === "anxious" || selectedEmotion.type === "overwhelmed"
                      ? "It takes real gentleness to acknowledge when things feel heavy. Here are soothing anchors curated for your current state:"
                      : selectedEmotion.type === "drained"
                      ? "Your mind and body are signaling for quiet restoration. You don't have to push through right now."
                      : "Honoring this moment of lightness or reflection helps build long-term emotional resilience."}
                  </p>
                </div>

                {/* Personalized Action Cards */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Recommended next gentle step:
                  </div>

                  {(selectedEmotion.type === "anxious" || selectedEmotion.type === "overwhelmed") && (
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateAction("wellness", "box");
                      }}
                      className="w-full p-3.5 rounded-2xl bg-white border border-purple-200/80 hover:bg-purple-50/50 hover:border-purple-300 text-left transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                          <Wind className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-purple-700">
                            2-Minute Box Breathing
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Regulate heart rate & settle autonomic nervous tension
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-purple-500" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onClose();
                      onNavigateAction("wellness", "grounding");
                    }}
                    className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-left transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-purple-700">
                          5-4-3-2-1 Sensory Grounding
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Bring anxious mind back to physical senses
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onNavigateAction("reflect", "dump");
                    }}
                    className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-left transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                        <BookHeart className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-purple-700">
                          Mindful Thought Dump
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Unload racing thoughts and release them into the sky
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onNavigateAction("fun");
                    }}
                    className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-left transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Music className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-purple-700">
                          Soothing Music & Fun Zone
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Comfort tracks, jokes, and gentle unwind cinema
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                  </button>
                </div>

                {/* Professional Support Option if response suggests it */}
                {suggestsNeedForSupport && (
                  <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-200/80 space-y-2">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-rose-600" />
                      <h5 className="text-xs font-bold text-rose-900">
                        Need Additional Caring Support?
                      </h5>
                    </div>
                    <p className="text-[11px] text-rose-800 leading-relaxed">
                      If these feelings are recurring or heavy, connecting with an accredited professional can be deeply helpful. You can browse nearby doctors, therapists, and clinics in Jaipur, Rajasthan:
                    </p>
                    <button
                      id="checkin-open-prof-support-btn"
                      onClick={() => {
                        onClose();
                        onOpenProfessionalSupport();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Find Professional Support Near You</span>
                    </button>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      setTimeout(resetFlow, 300);
                    }}
                    className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
