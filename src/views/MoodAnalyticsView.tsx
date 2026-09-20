import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Heart,
  TrendingUp,
  Calendar as CalendarIcon,
  Sparkles,
  Plus,
  BarChart3,
  Clock,
  Tag,
  ArrowUpRight,
  Flame,
} from "lucide-react";
import { MoodCheckIn, MoodType, UserProfile } from "../types";
import { soundEngine } from "../utils/audio";
import { PandaMascot } from "../components/PandaMascot";

interface MoodAnalyticsViewProps {
  user: UserProfile;
  history: MoodCheckIn[];
  onOpenCheckIn: () => void;
}

const moodEmojis: Record<MoodType, string> = {
  joyful: "☀️",
  peaceful: "🌿",
  balanced: "🌱",
  reflective: "🌙",
  anxious: "🌊",
  drained: "🔋",
  overwhelmed: "🌪️",
};

const moodColors: Record<MoodType, string> = {
  joyful: "bg-amber-100 text-amber-800 border-amber-200",
  peaceful: "bg-emerald-100 text-emerald-800 border-emerald-200",
  balanced: "bg-teal-100 text-teal-800 border-teal-200",
  reflective: "bg-purple-100 text-purple-800 border-purple-200",
  anxious: "bg-indigo-100 text-indigo-800 border-indigo-200",
  drained: "bg-slate-100 text-slate-800 border-slate-200",
  overwhelmed: "bg-rose-100 text-rose-800 border-rose-200",
};

export const MoodAnalyticsView: React.FC<MoodAnalyticsViewProps> = ({
  user,
  history,
  onOpenCheckIn,
}) => {
  const [aiInsight, setAiInsight] = useState<{
    summary: string;
    keyPattern: string;
    nudge: string;
  }>({
    summary: "Your emotional baseline demonstrates gentle resilience.",
    keyPattern: "Quiet afternoons and mindful pauses noticeably stabilize your focus.",
    nudge: "Take three slow breaths before checking notifications this afternoon.",
  });
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    async function fetchInsight() {
      if (!history || history.length === 0) return;
      try {
        setLoadingInsight(true);
        const res = await fetch("/api/mood/insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            history,
            currentMood: history[0],
            userName: user.name,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setAiInsight(data);
        }
      } catch (err) {
        // Fallback default insight exists
      } finally {
        setLoadingInsight(false);
      }
    }
    fetchInsight();
  }, [history]);

  // Aggregate frequencies
  const moodCounts: Record<string, number> = {};
  const reasonCounts: Record<string, number> = {};
  let totalIntensity = 0;

  history.forEach((h) => {
    moodCounts[h.mood] = (moodCounts[h.mood] || 0) + 1;
    totalIntensity += h.intensity;
    h.reasons.forEach((r) => {
      reasonCounts[r] = (reasonCounts[r] || 0) + 1;
    });
  });

  const avgIntensity = history.length ? (totalIntensity / history.length).toFixed(1) : "0";

  // Top reasons
  const topReasons = Object.entries(reasonCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-7">
      {/* Header with log checkin button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-800">
            Mood & Emotional Rhythm
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Understanding your internal weather over time without judgment
          </p>
        </div>

        <button
          id="analytics-new-checkin-btn"
          onClick={onOpenCheckIn}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Log New Mood
        </button>
      </div>

      {/* AI Pattern & Insight Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 via-white to-indigo-50 border border-purple-200/70 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Pattern Synthesis</span>
            </div>

            <h3 className="text-lg font-bold font-heading text-slate-800">
              {aiInsight.summary}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Observed Rhythm:</strong> {aiInsight.keyPattern}
            </p>

            <div className="text-xs text-purple-900 bg-white/80 p-2.5 rounded-xl border border-purple-100 inline-block">
              ✨ <strong>Gentle Nudge:</strong> {aiInsight.nudge}
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center shrink-0">
            <PandaMascot mood="thinking" size="md" />
          </div>
        </div>
      </div>

      {/* Key Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Logged Check-ins
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading text-slate-800">
            {history.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Nurturing continuous presence</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Avg Intensity
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading text-purple-700">
            {avgIntensity} <span className="text-xs text-slate-400">/ 10</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Emotional amplitude</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Current Rhythm
          </div>
          <div className="text-2xl sm:text-3xl font-black font-heading text-amber-600 flex items-center gap-1">
            <Flame className="w-6 h-6 fill-current" />
            <span>{user.streak}d</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Longest: {user.longestStreak} days</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Top Context Anchor
          </div>
          <div className="text-lg sm:text-xl font-bold font-heading text-slate-800 truncate">
            {topReasons[0]?.[0] || "Self-reflection"}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Most frequent influence</div>
        </div>
      </div>

      {/* Mood Distribution & Trigger Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-xs">
          <h3 className="text-base font-bold font-heading text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span>Feelings Spectrum Distribution</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(moodEmojis).map(([type, emoji]) => {
              const count = moodCounts[type] || 0;
              const percent = history.length ? Math.round((count / history.length) * 100) : 0;
              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 capitalize flex items-center gap-1.5">
                      <span>{emoji}</span>
                      <span>{type}</span>
                    </span>
                    <span className="text-slate-400">{count} logs ({percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Influencing Triggers */}
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-xs">
          <h3 className="text-base font-bold font-heading text-slate-800 mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-purple-600" />
            <span>Frequent Context Factors</span>
          </h3>

          <p className="text-xs text-slate-500 mb-4">
            Notice how external circumstances correlate with your internal states.
          </p>

          <div className="space-y-2.5">
            {topReasons.map(([reason, count], i) => (
              <div
                key={reason}
                className="p-3 rounded-2xl bg-[#FAF8F5] border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-[10px]">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-slate-700">{reason}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                  {count} check-ins
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mood History Timeline */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-xs">
        <h3 className="text-base font-bold font-heading text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          <span>Timeline History</span>
        </h3>

        <div className="divide-y divide-slate-100">
          {history.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-xl shrink-0 ${
                    moodColors[item.mood]
                  }`}
                >
                  {moodEmojis[item.mood]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 capitalize text-sm">
                      {item.mood}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Intensity: {item.intensity}/10
                    </span>
                  </div>
                  {item.note && (
                    <p className="text-xs text-slate-600 mt-0.5 italic">
                      "{item.note}"
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.reasons.map((r) => (
                      <span
                        key={r}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400 shrink-0">
                {new Date(item.timestamp).toLocaleDateString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
