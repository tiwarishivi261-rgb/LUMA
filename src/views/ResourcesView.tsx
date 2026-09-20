import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Compass,
  Sparkles,
  Volume2,
  VolumeX,
  Heart,
  Copy,
  Check,
  Headphones,
  BookOpen,
  ArrowUpRight,
  Sliders,
  Play,
  Pause,
  Stethoscope,
  MapPin,
} from "lucide-react";
import { soundEngine, AmbientSoundType } from "../utils/audio";
import { curatedAffirmations } from "../data/mockData";
import { PandaMascot } from "../components/PandaMascot";

interface ResourcesViewProps {
  onOpenCrisis: () => void;
  onOpenTherapists?: () => void;
}

const soundscapes: Array<{
  id: AmbientSoundType;
  title: string;
  emoji: string;
  desc: string;
}> = [
  { id: "rain", title: "Rain on Soft Leaves", emoji: "🌧️", desc: "Gentle patter soothing nervous tension" },
  { id: "waves", title: "Ocean Waves & Shore", emoji: "🌊", desc: "Cyclic natural cadence matching deep breaths" },
  { id: "stream", title: "Forest Creek Stream", emoji: "🏞️", desc: "Crisp flowing water masking intrusive noise" },
  { id: "night", title: "Twilight Crickets & Wind", emoji: "🦗", desc: "Cozy nocturnal backdrop for bedtime" },
  { id: "whitenoise", title: "Soft Pink Ambient", emoji: "☁️", desc: "Full spectrum gentle sonic blanket" },
];

const guides = [
  {
    title: "Unpacking Overthinking & Catastrophizing",
    category: "Mindset",
    readTime: "3 min read",
    summary:
      "When the mind races ahead predicting worst-case scenarios, it's trying to protect you from vulnerability. Naming the thought 'just a story my brain is generating' creates healthy psychological distance.",
  },
  {
    title: "The Gentle Art of Compassionate Boundaries",
    category: "Relationships",
    readTime: "4 min read",
    summary:
      "Saying 'I don't have the capacity for this right now' isn't selfish—it protects the genuine warmth you bring to relationships by preventing burnout and resentment.",
  },
  {
    title: "Understanding The Nervous System's 'Freeze' Response",
    category: "Somatic Wellness",
    readTime: "3 min read",
    summary:
      "If you feel unmotivated or completely stuck, your nervous system isn't 'lazy'—it may be resting in a dorsal vagal brake. Tiny somatic shifts like rolling shoulders or drinking warm tea signal safety.",
  },
  {
    title: "Nighttime Wind-Down: Preparing The Mind For Deep Sleep",
    category: "Sleep",
    readTime: "3 min read",
    summary:
      "Sleep is an involuntary surrender, not a task to accomplish. Dimming blue lights 45 minutes prior and writing down tomorrow's to-dos untangles racing cognitive loops.",
  },
];

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  onOpenCrisis,
  onOpenTherapists,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeSound, setActiveSound] = useState<AmbientSoundType | null>(null);
  const [ambientVolume, setAmbientVolume] = useState<number>(0.5);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = ["All", "Anxiety Relief", "Self-Compassion", "Sleep & Rest", "Courage & Boundaries", "Mindful Presence"];

  const handleToggleSoundscape = (type: AmbientSoundType) => {
    if (activeSound === type) {
      soundEngine.stopAmbient();
      setActiveSound(null);
    } else {
      soundEngine.startAmbient(type, ambientVolume);
      setActiveSound(type);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    soundEngine.setAmbientVolume(vol);
  };

  const handleSpeakAffirmation = (id: string, text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (speakingId === id) {
        setSpeakingId(null);
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.88;
      u.pitch = 1.05;
      u.onend = () => setSpeakingId(null);
      u.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(u);
    }
  };

  const handleCopy = (id: string, text: string) => {
    soundEngine.playPop();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const toggleFavorite = (id: string) => {
    soundEngine.playPop();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filteredAffirmations =
    selectedCategory === "All"
      ? curatedAffirmations
      : curatedAffirmations.filter((a) => a.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-purple-600" />
          <span>Sanctuary Library</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-800 mt-1">
          Affirmations, Soundscapes & Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Wisdom, soothing frequencies and grounded perspectives to anchor your day
        </p>
      </div>

      {/* 1. AMBIENT SOUNDSCAPES SECTION */}
      <section className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#FAF8F5] to-[#F2ECFD] border border-purple-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-800">
                Procedural Ambient Soundscapes
              </h3>
              <p className="text-xs text-slate-500">
                Natural generative audio loops synthesized directly in your browser
              </p>
            </div>
          </div>

          {/* Volume slider */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-purple-100 text-xs">
            <Volume2 className="w-4 h-4 text-purple-600" />
            <span className="text-[11px] text-slate-500 font-medium">Vol</span>
            <input
              id="soundscape-volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-24 accent-purple-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Soundscapes row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {soundscapes.map((s) => {
            const isPlaying = activeSound === s.id;
            return (
              <button
                key={s.id}
                id={`soundscape-btn-${s.id}`}
                onClick={() => handleToggleSoundscape(s.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-32 ${
                  isPlaying
                    ? "bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-300"
                    : "bg-white border-slate-200/90 text-slate-700 hover:border-purple-300 hover:shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{s.emoji}</span>
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className={`text-xs font-bold ${isPlaying ? "text-white" : "text-slate-800"}`}>
                    {s.title}
                  </div>
                  <div className={`text-[10px] line-clamp-1 mt-0.5 ${isPlaying ? "text-purple-100" : "text-slate-400"}`}>
                    {s.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. CURATED AFFIRMATIONS SECTION */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold font-heading text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Gentle Affirmations</span>
          </h3>

          {/* Category Filter */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  soundEngine.playPop();
                  setSelectedCategory(c);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === c
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-purple-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAffirmations.map((aff) => {
            const isFav = favorites.includes(aff.id);
            const isSpeaking = speakingId === aff.id;
            const isCopied = copiedId === aff.id;

            return (
              <div
                key={aff.id}
                className="p-5 rounded-3xl bg-white border border-purple-100 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-100">
                      {aff.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSpeakAffirmation(aff.id, aff.text)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isSpeaking
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : "bg-slate-50 text-slate-400 hover:text-purple-600 border-slate-200"
                        }`}
                        title="Listen"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(aff.id, aff.text)}
                        className="p-1.5 rounded-lg border bg-slate-50 text-slate-400 hover:text-purple-600 border-slate-200 transition-colors"
                        title="Copy"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleFavorite(aff.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isFav
                            ? "bg-rose-50 text-rose-500 border-rose-200"
                            : "bg-slate-50 text-slate-400 hover:text-rose-500 border-slate-200"
                        }`}
                        title="Favorite"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  </div>

                  <blockquote className="text-sm sm:text-base font-bold font-heading text-slate-800 leading-snug my-2">
                    "{aff.text}"
                  </blockquote>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-600 bg-[#FAF8F5] p-2.5 rounded-xl">
                  <strong>Reflect:</strong> {aff.reflectionPrompt}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SUPPORTIVE WELLNESS GUIDES */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold font-heading text-slate-800 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-600" />
          <span>Non-Clinical Wellness Insights</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guides.map((g, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-purple-200 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                  <span className="font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                    {g.category}
                  </span>
                  <span>{g.readTime}</span>
                </div>

                <h4 className="text-base font-bold font-heading text-slate-800 mb-2">
                  {g.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {g.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-purple-700 font-medium">
                <span>Compassionate reading</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FIND LOCAL CLINICS & THERAPISTS */}
      <section className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs text-purple-200 font-semibold">
            <Stethoscope className="w-3.5 h-3.5 text-purple-300" />
            <span>Professional Care Directory</span>
          </div>
          <h4 className="text-base sm:text-lg font-bold font-heading">
            Looking for an Accredited Therapist or Psychiatrist in Jaipur?
          </h4>
          <p className="text-xs text-purple-100/90 leading-relaxed">
            Discover verified mental health clinics and licensed doctors near you with ratings, contact numbers, and direct Google Maps navigation.
          </p>
        </div>
        {onOpenTherapists && (
          <button
            onClick={onOpenTherapists}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-purple-50 text-purple-950 text-xs font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-purple-700" />
            <span>Explore Clinics</span>
          </button>
        )}
      </section>
    </div>
  );
};
