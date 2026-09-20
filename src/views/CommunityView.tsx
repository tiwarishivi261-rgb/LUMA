import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Users,
  Heart,
  MessageCircle,
  Plus,
  Sparkles,
  ShieldCheck,
  Send,
  Filter,
} from "lucide-react";
import confetti from "canvas-confetti";
import { CommunityPost, UserProfile } from "../types";
import { soundEngine } from "../utils/audio";
import { PandaMascot } from "../components/PandaMascot";

interface CommunityViewProps {
  user: UserProfile;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ user }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string>("All");
  const [showPostModal, setShowPostModal] = useState(false);

  // New post form
  const [newContent, setNewContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("Gentle Reminder");

  const tags = ["All", "Gentle Reminder", "Small Win", "Gratitude", "Support", "Mindful Pause"];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/community");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch community feed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleWarmthReaction = async (id: string) => {
    soundEngine.playPop();
    soundEngine.playChime(528, 1);

    try {
      const res = await fetch(`/api/community/${id}/react`, {
        method: "POST",
      });
      if (res.ok) {
        const updated = await res.json();
        setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      }
    } catch (err) {
      // Optimistic update fallback
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, reactions: (p.reactions ?? 0) + 1 } : p))
      );
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    soundEngine.playChime(528, 2);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#C4B5FD", "#FBCFE8"],
      });
    } catch {}

    const payload = {
      content: newContent.trim(),
      tag: selectedTag,
      authorAlias: user.preferences.anonymousMode
        ? `A ${user.avatar === "🐼" ? "Mindful Panda" : "Gentle Friend"}`
        : user.name,
      avatar: user.avatar,
    };

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        setPosts((prev) => [created, ...prev]);
        setNewContent("");
        setShowPostModal(false);
      }
    } catch (err) {
      console.error("Failed to post", err);
    }
  };

  const filteredPosts =
    activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/60 border border-purple-200/70 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>Anonymous Circle</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-800">
            Gentle Shared Reflections
          </h1>
          <p className="text-xs text-slate-500 max-w-md">
            Leave small stones of encouragement for others. No profiles, no pressure, purely warmth.
          </p>
        </div>

        <button
          id="community-share-thought-btn"
          onClick={() => {
            soundEngine.playPop();
            setShowPostModal(true);
          }}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Share Encouragement
        </button>
      </div>

      {/* Tag Filters */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => {
              soundEngine.playPop();
              setActiveTag(t);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              activeTag === t
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:border-purple-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="text-center py-12 text-slate-400">
            <PandaMascot mood="thinking" size="md" className="mx-auto mb-2" />
            <p className="text-xs font-medium">Gathering quiet reflections...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-white rounded-3xl border border-slate-200">
            <p className="text-xs">No posts under this category yet.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-purple-200/80 shadow-xs transition-all"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{post.avatar || "🐼"}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-700">
                      {post.authorAlias}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-2">
                      {post.timestamp}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                  {post.tag}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3 whitespace-pre-wrap">
                "{post.content}"
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  id={`community-warmth-btn-${post.id}`}
                  onClick={() => handleWarmthReaction(post.id)}
                  className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>Send Warmth</span>
                  <span className="font-bold ml-0.5">({post.reactions})</span>
                </button>

                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Anonymous & Kind</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Share Encouragement Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FFFDF9] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{user.avatar}</span>
                <h3 className="text-lg font-bold font-heading text-slate-800">
                  Share Anonymously
                </h3>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Category
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 outline-none"
                >
                  {tags
                    .filter((t) => t !== "All")
                    .map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Your Supportive Note
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share a gentle reminder, a win from today, or warm words for anyone feeling tired..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Posting as: <strong>{user.preferences.anonymousMode ? "A Gentle Friend" : user.name}</strong>
                </span>

                <button
                  type="submit"
                  disabled={!newContent.trim()}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Post to Circle
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
