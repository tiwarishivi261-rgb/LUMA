import React from "react";
import { Flame, Heart, HeartHandshake, Sparkles, User, Volume2, VolumeX, Bell, Stethoscope } from "lucide-react";
import { MoodCheckIn, UserProfile } from "../types";
import { PandaMascot } from "./PandaMascot";

interface HeaderProps {
  user: UserProfile;
  todayCheckIn?: MoodCheckIn;
  onOpenCheckIn: () => void;
  onOpenCrisis: () => void;
  onOpenTherapists?: () => void;
  onOpenProfile: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  todayCheckIn,
  onOpenCheckIn,
  onOpenCrisis,
  onOpenTherapists,
  onOpenProfile,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-purple-100/60 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E6DEFA] to-[#FFF0EB] border border-purple-200/60 flex items-center justify-center shadow-xs">
            <PandaMascot mood="waving" size="sm" animate={false} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-slate-800">
                LUMA
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Companion online" />
            </div>
            <p className="text-[10px] sm:text-[11px] font-medium text-purple-700/80 tracking-wide uppercase">
              Mindful Companion
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Today's Mood Check-in Pill */}
          <button
            id="header-checkin-pill-btn"
            onClick={onOpenCheckIn}
            className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              todayCheckIn
                ? "bg-purple-100/80 text-purple-800 border border-purple-200 hover:bg-purple-200/70"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-purple-200"
            }`}
          >
            {todayCheckIn ? (
              <>
                <span className="text-sm">
                  {todayCheckIn.mood === "joyful" && "☀️"}
                  {todayCheckIn.mood === "peaceful" && "🌿"}
                  {todayCheckIn.mood === "balanced" && "🌱"}
                  {todayCheckIn.mood === "reflective" && "🌙"}
                  {todayCheckIn.mood === "anxious" && "🌊"}
                  {todayCheckIn.mood === "drained" && "🔋"}
                  {todayCheckIn.mood === "overwhelmed" && "🌪️"}
                </span>
                <span className="capitalize hidden sm:inline">{todayCheckIn.mood}</span>
                <span className="text-[10px] opacity-75">({todayCheckIn.intensity}/10)</span>
              </>
            ) : (
              <>
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Check In</span>
              </>
            )}
          </button>

          {/* Streak Indicator */}
          <div
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold"
            title={`${user.streak} Day Mindfulness Streak`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{user.streak}</span>
            <span className="hidden md:inline font-normal text-amber-700 text-[11px]">d streak</span>
          </div>

          {/* Audio toggle */}
          <button
            id="header-sound-toggle-btn"
            onClick={onToggleSound}
            aria-label={soundEnabled ? "Mute chimes" : "Enable chimes"}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-200 flex items-center justify-center transition-colors cursor-pointer"
            title={soundEnabled ? "Sound enabled" : "Sound muted"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-purple-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Find Nearby Therapist */}
          {onOpenTherapists && (
            <button
              id="header-find-therapist-btn"
              onClick={onOpenTherapists}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100/80 border border-purple-200/90 text-purple-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="Find Nearby Therapists & Clinics (Jaipur & Your Area)"
            >
              <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Find Therapist</span>
            </button>
          )}

          {/* Crisis / Safety Helpline Drawer */}
          <button
            id="header-crisis-btn"
            onClick={onOpenCrisis}
            className="px-2.5 sm:px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Crisis Support & 24/7 Helplines"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Support</span>
          </button>

          {/* User Profile Avatar */}
          <button
            id="header-profile-btn"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-indigo-100 border border-purple-300 flex items-center justify-center text-sm shadow-xs hover:scale-105 transition-transform cursor-pointer"
            title={`Profile: ${user.name}`}
          >
            <span>{user.avatar || "🐼"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
