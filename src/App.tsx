import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Navigation, NavView } from "./components/Navigation";
import { DashboardView } from "./views/DashboardView";
import { MoodAnalyticsView } from "./views/MoodAnalyticsView";
import { AiCompanionView } from "./views/AiCompanionView";
import { WellnessView } from "./views/WellnessView";
import { ReflectionView } from "./views/ReflectionView";
import { FunZoneView } from "./views/FunZoneView";
import { CommunityView } from "./views/CommunityView";
import { ResourcesView } from "./views/ResourcesView";
import { TherapistsView } from "./views/TherapistsView";

import { MoodCheckInModal } from "./components/MoodCheckInModal";
import { ConversationalCheckInModal } from "./components/ConversationalCheckInModal";
import { CrisisSupportModal } from "./components/CrisisSupportModal";
import { ProfessionalSupportModal } from "./components/ProfessionalSupportModal";
import { ProfileModal } from "./components/ProfileModal";
import { OnboardingModal } from "./components/OnboardingModal";
import { PandaGreetingPopup } from "./components/PandaGreetingPopup";

import { MoodCheckIn, UserProfile, JournalEntry } from "./types";
import { initialMoodHistory, initialJournalEntries } from "./data/mockData";
import { soundEngine } from "./utils/audio";

const defaultUser: UserProfile = {
  name: "Alex",
  phone: "+1 (555) 389-2041",
  avatar: "🐼",
  intention: "Easing Everyday Anxiety",
  joinDate: new Date().toISOString(),
  streak: 3,
  longestStreak: 5,
  totalMindfulMinutes: 24,
  preferences: {
    soundEffects: true,
    dailyReminderTime: "20:00",
    anonymousMode: true,
    softChimes: true,
  },
};

export default function App() {
  // Persistence
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("luma_user_profile");
      return saved ? JSON.parse(saved) : defaultUser;
    } catch {
      return defaultUser;
    }
  });

  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("luma_has_onboarded");
      return saved !== null ? JSON.parse(saved) : false; // prompt onboarding if new
    } catch {
      return false;
    }
  });

  const [moodHistory, setMoodHistory] = useState<MoodCheckIn[]>(() => {
    try {
      const saved = localStorage.getItem("luma_mood_history");
      return saved ? JSON.parse(saved) : initialMoodHistory;
    } catch {
      return initialMoodHistory;
    }
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem("luma_journal_entries");
      return saved ? JSON.parse(saved) : initialJournalEntries;
    } catch {
      return initialJournalEntries;
    }
  });

  // Current view & modals
  const [activeView, setActiveView] = useState<NavView>("dashboard");
  const [extraParam, setExtraParam] = useState<string | undefined>(undefined);

  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isConversationalCheckInOpen, setIsConversationalCheckInOpen] = useState(false);
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [isProfSupportOpen, setIsProfSupportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!hasOnboarded);
  const [soundEnabled, setSoundEnabled] = useState(user.preferences.soundEffects);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("luma_user_profile", JSON.stringify(user));
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem("luma_mood_history", JSON.stringify(moodHistory));
    } catch {}
  }, [moodHistory]);

  useEffect(() => {
    try {
      localStorage.setItem("luma_journal_entries", JSON.stringify(journalEntries));
    } catch {}
  }, [journalEntries]);

  useEffect(() => {
    try {
      localStorage.setItem("luma_has_onboarded", JSON.stringify(hasOnboarded));
    } catch {}
  }, [hasOnboarded]);

  const todayCheckIn = moodHistory[0];

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    setUser((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, soundEffects: next },
    }));
    if (next) soundEngine.playPop();
  };

  const handleSaveCheckIn = (checkIn: MoodCheckIn) => {
    setMoodHistory((prev) => [checkIn, ...prev]);
    // increment streak & mindful minutes
    setUser((prev) => ({
      ...prev,
      streak: prev.streak + 1,
      longestStreak: Math.max(prev.streak + 1, prev.longestStreak),
      totalMindfulMinutes: prev.totalMindfulMinutes + 2,
    }));
  };

  const handleSaveJournal = (entry: JournalEntry) => {
    setJournalEntries((prev) => [entry, ...prev]);
    setUser((prev) => ({
      ...prev,
      totalMindfulMinutes: prev.totalMindfulMinutes + 3,
    }));
  };

  const handleDeleteJournal = (id: string) => {
    soundEngine.playPop();
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleNavigate = (view: NavView | string, param?: string) => {
    soundEngine.playPop();
    if (view === "professional_support" || view === "find_professional" || view === "therapists") {
      setActiveView("therapists");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (view === "safety_alert" || view === "crisis") {
      setIsCrisisOpen(true);
      return;
    }
    setActiveView(view as NavView);
    setExtraParam(param);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWellnessCompleted = (minutes: number) => {
    setUser((prev) => ({
      ...prev,
      totalMindfulMinutes: prev.totalMindfulMinutes + minutes,
    }));
  };

  const handleResetData = () => {
    soundEngine.playPop();
    setMoodHistory(initialMoodHistory);
    setJournalEntries(initialJournalEntries);
    setUser(defaultUser);
    localStorage.clear();
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser(profile);
    setHasOnboarded(true);
    setIsOnboardingOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Top Header */}
      <Header
        user={user}
        todayCheckIn={todayCheckIn}
        onOpenCheckIn={() => setIsCheckInOpen(true)}
        onOpenCrisis={() => setIsCrisisOpen(true)}
        onOpenTherapists={() => {
          setActiveView("therapists");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Connected Navigation */}
      <Navigation
        activeView={activeView}
        onChangeView={(v) => {
          setExtraParam(undefined);
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeView === "dashboard" && (
          <DashboardView
            user={user}
            todayCheckIn={todayCheckIn}
            onOpenCheckIn={() => setIsCheckInOpen(true)}
            onOpenConversationalCheckIn={() => setIsConversationalCheckInOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {activeView === "mood" && (
          <MoodAnalyticsView
            user={user}
            history={moodHistory}
            onOpenCheckIn={() => setIsCheckInOpen(true)}
          />
        )}

        {activeView === "ai" && (
          <AiCompanionView
            user={user}
            currentMood={todayCheckIn}
            onNavigateAction={handleNavigate}
            onOpenCrisis={() => setIsCrisisOpen(true)}
            onOpenProfessionalSupport={() => {
              setActiveView("therapists");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {activeView === "therapists" && (
          <TherapistsView onOpenCrisis={() => setIsCrisisOpen(true)} />
        )}

        {activeView === "wellness" && (
          <WellnessView
            initialActivity={extraParam}
            onActivityCompleted={handleWellnessCompleted}
          />
        )}

        {activeView === "reflect" && (
          <ReflectionView
            initialMode={extraParam === "dump" ? "dump" : "journal"}
            entries={journalEntries}
            onSaveEntry={handleSaveJournal}
            onDeleteEntry={handleDeleteJournal}
          />
        )}

        {activeView === "fun" && <FunZoneView />}

        {activeView === "community" && <CommunityView user={user} />}

        {activeView === "resources" && (
          <ResourcesView
            onOpenCrisis={() => setIsCrisisOpen(true)}
            onOpenTherapists={() => {
              setActiveView("therapists");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>

      {/* Footer disclaimer */}
      <footer className="py-6 px-4 border-t border-purple-100 text-center text-xs text-slate-600 bg-white/50">
        <div className="max-w-4xl mx-auto space-y-1">
          <p className="font-semibold text-slate-700">
            LUMA is a non-clinical wellness companion designed for everyday reflection, relaxation and mindful calm.
          </p>
          <p className="text-[11px] text-slate-600">
            It does not provide psychiatric diagnosis, therapy, or emergency care. If you are seeking local professional care, explore{" "}
            <button
              onClick={() => {
                setActiveView("therapists");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-purple-700 font-semibold underline hover:text-purple-900 cursor-pointer"
            >
              Nearby Therapists & Clinics (Jaipur)
            </button>{" "}
            or tap{" "}
            <button
              onClick={() => setIsCrisisOpen(true)}
              className="text-rose-700 font-semibold underline hover:text-rose-900 cursor-pointer"
            >
              24/7 Helplines
            </button>.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <MoodCheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSave={handleSaveCheckIn}
        initialCheckIn={todayCheckIn}
      />

      <ConversationalCheckInModal
        isOpen={isConversationalCheckInOpen}
        onClose={() => setIsConversationalCheckInOpen(false)}
        onSaveCheckIn={handleSaveCheckIn}
        onNavigateAction={handleNavigate}
        onOpenProfessionalSupport={() => setIsProfSupportOpen(true)}
        userName={user.name}
      />

      <CrisisSupportModal
        isOpen={isCrisisOpen}
        onClose={() => setIsCrisisOpen(false)}
      />

      <ProfessionalSupportModal
        isOpen={isProfSupportOpen}
        onClose={() => setIsProfSupportOpen(false)}
        defaultCity="Jaipur, Rajasthan"
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateUser={setUser}
        onResetData={handleResetData}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
      />

      {/* Warm Panda Greeting Popup */}
      <PandaGreetingPopup
        userName={user.name}
        onOpenCheckIn={() => setIsConversationalCheckInOpen(true)}
      />
    </div>
  );
}
