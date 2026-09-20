import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookHeart,
  BrainCircuit,
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Tag,
  Search,
  CheckCircle2,
  Flame,
  Wind,
  Heart,
} from "lucide-react";
import confetti from "canvas-confetti";
import { JournalEntry, ThoughtDump } from "../types";
import { soundEngine } from "../utils/audio";
import { PandaMascot } from "../components/PandaMascot";

interface ReflectionViewProps {
  initialMode?: "journal" | "dump";
  entries: JournalEntry[];
  onSaveEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
}

const journalPrompts = [
  "What is one tiny ordinary joy you noticed in the last 24 hours?",
  "Who is someone whose presence brings safety or lightness to your heart?",
  "What is one gentle boundary or promise you honored for yourself recently?",
  "Name a quality you admire about your resilience on hard days.",
  "What is a piece of art, music, or nature that moved you this week?",
];

export const ReflectionView: React.FC<ReflectionViewProps> = ({
  initialMode = "journal",
  entries,
  onSaveEntry,
  onDeleteEntry,
}) => {
  const [mode, setMode] = useState<"journal" | "dump">(initialMode);

  // Journal form state
  const [selectedPrompt, setSelectedPrompt] = useState(journalPrompts[0]);
  const [journalContent, setJournalContent] = useState("");
  const [tagInput, setTagInput] = useState("Gratitude");
  const [searchQuery, setSearchQuery] = useState("");

  // Thought Dump state
  const [dumpText, setDumpText] = useState("");
  const [isDissolving, setIsDissolving] = useState(false);
  const [releasedCount, setReleasedCount] = useState(0);

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalContent.trim()) return;

    soundEngine.playChime(528, 2);
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#C4B5FD", "#FBCFE8", "#A7F3D0"],
      });
    } catch {}

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString(),
      prompt: selectedPrompt,
      content: journalContent.trim(),
      tags: [tagInput || "Reflection"],
    };

    onSaveEntry(newEntry);
    setJournalContent("");
  };

  const handleReleaseThought = () => {
    if (!dumpText.trim() || isDissolving) return;

    soundEngine.playChime(432, 3);
    setIsDissolving(true);

    try {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#E2D9F3", "#FCE7F3", "#CFFAFE"],
      });
    } catch {}

    setTimeout(() => {
      setDumpText("");
      setIsDissolving(false);
      setReleasedCount((c) => c + 1);
    }, 1400);
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center justify-center p-1.5 bg-white rounded-3xl border border-purple-100 shadow-xs max-w-xs mx-auto">
        <button
          id="reflection-mode-journal-btn"
          onClick={() => {
            soundEngine.playPop();
            setMode("journal");
          }}
          className={`flex-1 py-2 px-4 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mode === "journal"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-slate-600 hover:text-purple-700"
          }`}
        >
          <BookHeart className="w-3.5 h-3.5" />
          <span>Gratitude Journal</span>
        </button>

        <button
          id="reflection-mode-dump-btn"
          onClick={() => {
            soundEngine.playPop();
            setMode("dump");
          }}
          className={`flex-1 py-2 px-4 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mode === "dump"
              ? "bg-rose-500 text-white shadow-xs"
              : "text-slate-600 hover:text-rose-600"
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Thought Dump</span>
        </button>
      </div>

      {/* 1. GRATITUDE JOURNAL MODE */}
      {mode === "journal" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Editor form (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-purple-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold font-heading text-slate-800">
                  Gratitude & Reflection
                </h2>
                <p className="text-xs text-slate-500">
                  Capturing small anchors of light transforms your mental filter
                </p>
              </div>
              <PandaMascot mood="listening" size="sm" />
            </div>

            <form onSubmit={handleSaveJournal} className="space-y-4">
              {/* Prompt Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Reflective Prompt
                </label>
                <select
                  id="journal-prompt-select"
                  value={selectedPrompt}
                  onChange={(e) => setSelectedPrompt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FAF8F5] border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  {journalPrompts.map((p, idx) => (
                    <option key={idx} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Writing Area */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Your Thoughts
                </label>
                <textarea
                  id="journal-content-textarea"
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder="Write freely... what came to mind when reading that prompt? No filter needed."
                  rows={5}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all resize-none"
                  required
                />
              </div>

              {/* Tag / Category */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Tag (e.g. Micro-Joy, Family)"
                    className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-slate-200 text-xs text-slate-700 w-36 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  id="save-journal-entry-btn"
                  disabled={!journalContent.trim()}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Save to Sanctuary
                </button>
              </div>
            </form>
          </div>

          {/* Right: Previous entries list (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-purple-100 shadow-xs flex flex-col h-[520px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold font-heading text-slate-800">
                Previous Entries ({filteredEntries.length})
              </h3>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reflections & tags..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#FAF8F5] border border-slate-200 text-xs text-slate-700 outline-none"
              />
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {filteredEntries.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <BookHeart className="w-8 h-8 mx-auto text-purple-300" />
                  <p className="text-xs">No reflections found yet.</p>
                  <p className="text-[11px] text-slate-400">
                    Write your first gratitude entry on the left!
                  </p>
                </div>
              ) : (
                filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/80 hover:border-purple-200 transition-colors group relative"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                      <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-xs font-semibold text-purple-800 mb-1">
                      {entry.prompt}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {entry.content}
                    </p>

                    <div className="flex gap-1 mt-2">
                      {entry.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. THOUGHT DUMP MODE ("Brain Unclogger") */}
      {mode === "dump" && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-rose-100 shadow-xs text-center relative overflow-hidden">
          <div className="mb-4">
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold uppercase tracking-wide">
              Brain Unclogger
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-800 mt-2 mb-1">
              Thought Dump & Release
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Pour out raw anxieties, overthinking loops, or frustration without formatting or grammar. When ready, tap <strong>Release It</strong> to dissolve them.
            </p>
          </div>

          <div className="relative my-4">
            <AnimatePresence>
              {isDissolving ? (
                <motion.div
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 0, scale: 0.85, filter: "blur(8px)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                  className="h-48 rounded-3xl bg-gradient-to-br from-rose-50 to-purple-50 border border-purple-200 flex flex-col items-center justify-center p-6"
                >
                  <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
                  <p className="text-sm font-semibold text-purple-800 mt-2">
                    Dissolving your worries into open space...
                  </p>
                </motion.div>
              ) : (
                <textarea
                  id="thought-dump-textarea"
                  value={dumpText}
                  onChange={(e) => setDumpText(e.target.value)}
                  placeholder="Type anything weighing on you right now... (No one else will ever see this)"
                  rows={6}
                  className="w-full px-4 py-3.5 rounded-3xl bg-gradient-to-br from-rose-50/40 to-purple-50/30 border border-rose-200/80 text-xs sm:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none transition-all leading-relaxed shadow-inner"
                />
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="release-thought-dump-btn"
              onClick={handleReleaseThought}
              disabled={!dumpText.trim() || isDissolving}
              className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Wind className="w-4 h-4" />
              Release & Dissolve Worries
            </button>
          </div>

          {releasedCount > 0 && (
            <p className="text-xs text-purple-700 font-medium mt-4">
              ✨ You have dissolved {releasedCount} worry sessions today. Honor that lightness.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
