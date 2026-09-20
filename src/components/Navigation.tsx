import React from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  HeartPulse,
  Bot,
  Wind,
  BookHeart,
  Gamepad2,
  Users,
  Compass,
  Stethoscope,
} from "lucide-react";
import { soundEngine } from "../utils/audio";

export type NavView =
  | "dashboard"
  | "mood"
  | "ai"
  | "wellness"
  | "reflect"
  | "fun"
  | "community"
  | "resources"
  | "therapists";

interface NavigationProps {
  activeView: NavView;
  onChangeView: (view: NavView) => void;
  unreadCount?: number;
}

const navItems: Array<{
  id: NavView;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "dashboard", label: "Today", sublabel: "Your Journey", icon: Sparkles },
  { id: "mood", label: "Rhythm", sublabel: "Mood & Insights", icon: HeartPulse },
  { id: "ai", label: "Talk to LUMA", sublabel: "AI Companion", icon: Bot },
  { id: "therapists", label: "Find Therapist", sublabel: "Nearby Care", icon: Stethoscope },
  { id: "wellness", label: "Wellness", sublabel: "Breathe & Ground", icon: Wind },
  { id: "reflect", label: "Reflect", sublabel: "Journal & Vent", icon: BookHeart },
  { id: "fun", label: "Fun Zone", sublabel: "Play & Unwind", icon: Gamepad2 },
  { id: "community", label: "Circle", sublabel: "Anonymous Space", icon: Users },
  { id: "resources", label: "Affirmations", sublabel: "Guides & Audio", icon: Compass },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeView,
  onChangeView,
}) => {
  return (
    <nav className="bg-white/90 border-b border-purple-100/70 shadow-xs sticky top-[57px] z-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none justify-start md:justify-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  soundEngine.playPop();
                  onChangeView(item.id);
                }}
                className={`relative px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                  isActive
                    ? "text-purple-950 font-semibold"
                    : "text-slate-600 hover:text-purple-700 hover:bg-purple-50/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavBackground"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-100 via-lavender-100 to-purple-100 border border-purple-200/80 shadow-xs"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-purple-700" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
