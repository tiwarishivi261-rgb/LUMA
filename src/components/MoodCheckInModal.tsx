import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Heart, Check, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { MoodCheckIn, MoodType } from "../types";
import { soundEngine } from "../utils/audio";
import { PandaMascot } from "./PandaMascot";

interface MoodCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCheckIn?: (checkIn: MoodCheckIn) => void;
  onSave?: (checkIn: MoodCheckIn) => void;
  lastMood?: MoodType;
  initialCheckIn?: MoodCheckIn;
}

const moodOptions: Array<{
  type: MoodType;
  label: string;
  emoji: string;
  sublabel: string;
  theme: string;
  activeBorder: string;
  activeBg: string;
}> = [
  {
    type: "joyful",
    label: "Joyful",
    emoji: "☀️",
    sublabel: "Radiant, grateful, glowing",
    theme: "text-amber-600",
    activeBorder: "border-amber-400 ring-2 ring-amber-200",
    activeBg: "bg-amber-50",
  },
  {
    type: "peaceful",
    label: "Peaceful",
    emoji: "🌿",
    sublabel: "Calm, steady, content",
    theme: "text-emerald-600",
    activeBorder: "border-emerald-400 ring-2 ring-emerald-200",
    activeBg: "bg-emerald-50",
  },
  {
    type: "balanced",
    label: "Balanced",
    emoji: "🌱",
    sublabel: "Grounded, present, okay",
    theme: "text-teal-600",
    activeBorder: "border-teal-400 ring-2 ring-teal-200",
    activeBg: "bg-teal-50",
  },
  {
    type: "reflective",
    label: "Reflective",
    emoji: "🌙",
    sublabel: "Quiet, thoughtful, introspective",
    theme: "text-purple-600",
    activeBorder: "border-purple-400 ring-2 ring-purple-200",
    activeBg: "bg-purple-50",
  },
  {
    type: "anxious",
    label: "Anxious",
    emoji: "🌊",
    sublabel: "Restless, fluttery, on edge",
    theme: "text-indigo-600",
    activeBorder: "border-indigo-400 ring-2 ring-indigo-200",
    activeBg: "bg-indigo-50",
  },
  {
    type: "drained",
    label: "Drained",
    emoji: "🔋",
    sublabel: "Low battery, fatigued, foggy",
    theme: "text-slate-600",
    activeBorder: "border-slate-400 ring-2 ring-slate-200",
    activeBg: "bg-slate-100",
  },
  {
    type: "overwhelmed",
    label: "Overwhelmed",
    emoji: "🌪️",
    sublabel: "Carrying too much, crowded mind",
    theme: "text-rose-600",
    activeBorder: "border-rose-400 ring-2 ring-rose-200",
    activeBg: "bg-rose-50",
  },
];

const availableReasons = [
  "Work & Tasks",
  "Sleep & Energy",
  "Friends & Social",
  "Family",
  "Health & Body",
  "Alone Time",
  "Weather",
  "Finances",
  "School / Learning",
  "Overthinking",
  "Accomplishment",
  "Nature",
];

export const MoodCheckInModal: React.FC<MoodCheckInModalProps> = ({
  isOpen,
  onClose,
  onSaveCheckIn,
  onSave,
  lastMood = "peaceful",
  initialCheckIn,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>(
    initialCheckIn?.mood || lastMood
  );
  const [intensity, setIntensity] = useState<number>(
    initialCheckIn?.intensity || 6
  );
  const [selectedReasons, setSelectedReasons] = useState<string[]>(
    initialCheckIn?.reasons || ["Sleep & Energy"]
  );
  const [note, setNote] = useState<string>(initialCheckIn?.note || "");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const toggleReason = (reason: string) => {
    soundEngine.playPop();
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const getIntensityLabel = (val: number) => {
    if (val <= 2) return "A gentle, subtle whisper";
    if (val <= 4) return "Light and manageable";
    if (val <= 6) return "Noticeable and present";
    if (val <= 8) return "Quite strong & prominent";
    return "Deeply felt throughout mind and body";
  };

  const handleSubmit = () => {
    soundEngine.playChime(528, 2);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#A78BFA", "#FBCFE8", "#FDE68A", "#6EE7B7"],
      });
    } catch {}

    const newCheckIn: MoodCheckIn = {
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mood: selectedMood,
      intensity,
      reasons: selectedReasons,
      note: note.trim(),
    };

    (onSaveCheckIn || onSave)?.(newCheckIn);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-[#FFFDF9] rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-purple-100/80 my-8 relative overflow-hidden"
          >
            {isSubmitted ? (
              <div className="py-12 text-center flex flex-col items-center">
                <PandaMascot mood="cheering" size="lg" />
                <h3 className="text-2xl font-bold font-heading text-slate-800 mt-4">
                  Check-in Recorded ✨
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-xs">
                  Thank you for taking this mindful pause. Your emotional rhythm is being nurtured.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Heart className="w-5 h-5 fill-purple-200" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-heading text-slate-800">
                        How are you arriving right now?
                      </h3>
                      <p className="text-xs text-slate-500">
                        No judgment, just honest space for where you are.
                      </p>
                    </div>
                  </div>
                  <button
                    id="close-mood-modal-btn"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mood Cards Grid */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                    Select Your Mood
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {moodOptions.map((item) => {
                      const isSelected = selectedMood === item.type;
                      return (
                        <button
                          key={item.type}
                          id={`mood-option-${item.type}`}
                          onClick={() => {
                            soundEngine.playPop();
                            setSelectedMood(item.type);
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                            isSelected
                              ? `${item.activeBorder} ${item.activeBg} shadow-xs scale-[1.02]`
                              : "border-slate-200/80 bg-white hover:border-purple-200 hover:bg-purple-50/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{item.emoji}</span>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px]">
                                <Check className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <div className={`text-sm font-semibold ${isSelected ? item.theme : "text-slate-700"}`}>
                            {item.label}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {item.sublabel}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Intensity Slider */}
                <div className="mb-5 p-4 rounded-2xl bg-purple-50/40 border border-purple-100/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-700">
                      Intensity Level: <strong className="text-purple-700 text-sm">{intensity} / 10</strong>
                    </span>
                    <span className="text-xs text-purple-600 font-medium">
                      {getIntensityLabel(intensity)}
                    </span>
                  </div>
                  <input
                    id="mood-intensity-slider"
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Soft & Subtle</span>
                    <span>Moderate</span>
                    <span>Deeply Felt</span>
                  </div>
                </div>

                {/* Context Tags */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    What is influencing this feeling? (Optional)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableReasons.map((r) => {
                      const active = selectedReasons.includes(r);
                      return (
                        <button
                          key={r}
                          id={`reason-tag-${r.replace(/\s+/g, "-").toLowerCase()}`}
                          type="button"
                          onClick={() => toggleReason(r)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            active
                              ? "bg-purple-600 text-white shadow-xs"
                              : "bg-white border border-slate-200 text-slate-600 hover:border-purple-300"
                          }`}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes Input */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Add a gentle note (Optional)
                  </label>
                  <textarea
                    id="mood-note-textarea"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="E.g., Felt a bit restless after the meeting, taking a soft pause now..."
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all resize-none"
                  />
                </div>

                {/* Action button */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    id="cancel-mood-checkin-btn"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    id="submit-mood-checkin-btn"
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    Save Check-in
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
