import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart, X, Smile, Sun, Check } from "lucide-react";
import { PandaMascot } from "./PandaMascot";
import { soundEngine } from "../utils/audio";

interface PandaGreetingPopupProps {
  userName: string;
  onOpenCheckIn: () => void;
}

export const PandaGreetingPopup: React.FC<PandaGreetingPopupProps> = ({
  userName,
  onOpenCheckIn,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if greeting was shown in this session
    const shown = sessionStorage.getItem("luma_panda_greeting_shown");
    if (!shown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        soundEngine.playChime(528, 1.8);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    soundEngine.playPop();
    sessionStorage.setItem("luma_panda_greeting_shown", "true");
    setIsOpen(false);
  };

  const handleStartCheckIn = () => {
    handleClose();
    onOpenCheckIn();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-[calc(100vw-48px)] sm:w-80 bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-purple-200/80 overflow-hidden"
        >
          {/* Subtle glowing corner */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-purple-200/50 via-pink-100/30 to-transparent rounded-bl-full pointer-events-none" />

          <button
            onClick={handleClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close greeting"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-3.5">
            <div className="shrink-0 pt-1">
              <PandaMascot mood="waving" size="sm" animate={true} />
            </div>

            <div className="space-y-1.5 pr-3">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>Bao is here!</span>
              </div>

              <h4 className="text-sm font-bold font-heading text-slate-800">
                Welcome back, {userName}! 🌸
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                Take a soft, quiet breath. How are you arriving today? Let's check in together.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between gap-2">
            <button
              onClick={handleClose}
              className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1.5 font-medium cursor-pointer"
            >
              Maybe later
            </button>

            <button
              id="greeting-checkin-cta"
              onClick={handleStartCheckIn}
              className="px-4 py-1.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Check In Now</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
