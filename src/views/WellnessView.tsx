import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wind,
  Compass,
  BrainCircuit,
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Eye,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import { soundEngine } from "../utils/audio";
import { PandaMascot } from "../components/PandaMascot";

interface WellnessViewProps {
  initialActivity?: string;
  onActivityCompleted?: (minutes: number) => void;
}

type ActivityTab = "breathing" | "grounding" | "body_scan" | "focus_reset";
type BreathingTechnique = "478" | "box" | "energize";

export const WellnessView: React.FC<WellnessViewProps> = ({
  initialActivity,
  onActivityCompleted,
}) => {
  const [activeTab, setActiveTab] = useState<ActivityTab>(
    initialActivity?.startsWith("breathing")
      ? "breathing"
      : initialActivity === "grounding_54321"
      ? "grounding"
      : initialActivity === "body_scan"
      ? "body_scan"
      : initialActivity === "focus_reset"
      ? "focus_reset"
      : "breathing"
  );

  // Breathing State
  const [technique, setTechnique] = useState<BreathingTechnique>(
    initialActivity === "breathing_box" ? "box" : "478"
  );
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Hold After Exhale">("Inhale");
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [chimeEnabled, setChimeEnabled] = useState(true);

  // Grounding 5-4-3-2-1 State
  const [groundingStep, setGroundingStep] = useState(0);
  const groundingSteps = [
    {
      count: 5,
      title: "5 Things You Can See",
      desc: "Look around your space. Notice 5 distinct colors, shapes, or objects.",
      examples: ["Pattern on the floor", "Shadow on the wall", "A book title", "Light reflection", "Leaf outside"],
    },
    {
      count: 4,
      title: "4 Things You Can Physically Touch",
      desc: "Feel the tactile reality of your surroundings right now.",
      examples: ["Fabric of your shirt", "Cool tabletop", "Soles of your shoes", "Weight of your phone"],
    },
    {
      count: 3,
      title: "3 Things You Can Hear",
      desc: "Listen for layers of sound in the distance or right beside you.",
      examples: ["Distant traffic hum", "Air conditioner breeze", "Your own gentle breath"],
    },
    {
      count: 2,
      title: "2 Things You Can Smell",
      desc: "Notice subtle aromas or imagine the soothing scent of lavender/rain.",
      examples: ["Fresh air", "Warm coffee / tea aroma"],
    },
    {
      count: 1,
      title: "1 Thing You Appreciate About Yourself",
      desc: "Take a quiet breath and name one strength, kindness, or effort you made today.",
      examples: ["I showed up today", "I was patient with a loved one", "I'm taking care of my mind right now"],
    },
  ];

  // Body Scan State
  const bodyScanZones = [
    { name: "Crown & Forehead", cue: "Unclench your eyebrows, release tension behind the eyes." },
    { name: "Jaw & Mouth", cue: "Let your tongue rest naturally on the roof of your mouth. Unclench teeth." },
    { name: "Neck & Shoulders", cue: "Drop your shoulders down and gently away from your ears." },
    { name: "Chest & Heart Space", cue: "Feel your ribs expand softly without forcing the breath." },
    { name: "Belly & Lower Back", cue: "Allow your abdomen to soften completely on the exhale." },
    { name: "Hands & Fingers", cue: "Notice any tingling or warmth in your open palms." },
    { name: "Legs & Feet", cue: "Feel gravity grounding your soles firmly into the earth." },
  ];
  const [scanIndex, setScanIndex] = useState(0);

  // Focus Reset State
  const [resetStep, setResetStep] = useState(0);
  const resetPrompts = [
    { title: "20-20-20 Eye Rest", text: "Look away from the screen at something 20 feet away for 20 seconds. Let your vision soften." },
    { title: "Shoulder Roll Sequence", text: "Inhale while rolling shoulders up to your ears, exhale as you sweep them back and down. Repeat 3 times." },
    { title: "Hydration Anchor", text: "Take a mindful sip of water. Savor the cool, refreshing sensation through your throat." },
    { title: "Single-Task Clarity", text: "Choose exactly ONE small next action. Write it down and give yourself permission to ignore the rest for now." },
  ];

  // Breathing Loop
  useEffect(() => {
    let timer: any;
    if (!isBreathingActive) return;

    timer = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev <= 1) {
          // Advance phase
          advanceBreathingPhase();
          return 4; // temporary, will be set in advance
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase, technique]);

  const advanceBreathingPhase = () => {
    if (chimeEnabled) soundEngine.playChime(528, 1.8);

    if (technique === "478") {
      if (breathPhase === "Inhale") {
        setBreathPhase("Hold");
        setPhaseSecondsLeft(7);
      } else if (breathPhase === "Hold") {
        setBreathPhase("Exhale");
        setPhaseSecondsLeft(8);
      } else {
        // Exhale done
        setBreathPhase("Inhale");
        setPhaseSecondsLeft(4);
        setCyclesCompleted((c) => c + 1);
      }
    } else if (technique === "box") {
      if (breathPhase === "Inhale") {
        setBreathPhase("Hold");
        setPhaseSecondsLeft(4);
      } else if (breathPhase === "Hold") {
        setBreathPhase("Exhale");
        setPhaseSecondsLeft(4);
      } else if (breathPhase === "Exhale") {
        setBreathPhase("Hold After Exhale");
        setPhaseSecondsLeft(4);
      } else {
        setBreathPhase("Inhale");
        setPhaseSecondsLeft(4);
        setCyclesCompleted((c) => c + 1);
      }
    } else {
      // Coherent 5-5
      if (breathPhase === "Inhale") {
        setBreathPhase("Exhale");
        setPhaseSecondsLeft(5);
      } else {
        setBreathPhase("Inhale");
        setPhaseSecondsLeft(5);
        setCyclesCompleted((c) => c + 1);
      }
    }
  };

  const startBreathing = () => {
    soundEngine.playPop();
    setIsBreathingActive(true);
    setBreathPhase("Inhale");
    setPhaseSecondsLeft(technique === "energize" ? 5 : 4);
    if (chimeEnabled) soundEngine.playChime(432, 2);
  };

  const stopBreathing = () => {
    setIsBreathingActive(false);
  };

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase("Inhale");
    setPhaseSecondsLeft(technique === "energize" ? 5 : 4);
    setCyclesCompleted(0);
  };

  const handleFinishWellness = (name: string, minutes: number) => {
    soundEngine.playChime(528, 2.5);
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#A78BFA", "#FBCFE8", "#6EE7B7"],
      });
    } catch {}
    if (onActivityCompleted) onActivityCompleted(minutes);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center justify-center p-1.5 bg-white rounded-3xl border border-purple-100 shadow-xs max-w-lg mx-auto">
        {[
          { id: "breathing", label: "Breathing Space", icon: Wind },
          { id: "grounding", label: "5-4-3-2-1 Grounding", icon: Compass },
          { id: "body_scan", label: "Body Scan", icon: BrainCircuit },
          { id: "focus_reset", label: "Focus Reset", icon: Timer },
        ].map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              id={`wellness-tab-${t.id}`}
              onClick={() => {
                soundEngine.playPop();
                setActiveTab(t.id as ActivityTab);
              }}
              className={`flex-1 py-2 px-2 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                active
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-purple-700 hover:bg-purple-50/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. BREATHING SPACE */}
      {activeTab === "breathing" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs text-center relative overflow-hidden">
          {/* Header selection */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-800">
                Mindful Breathing Sanctuary
              </h2>
              <p className="text-xs text-slate-500">
                Slowing your exhale directly stimulates the vagus nerve
              </p>
            </div>

            {/* Technique pills */}
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-2xl">
              {[
                { id: "478", name: "4-7-8 Relaxing" },
                { id: "box", name: "Box (4-4-4-4)" },
                { id: "energize", name: "Coherent (5-5)" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    soundEngine.playPop();
                    setTechnique(m.id as BreathingTechnique);
                    setIsBreathingActive(false);
                    setPhaseSecondsLeft(m.id === "energize" ? 5 : 4);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    technique === m.id
                      ? "bg-white text-purple-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-purple-600"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Animated Breath Visualizer Circle */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-6 flex items-center justify-center">
            {/* Outer expanding glowing ripples */}
            <motion.div
              animate={
                isBreathingActive
                  ? breathPhase === "Inhale"
                    ? { scale: [1, 1.28], opacity: [0.3, 0.7] }
                    : breathPhase === "Exhale"
                    ? { scale: [1.28, 1], opacity: [0.7, 0.3] }
                    : { scale: breathPhase === "Hold" ? 1.28 : 1, opacity: 0.6 }
                  : { scale: 1, opacity: 0.3 }
              }
              transition={{
                duration: phaseSecondsLeft > 0 ? phaseSecondsLeft : 1,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-200 via-indigo-100 to-rose-100"
            />

            {/* Inner Main Orb */}
            <motion.div
              animate={
                isBreathingActive
                  ? breathPhase === "Inhale"
                    ? { scale: [0.85, 1.15] }
                    : breathPhase === "Exhale"
                    ? { scale: [1.15, 0.85] }
                    : { scale: breathPhase === "Hold" ? 1.15 : 0.85 }
                  : { scale: 1 }
              }
              transition={{
                duration: phaseSecondsLeft > 0 ? phaseSecondsLeft : 1,
                ease: "easeInOut",
              }}
              className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-white via-purple-50 to-indigo-100 border-4 border-purple-200/80 shadow-lg flex flex-col items-center justify-center p-4 select-none"
            >
              <PandaMascot
                mood={isBreathingActive ? "breathing" : "waving"}
                size="sm"
                className="mb-1"
              />

              <div className="text-xl sm:text-2xl font-extrabold font-heading text-purple-900 tracking-wide">
                {isBreathingActive ? breathPhase : "Ready"}
              </div>

              <div className="text-2xl sm:text-3xl font-black text-purple-700 mt-0.5">
                {isBreathingActive ? `${phaseSecondsLeft}s` : "Pause"}
              </div>

              <div className="text-[10px] text-purple-600/75 mt-1">
                {cyclesCompleted > 0 ? `${cyclesCompleted} cycles done` : "Take a soft breath"}
              </div>
            </motion.div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {!isBreathingActive ? (
              <button
                id="breathing-start-btn"
                onClick={startBreathing}
                className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Begin Breathing
              </button>
            ) : (
              <button
                id="breathing-pause-btn"
                onClick={stopBreathing}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-current" />
                Pause
              </button>
            )}

            <button
              id="breathing-reset-btn"
              onClick={resetBreathing}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Reset cycles"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setChimeEnabled(!chimeEnabled)}
              className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
                chimeEnabled
                  ? "bg-purple-50 border-purple-200 text-purple-700"
                  : "bg-slate-50 border-slate-200 text-slate-400"
              }`}
              title={chimeEnabled ? "Chimes enabled" : "Chimes muted"}
            >
              {chimeEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {cyclesCompleted >= 3 && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
              <button
                onClick={() => handleFinishWellness("Breathing Session", 3)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Complete 3-Min Mindful Breath
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. GROUNDING 5-4-3-2-1 */}
      {activeTab === "grounding" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs">
          <div className="text-center max-w-lg mx-auto mb-6">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wide">
              Sensory Anchor
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-800 mt-2 mb-1">
              5-4-3-2-1 Sensory Grounding
            </h2>
            <p className="text-xs text-slate-500">
              When overthinking pulls you into the future, your physical senses bring you right back home.
            </p>
          </div>

          {/* Stepper progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {groundingSteps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundEngine.playPop();
                  setGroundingStep(idx);
                }}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${
                  groundingStep === idx
                    ? "bg-emerald-600 text-white shadow-md scale-105"
                    : groundingStep > idx
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {groundingStep > idx ? "✓" : s.count}
              </button>
            ))}
          </div>

          {/* Current Step Card */}
          <div className="max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-100 text-center">
            <div className="w-16 h-16 rounded-3xl bg-white shadow-xs border border-emerald-200 text-emerald-700 flex items-center justify-center text-3xl font-extrabold mx-auto mb-3">
              {groundingSteps[groundingStep].count}
            </div>

            <h3 className="text-lg font-bold font-heading text-slate-800 mb-1">
              {groundingSteps[groundingStep].title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {groundingSteps[groundingStep].desc}
            </p>

            <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100 text-left mb-6">
              <div className="text-[11px] font-semibold text-emerald-800 mb-1">
                Gentle examples to notice:
              </div>
              <ul className="text-xs text-slate-600 space-y-1">
                {groundingSteps[groundingStep].examples.map((ex, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                disabled={groundingStep === 0}
                onClick={() => {
                  soundEngine.playPop();
                  setGroundingStep((s) => s - 1);
                }}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-white disabled:opacity-30 cursor-pointer"
              >
                Previous
              </button>

              {groundingStep < groundingSteps.length - 1 ? (
                <button
                  onClick={() => {
                    soundEngine.playPop();
                    soundEngine.playChime(480, 1.2);
                    setGroundingStep((s) => s + 1);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  I've Noticed These <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => handleFinishWellness("5-4-3-2-1 Grounding", 3)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  Complete Grounding <Sparkles className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. BODY SCAN */}
      {activeTab === "body_scan" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs">
          <div className="text-center max-w-lg mx-auto mb-6">
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold uppercase tracking-wide">
              Physical Somatic Release
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-800 mt-2 mb-1">
              Gentle Head-to-Toe Body Scan
            </h2>
            <p className="text-xs text-slate-500">
              Notice physical holding patterns without judgment, and invite them to soften.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center max-w-3xl mx-auto">
            {/* Mascot in meditative state */}
            <div className="p-6 rounded-3xl bg-purple-50/60 border border-purple-100 text-center flex flex-col items-center justify-center">
              <PandaMascot mood="breathing" size="lg" />
              <div className="mt-3 text-xs font-medium text-purple-900 bg-white px-3 py-1 rounded-full shadow-2xs">
                Zone {scanIndex + 1} of {bodyScanZones.length}
              </div>
            </div>

            {/* Zone Prompt Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FAF8F5] to-[#F3EEFF] border border-purple-200/70 shadow-xs flex flex-col justify-between h-72">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  Current Focus Area
                </span>
                <h3 className="text-xl font-bold font-heading text-slate-800 mt-1 mb-2">
                  {bodyScanZones[scanIndex].name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-purple-100">
                  {bodyScanZones[scanIndex].cue}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-purple-100">
                <button
                  disabled={scanIndex === 0}
                  onClick={() => {
                    soundEngine.playPop();
                    setScanIndex((i) => i - 1);
                  }}
                  className="text-xs text-slate-500 hover:text-purple-700 disabled:opacity-30 cursor-pointer"
                >
                  Previous Zone
                </button>

                {scanIndex < bodyScanZones.length - 1 ? (
                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      soundEngine.playChime(528, 1.5);
                      setScanIndex((i) => i + 1);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    Breathe & Soften <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleFinishWellness("Full Body Scan", 5)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    Complete Scan <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FOCUS RESET */}
      {activeTab === "focus_reset" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs">
          <div className="text-center max-w-lg mx-auto mb-6">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wide">
              Cognitive Declutter
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-800 mt-2 mb-1">
              2-Minute Focus Reset
            </h2>
            <p className="text-xs text-slate-500">
              Clear mental static, relieve screen fatigue, and regain calm direction.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-3 mb-6">
            {resetPrompts.map((rp, idx) => {
              const isCurrent = resetStep === idx;
              const isPast = resetStep > idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    soundEngine.playPop();
                    setResetStep(idx);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-100 shadow-xs"
                      : isPast
                      ? "bg-emerald-50/50 border-emerald-200 text-slate-700"
                      : "bg-[#FAF8F5] border-slate-200 text-slate-500 opacity-80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isPast
                            ? "bg-emerald-600 text-white"
                            : isCurrent
                            ? "bg-amber-600 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {isPast ? "✓" : idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800">{rp.title}</h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 ml-8 leading-relaxed">{rp.text}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={() => handleFinishWellness("2-Minute Focus Reset", 2)}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              Mark Focus Reset Done
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
