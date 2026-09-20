import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Heart,
  Wind,
  BrainCircuit,
  MessageCircle,
  Gamepad2,
  Flame,
  ArrowRight,
  BookOpen,
  Volume2,
  CheckCircle2,
  Compass,
  Smile,
  Stethoscope,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { MoodCheckIn, MoodType, UserProfile, WellnessRecommendation } from "../types";
import { PandaMascot } from "../components/PandaMascot";
import { soundEngine } from "../utils/audio";
import { curatedAffirmations } from "../data/mockData";

interface DashboardViewProps {
  user: UserProfile;
  todayCheckIn?: MoodCheckIn;
  onOpenCheckIn: () => void;
  onOpenConversationalCheckIn?: () => void;
  onNavigate: (view: any, extraKey?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  todayCheckIn,
  onOpenCheckIn,
  onOpenConversationalCheckIn,
  onNavigate,
}) => {
  const [affirmationFavorite, setAffirmationFavorite] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Time of day greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

  const dailyAffirmation = curatedAffirmations[0];

  const handleReadAloud = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Generate personalized recommendation based on mood
  const getPersonalizedRecommendation = (): WellnessRecommendation => {
    const mood = todayCheckIn?.mood || "peaceful";
    const intensity = todayCheckIn?.intensity || 5;

    if (mood === "anxious" || mood === "overwhelmed") {
      return {
        id: "rec-1",
        title: "4-7-8 Calming Breathwork",
        category: "Breathwork",
        duration: "3 minutes",
        reasonWhy:
          "Your nervous system indicated elevated tension. Extending the exhalation to 8 seconds activates the vagus nerve and lowers resting heart rate.",
        iconName: "Wind",
        actionView: "wellness",
        actionSubKey: "breathing_478",
      };
    }
    if (mood === "drained") {
      return {
        id: "rec-2",
        title: "Gentle Body Scan & Rest Reset",
        category: "Rest",
        duration: "5 minutes",
        reasonWhy:
          "When battery levels are depleted, forcing productivity causes friction. A soft body scan releases subconscious physical holding patterns.",
        iconName: "BrainCircuit",
        actionView: "wellness",
        actionSubKey: "body_scan",
      };
    }
    if (mood === "reflective") {
      return {
        id: "rec-3",
        title: "Gratitude & Thought Reflection",
        category: "Reflection",
        duration: "4 minutes",
        reasonWhy:
          "Quiet introspection is fertile ground for capturing meaning. Savoring three specific micro-joys anchors positive neurochemistry.",
        iconName: "BookOpen",
        actionView: "reflect",
        actionSubKey: "journal",
      };
    }
    if (mood === "joyful") {
      return {
        id: "rec-4",
        title: "Celebrate & Play in the Fun Zone",
        category: "Fun & Unwind",
        duration: "5 minutes",
        reasonWhy:
          "Joy is meant to be felt and expanded! Share a fun game of Tic-Tac-Toe against Bao or listen to upbeat Bollywood / Pop tunes.",
        iconName: "Gamepad2",
        actionView: "fun",
        actionSubKey: "play",
      };
    }
    return {
      id: "rec-5",
      title: "5-4-3-2-1 Sensory Grounding",
      category: "Grounding",
      duration: "3 minutes",
      reasonWhy:
        "Connecting through your five senses grounds your mind in the safe, quiet present moment.",
      iconName: "Compass",
      actionView: "wellness",
      actionSubKey: "grounding_54321",
    };
  };

  const recommendation = getPersonalizedRecommendation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-7">
      {/* Top Welcome Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F5F0FD] via-[#FAF7FD] to-[#FFF6F0] p-6 sm:p-8 border border-purple-100/70 shadow-xs">
        {/* Soft decorative background circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-purple-200/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 left-1/3 w-48 h-48 rounded-full bg-rose-200/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-purple-200/70 text-xs font-semibold text-purple-800 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Today's Mindful Anchor</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-slate-800 tracking-tight leading-tight">
              {greeting}, <span className="text-purple-700">{user.name}</span>.
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {todayCheckIn ? (
                <span>
                  You checked in feeling{" "}
                  <strong className="text-purple-800 capitalize">
                    {todayCheckIn.mood}
                  </strong>{" "}
                  today. How is your heart resting in this moment?
                </span>
              ) : (
                <span>
                  LUMA is here to walk beside you today. Take a gentle pause, drop your shoulders, and check in with your breath.
                </span>
              )}
            </p>

            {/* Check-in or prompt button */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                id="dashboard-conversational-checkin-btn"
                onClick={onOpenConversationalCheckIn || onOpenCheckIn}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white/30" />
                <span>How Are You Feeling?</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="dashboard-talk-to-luma-btn"
                onClick={() => onNavigate("ai")}
                className="px-4 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 border border-slate-200 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-purple-600" />
                Talk with LUMA
              </button>
            </div>
          </div>

          {/* Bao Panda Mascot greeting */}
          <div className="flex flex-col items-center">
            <PandaMascot
              mood={
                todayCheckIn?.mood === "joyful"
                  ? "cheering"
                  : todayCheckIn?.mood === "anxious"
                  ? "breathing"
                  : "waving"
              }
              size="lg"
            />
            <div className="mt-2 text-center">
              <span className="text-[11px] font-semibold text-purple-900/80 bg-white/80 px-2.5 py-0.5 rounded-full border border-purple-100">
                Bao is listening
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Connected Journey: Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base sm:text-lg font-bold font-heading text-slate-800 flex items-center gap-2">
            <span>Your Connected Journey</span>
            <span className="text-xs font-normal text-slate-400">
              (Choose what your heart needs)
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Find Therapist */}
          <button
            id="quick-action-therapist-btn"
            onClick={() => onNavigate("therapists")}
            className="p-4 rounded-3xl bg-white border border-purple-200/90 hover:border-purple-400 hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between h-36 relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                <span>Find Therapist</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="text-[11px] text-purple-700 font-medium line-clamp-1">
                Nearby care in Jaipur
              </div>
            </div>
          </button>

          {/* Card 2: Breathing */}
          <button
            id="quick-action-breath-btn"
            onClick={() => onNavigate("wellness", "breathing_478")}
            className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between h-36"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                Relaxing Breath
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1">
                4-7-8 calm nervous system
              </div>
            </div>
          </button>

          {/* Card 3: Grounding */}
          <button
            id="quick-action-grounding-btn"
            onClick={() => onNavigate("wellness", "grounding_54321")}
            className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between h-36"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                5-4-3-2-1 Grounding
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1">
                Anchor through your senses
              </div>
            </div>
          </button>

          {/* Card 4: Thought Dump */}
          <button
            id="quick-action-thought-dump-btn"
            onClick={() => onNavigate("reflect", "dump")}
            className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between h-36"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 group-hover:text-rose-700 transition-colors">
                Thought Dump
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1">
                Release worries & brain unclog
              </div>
            </div>
          </button>

          {/* Card 5: Fun Zone */}
          <button
            id="quick-action-funzone-btn"
            onClick={() => onNavigate("fun")}
            className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all text-left group cursor-pointer flex flex-col justify-between h-36"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                Fun Zone
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1">
                Play, Lo-fi, Movies & Jokes
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Dedicated Feature Section: Find Nearby Therapist */}
      <section className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold backdrop-blur-xs">
              <Stethoscope className="w-3.5 h-3.5 text-purple-300" />
              <span>Verified Medical Directory & Maps</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading">
              Find Accredited Therapists & Clinics Near You
            </h3>
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
              Looking for licensed psychologists, psychiatrists, or counseling centers in Jaipur or your local area? Explore verified ratings, phone numbers, and direct Google Maps directions.
            </p>
          </div>
          <button
            id="dashboard-browse-therapists-btn"
            onClick={() => onNavigate("therapists")}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-purple-50 text-purple-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-purple-700" />
            <span>Explore Clinics in Jaipur</span>
            <ArrowRight className="w-4 h-4 text-purple-700" />
          </button>
        </div>
      </section>

      {/* Grid: Personalized Recommendation + Your Rhythm Spark */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personalized Recommendation (2 cols) */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white border border-purple-100/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  Tailored For You Right Now
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                {recommendation.duration}
              </span>
            </div>

            <h3 className="text-xl font-bold font-heading text-slate-800 mb-2">
              {recommendation.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              {recommendation.reasonWhy}
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-purple-100/60 text-xs text-slate-600 flex items-start gap-2.5 mb-4">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>LUMA Companion Note:</strong> You don't have to finish everything today. Giving yourself even three minutes of calm sends a powerful signal of safety to your body.
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Category: {recommendation.category}
            </span>
            <button
              id="start-personalized-rec-btn"
              onClick={() =>
                onNavigate(recommendation.actionView, recommendation.actionSubKey)
              }
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              Start This Activity
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Your Rhythm (1 col) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#FAF8F5] to-[#F3EEFF] border border-purple-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Your Rhythm
              </span>
              <div className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{user.streak} Days</span>
              </div>
            </div>

            <div className="text-center py-4">
              <div className="text-3xl sm:text-4xl font-black font-heading text-slate-800 tracking-tight">
                {user.streak} <span className="text-lg font-medium text-slate-500">Day Streak</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Every mindful pause adds a thread of resilience to your emotional fabric.
              </p>
            </div>

            {/* Weekly Rhythm Dots */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-500 mb-2 text-center">
                This Week's Continuity
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => {
                  const isFilled = idx <= 4; // Simulated active days
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-slate-400 font-medium">{day}</span>
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold ${
                          isFilled
                            ? "bg-purple-600 text-white shadow-xs"
                            : "bg-white border border-slate-200 text-slate-400"
                        }`}
                      >
                        {isFilled ? "✓" : "•"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-purple-100/60 flex items-center justify-between text-xs">
            <span className="text-slate-500">Total Mindful Time</span>
            <strong className="text-purple-900 font-bold">
              {user.totalMindfulMinutes} mins
            </strong>
          </div>
        </div>
      </div>

      {/* Daily Affirmation Card with Audio Read-Aloud */}
      <section className="p-6 sm:p-7 rounded-3xl bg-white border border-purple-100/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Daily Affirmation
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="read-affirmation-audio-btn"
              onClick={() => handleReadAloud(dailyAffirmation.text)}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isSpeaking
                  ? "bg-purple-100 border-purple-300 text-purple-700"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:text-purple-600"
              }`}
              title="Listen to affirmation"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <button
              id="favorite-affirmation-btn"
              onClick={() => {
                soundEngine.playPop();
                setAffirmationFavorite(!affirmationFavorite);
              }}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                affirmationFavorite
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500"
              }`}
              title="Favorite affirmation"
            >
              <Heart
                className={`w-3.5 h-3.5 ${affirmationFavorite ? "fill-current" : ""}`}
              />
            </button>
          </div>
        </div>

        <blockquote className="text-base sm:text-lg font-medium text-slate-800 font-heading leading-relaxed italic mb-3">
          "{dailyAffirmation.text}"
        </blockquote>

        <div className="text-xs text-purple-800 bg-purple-50/70 border border-purple-100 p-3 rounded-2xl flex items-start gap-2">
          <Smile className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <span>
            <strong>Reflection Prompt:</strong> {dailyAffirmation.reflectionPrompt}
          </span>
        </div>
      </section>
    </div>
  );
};
