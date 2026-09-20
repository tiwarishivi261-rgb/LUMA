import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Bell, Volume2, Shield, Flame, Clock, Award, Trash2, Check, Sparkles } from "lucide-react";
import { UserProfile } from "../types";
import { soundEngine } from "../utils/audio";
import { PandaMascot } from "./PandaMascot";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onResetData: () => void;
}

const avatars = ["🐼", "🐨", "🦙", "🦦", "🦊", "🐰"];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onResetData,
}) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [soundEffects, setSoundEffects] = useState(user.preferences.soundEffects);
  const [dailyReminderTime, setDailyReminderTime] = useState(user.preferences.dailyReminderTime);
  const [anonymousMode, setAnonymousMode] = useState(user.preferences.anonymousMode);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    soundEngine.playPop();
    const updated: UserProfile = {
      ...user,
      name: name.trim() || "Friend",
      avatar,
      preferences: {
        ...user.preferences,
        soundEffects,
        dailyReminderTime,
        anonymousMode,
      },
    };
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-[#FFFDF9] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 my-8 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl">
                  {avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-slate-800">
                    Profile & Settings
                  </h3>
                  <p className="text-xs text-slate-500">
                    Customize your LUMA sanctuary
                  </p>
                </div>
              </div>
              <button
                id="close-profile-modal-btn"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Rhythm stats summary */}
            <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-gradient-to-r from-purple-50/80 to-indigo-50/60 border border-purple-100/60 mb-5 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-amber-600 font-bold text-base">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>{user.streak}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Current Streak</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-purple-600 font-bold text-base">
                  <Award className="w-4 h-4" />
                  <span>{user.longestStreak}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Best Streak</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold text-base">
                  <Clock className="w-4 h-4" />
                  <span>{user.totalMindfulMinutes}m</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Mindful Time</div>
              </div>
            </div>

            {/* Profile editing */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Your Name
                </label>
                <input
                  id="settings-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Inner Companion Avatar
                </label>
                <div className="flex gap-2">
                  {avatars.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        soundEngine.playPop();
                        setAvatar(av);
                      }}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                        avatar === av
                          ? "bg-purple-100 border-2 border-purple-500 scale-105"
                          : "bg-white border border-slate-200 hover:bg-purple-50/50"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Volume2 className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="text-xs font-semibold text-slate-700">
                        Organic Chimes & Audio
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Breath chimes and ambient soundscapes
                      </div>
                    </div>
                  </div>
                  <input
                    id="settings-sound-toggle"
                    type="checkbox"
                    checked={soundEffects}
                    onChange={(e) => setSoundEffects(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded-sm focus:ring-purple-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="text-xs font-semibold text-slate-700">
                        Daily Check-in Reminder
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Evening reflection reminder
                      </div>
                    </div>
                  </div>
                  <input
                    id="settings-reminder-time"
                    type="time"
                    value={dailyReminderTime}
                    onChange={(e) => setDailyReminderTime(e.target.value)}
                    className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="text-xs font-semibold text-slate-700">
                        Anonymous Community Identity
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Post as animal alias instead of real name
                      </div>
                    </div>
                  </div>
                  <input
                    id="settings-anon-toggle"
                    type="checkbox"
                    checked={anonymousMode}
                    onChange={(e) => setAnonymousMode(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded-sm focus:ring-purple-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                id="reset-data-btn"
                onClick={() => {
                  if (confirm("Reset local demo data and check-ins?")) {
                    onResetData();
                    onClose();
                  }
                }}
                className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset Data
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="save-profile-btn"
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Saved!
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
