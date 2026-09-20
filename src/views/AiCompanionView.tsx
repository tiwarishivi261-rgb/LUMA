import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RefreshCw,
  Wind,
  BrainCircuit,
  Compass,
  HeartHandshake,
  Stethoscope,
  ShieldAlert,
} from "lucide-react";
import { ChatMessage, MoodCheckIn, UserProfile } from "../types";
import { PandaMascot } from "../components/PandaMascot";
import { soundEngine } from "../utils/audio";

interface AiCompanionViewProps {
  user: UserProfile;
  currentMood?: MoodCheckIn;
  onNavigateAction: (view: any, extraKey?: string) => void;
  onOpenCrisis: () => void;
  onOpenProfessionalSupport?: () => void;
}

const suggestedStarters = [
  "I'm feeling a bit anxious about what's ahead...",
  "Can you help me unpack why I feel so drained today?",
  "I had a small win today and wanted to celebrate!",
  "My brain is stuck in an overthinking loop.",
  "What is a gentle way to say no to someone tonight?",
];

export const AiCompanionView: React.FC<AiCompanionViewProps> = ({
  user,
  currentMood,
  onNavigateAction,
  onOpenCrisis,
  onOpenProfessionalSupport,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      role: "assistant",
      content: `Hello ${user.name} 🌸 I'm right here beside you. Whether you need to vent without judgment, sort out a messy thought, or simply sit with quiet presence, this is your safe, unhurried space. How is your heart doing today?`,
      timestamp: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    soundEngine.playPop();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userContext: {
            name: user.name,
            currentMood: currentMood
              ? {
                  mood: currentMood.mood,
                  intensity: currentMood.intensity,
                  reasons: currentMood.reasons,
                  note: currentMood.note,
                }
              : undefined,
            recentActivities: ["Checked in with LUMA"],
            streak: user.streak,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed response from companion API");
      }

      const data = await response.json();
      soundEngine.playChime(480, 1.2);

      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I am right here with you. Take a soft breath.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedAction: data.suggestedAction,
        suggestProfessionalSupport: data.suggestProfessionalSupport,
        isSafetyConcern: data.isSafetyConcern,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const inputLower = (textToSend || text || "").toLowerCase();
      let tailoredFallback = `I'm holding gentle space for you, ${user.name}. It sounds like there is a lot moving through your mind right now. Take a soft breath with me. You don't have to carry the whole mountain all at once. What feels like the kindest thing you can do for yourself in this next hour?`;
      
      if (inputLower.includes("anxious") || inputLower.includes("stress") || inputLower.includes("overwhelm") || inputLower.includes("panic")) {
        tailoredFallback = `I can feel how heavy that anxiety or tension is, ${user.name}. Let's take a slow pause right now. Inhale softly through your nose for 4 counts, hold gently, and exhale long. Would you like to practice our calming 4-7-8 breathing together?`;
      } else if (inputLower.includes("sad") || inputLower.includes("cry") || inputLower.includes("lonely") || inputLower.includes("tired")) {
        tailoredFallback = `I am right beside you, ${user.name}. It is completely human and natural to feel tired or tender. You don't have to put on a brave face here with me. What is feeling heaviest right now?`;
      } else if (inputLower.includes("thank") || inputLower.includes("good") || inputLower.includes("better") || inputLower.includes("happy")) {
        tailoredFallback = `That brings so much warmth to my heart, ${user.name}! Celebrating and holding space for moments of peace or relief is such a powerful part of your rhythm. What made the difference for you?`;
      }

      const fallbackMsg: ChatMessage = {
        id: `msg-ai-fallback-${Date.now()}`,
        role: "assistant",
        content: tailoredFallback,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeak = (id: string, text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (isSpeakingId === id) {
        setIsSpeakingId(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsSpeakingId(null);
      utterance.onerror = () => setIsSpeakingId(null);
      setIsSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMicToggle = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-140px)] min-h-[580px] flex flex-col">
      {/* Top Companion Header Bar */}
      <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-xs mb-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200/70 flex items-center justify-center">
            <PandaMascot mood={isLoading ? "thinking" : "listening"} size="sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-heading text-slate-800">
                LUMA Companion
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                Contextual & Gentle
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {currentMood ? (
                <span>
                  Aware of your <strong className="capitalize text-purple-700">{currentMood.mood}</strong> check-in ({currentMood.intensity}/10)
                </span>
              ) : (
                "Listening without judgment • Non-clinical friend"
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenProfessionalSupport && (
            <button
              id="companion-prof-support-btn"
              onClick={onOpenProfessionalSupport}
              className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-200 hover:bg-purple-100 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Nearby Doctors & Clinics"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Find Support (Jaipur)</span>
            </button>
          )}

          <button
            id="companion-crisis-support-btn"
            onClick={onOpenCrisis}
            className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200 hover:bg-rose-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Crisis Helplines"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Support Resources</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-white/70 rounded-3xl border border-purple-100/80 p-4 sm:p-6 overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center text-sm shadow-xs ${
                  isUser
                    ? "bg-purple-600 text-white"
                    : "bg-purple-100 text-purple-900 border border-purple-200"
                }`}
              >
                {isUser ? user.avatar || "👤" : "🐼"}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 shadow-xs relative text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-xs"
                    : "bg-white border border-purple-100/90 text-slate-800 rounded-tl-xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Optional suggested action button */}
                {msg.suggestedAction && (
                  <div className="mt-3 pt-2.5 border-t border-purple-100">
                    <button
                      onClick={() =>
                        onNavigateAction(msg.suggestedAction?.type, msg.suggestedAction?.actionKey)
                      }
                      className="px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-medium border border-purple-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Wind className="w-3.5 h-3.5 text-purple-600" />
                      {msg.suggestedAction.label}
                    </button>
                  </div>
                )}

                {/* Professional Support Prompt (Google Maps integration trigger) */}
                {msg.suggestProfessionalSupport && (
                  <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                      <Stethoscope className="w-4 h-4 text-purple-600" />
                      <span>Find Professional Support Near You</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      LUMA is here to listen, but speaking with an accredited local therapist, counselor or clinic in Jaipur can be deeply comforting.
                    </p>
                    <button
                      onClick={() => onOpenProfessionalSupport?.()}
                      className="w-full py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>View Nearby Clinics & Therapists (Jaipur)</span>
                    </button>
                  </div>
                )}

                {/* Safety Concern / Crisis Callout */}
                {msg.isSafetyConcern && (
                  <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Compassionate 24/7 Lifelines Available</span>
                    </div>
                    <p className="text-[11px] text-rose-700 leading-relaxed">
                      You matter deeply, and you do not have to carry this alone. Free, confidential support is available right now.
                    </p>
                    <button
                      onClick={onOpenCrisis}
                      className="w-full py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Open Crisis Helplines & Resources</span>
                    </button>
                  </div>
                )}

                {/* Message footer with timestamp and audio listen */}
                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    isUser ? "text-purple-200" : "text-slate-400"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => toggleSpeak(msg.id, msg.content)}
                      className="hover:text-purple-600 transition-colors p-1"
                      title={isSpeakingId === msg.id ? "Stop voice" : "Listen to LUMA"}
                    >
                      {isSpeakingId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-purple-600" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-900 border border-purple-200 flex items-center justify-center text-sm">
              🐼
            </div>
            <div className="bg-white border border-purple-100 rounded-2xl px-4 py-3 shadow-xs flex items-center gap-2">
              <span className="text-xs text-purple-700 font-medium">
                Bao is reflecting with care
              </span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts chips */}
      <div className="py-2 overflow-x-auto scrollbar-none flex gap-1.5 shrink-0">
        {suggestedStarters.map((starter, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(starter)}
            disabled={isLoading}
            className="px-3 py-1 rounded-full bg-white border border-purple-200/70 text-slate-600 hover:text-purple-700 hover:border-purple-300 text-[11px] whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
          >
            {starter}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-1 p-2 bg-white rounded-3xl border border-purple-200/80 shadow-md flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          id="companion-mic-btn"
          onClick={handleMicToggle}
          className={`p-2 rounded-full transition-colors ${
            isListening
              ? "bg-rose-100 text-rose-600 animate-pulse"
              : "text-slate-400 hover:text-purple-600 hover:bg-purple-50"
          }`}
          title="Voice input"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          id="companion-chat-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Talk with LUMA... (e.g. "I'm feeling overwhelmed today")`}
          disabled={isLoading}
          className="flex-1 text-xs sm:text-sm bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 px-2"
        />

        <button
          type="submit"
          id="companion-send-btn"
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:hover:bg-purple-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
