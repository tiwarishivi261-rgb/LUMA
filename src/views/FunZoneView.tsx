import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Gamepad2,
  Headphones,
  Film,
  Laugh,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Music,
  Heart,
  Volume2,
  RefreshCw,
  Trophy,
} from "lucide-react";
import confetti from "canvas-confetti";
import { PandaMascot } from "../components/PandaMascot";
import { soundEngine } from "../utils/audio";
import { musicVibes, watchRecommendations, jokeCollection } from "../data/mockData";

type FunZoneTab = "play" | "listen" | "watch" | "laugh";

export const FunZoneView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FunZoneTab>("play");

  // ==================== 1. PLAY: TIC-TAC-TOE ====================
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<string | null>(null); // "player", "ai", "tie", null
  const [scores, setScores] = useState({ player: 0, ai: 0, ties: 0 });

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],             // diagonals
  ];

  const checkWinner = (currentBoard: Array<string | null>) => {
    for (const [a, b, c] of winningCombos) {
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }
    if (currentBoard.every((cell) => cell !== null)) {
      return "tie";
    }
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    soundEngine.playPop();
    const newBoard = [...board];
    newBoard[index] = "🌸"; // Player symbol
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      handleGameOver(gameResult);
    } else {
      setIsPlayerTurn(false);
    }
  };

  // AI Move effect
  useEffect(() => {
    if (isPlayerTurn || winner) return;

    const timer = setTimeout(() => {
      makeAiMove();
    }, 450);

    return () => clearTimeout(timer);
  }, [isPlayerTurn, winner, board, difficulty]);

  const makeAiMove = () => {
    const emptyIndices = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val): val is number => val !== null);

    if (emptyIndices.length === 0) return;

    let move: number = emptyIndices[0];

    if (difficulty === "easy") {
      // Pure random
      move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    } else if (difficulty === "medium") {
      // 50% strategic, 50% random
      const winMove = findWinningMove(board, "🐼");
      const blockMove = findWinningMove(board, "🌸");
      if (Math.random() > 0.4 && (winMove !== null || blockMove !== null)) {
        move = winMove !== null ? winMove : blockMove!;
      } else {
        move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }
    } else {
      // Hard: Always try to win, block, or take center
      const winMove = findWinningMove(board, "🐼");
      const blockMove = findWinningMove(board, "🌸");
      if (winMove !== null) {
        move = winMove;
      } else if (blockMove !== null) {
        move = blockMove;
      } else if (board[4] === null) {
        move = 4; // Center
      } else {
        move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      }
    }

    soundEngine.playPop();
    const newBoard = [...board];
    newBoard[move] = "🐼";
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      handleGameOver(gameResult);
    } else {
      setIsPlayerTurn(true);
    }
  };

  const findWinningMove = (b: Array<string | null>, symbol: string): number | null => {
    for (const [x, y, z] of winningCombos) {
      const line = [b[x], b[y], b[z]];
      const symbolCount = line.filter((c) => c === symbol).length;
      const nullCount = line.filter((c) => c === null).length;
      if (symbolCount === 2 && nullCount === 1) {
        if (b[x] === null) return x;
        if (b[y] === null) return y;
        if (b[z] === null) return z;
      }
    }
    return null;
  };

  const handleGameOver = (result: string) => {
    if (result === "🌸") {
      setWinner("player");
      setScores((s) => ({ ...s, player: s.player + 1 }));
      soundEngine.playChime(528, 2.5);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#F472B6", "#A78BFA", "#FDE047"],
        });
      } catch {}
    } else if (result === "🐼") {
      setWinner("ai");
      setScores((s) => ({ ...s, ai: s.ai + 1 }));
      soundEngine.playChime(350, 1.5);
    } else {
      setWinner("tie");
      setScores((s) => ({ ...s, ties: s.ties + 1 }));
    }
  };

  const resetGame = () => {
    soundEngine.playPop();
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  // ==================== 2. LISTEN: MUSIC VIBES ====================
  const [selectedVibe, setSelectedVibe] = useState<string>("Lo-fi");
  const currentVibeData = musicVibes.find((v) => v.vibe === selectedVibe) || musicVibes[0];

  // ==================== 3. WATCH: MOVIE / SHOW GENRES (MOOD-FIRST) ====================
  const [watchMood, setWatchMood] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>("Comedy");

  // Mood to suggested genre mapping
  const watchMoodOptions: Array<{
    id: string;
    label: string;
    emoji: string;
    description: string;
    recommendedGenre: string;
  }> = [
    {
      id: "stressed",
      label: "Stressed / Overthinking",
      emoji: "💆",
      description: "Need pure escapism, zero mental strain, or wholesome laughs",
      recommendedGenre: "Comedy",
    },
    {
      id: "gloomy",
      label: "Sad / Needing Comfort",
      emoji: "🌧️",
      description: "Want a warm hug, gentle reassurance, or healing tears",
      recommendedGenre: "Animation",
    },
    {
      id: "lonely",
      label: "Tender / Romantic",
      emoji: "💖",
      description: "Seeking connection, heartfelt conversations, and sweetness",
      recommendedGenre: "Romance",
    },
    {
      id: "bored",
      label: "Restless / Low Energy",
      emoji: "⚡",
      description: "Need exciting momentum, inspiration, or dynamic thrills",
      recommendedGenre: "Action",
    },
    {
      id: "curious",
      label: "Intrigued / Mystery-Seeker",
      emoji: "🔍",
      description: "Want a gripping, clever puzzle to completely take over focus",
      recommendedGenre: "Thriller",
    },
    {
      id: "spooky",
      label: "Chilly / Atmospheric",
      emoji: "🕯️",
      description: "Craving safe goosebumps, shadows, and mysterious suspense",
      recommendedGenre: "Horror",
    },
    {
      id: "reflective",
      label: "Thoughtful / Deep",
      emoji: "🍂",
      description: "Appreciating richly woven human stories and nuanced relationships",
      recommendedGenre: "Drama",
    },
  ];

  const handleSelectWatchMood = (m: typeof watchMoodOptions[0]) => {
    soundEngine.playPop();
    setWatchMood(m.id);
    setSelectedGenre(m.recommendedGenre);
  };

  const currentGenreData =
    watchRecommendations.find((g) => g.genre === selectedGenre) || watchRecommendations[0];

  // ==================== 4. LAUGH: JOKES & PANDA REACTIONS ====================
  const [jokeCategory, setJokeCategory] = useState<string>("Wholesome");
  const filteredJokes = jokeCollection.filter((j) => j.category === jokeCategory);
  const [currentJokeIndex, setCurrentJokeIndex] = useState<number>(0);
  const [showPunchline, setShowPunchline] = useState<boolean>(false);

  const currentJoke = filteredJokes[currentJokeIndex] || jokeCollection[0];

  const handleNextJoke = () => {
    soundEngine.playPop();
    setShowPunchline(false);
    setCurrentJokeIndex((idx) => (idx + 1) % filteredJokes.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & Sub-Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Gentle Joy Sanctuary</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-800 mt-1">
            Fun Zone
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Four playful corners to decompress, laugh, discover and reset
          </p>
        </div>

        {/* 4 Sections Selector */}
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-3xl border border-purple-100 shadow-xs overflow-x-auto scrollbar-none">
          {[
            { id: "play", label: "Play", icon: Gamepad2 },
            { id: "listen", label: "Listen", icon: Headphones },
            { id: "watch", label: "Watch", icon: Film },
            { id: "laugh", label: "Laugh", icon: Laugh },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                id={`funzone-tab-${t.id}`}
                onClick={() => {
                  soundEngine.playPop();
                  setActiveTab(t.id as FunZoneTab);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-purple-700 hover:bg-purple-50/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          1. PLAY: TIC-TAC-TOE AGAINST AI PANDA
          ======================================================== */}
      {activeTab === "play" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs">
          <div className="max-w-xl mx-auto text-center">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold font-heading text-slate-800">
                  Tic-Tac-Toe with Bao
                </h3>
                <p className="text-xs text-slate-500">
                  You are 🌸 Flower • Bao is 🐼 Panda
                </p>
              </div>

              {/* Difficulty selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                {(["easy", "medium", "hard"] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      soundEngine.playPop();
                      setDifficulty(diff);
                      resetGame();
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer ${
                      difficulty === diff
                        ? "bg-white text-purple-700 shadow-2xs font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Score tracker */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-[#FAF8F5] border border-purple-100 mb-6 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">You (🌸)</span>
                <span className="font-bold text-purple-700 text-base">{scores.player}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Ties</span>
                <span className="font-bold text-slate-600 text-base">{scores.ties}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Bao (🐼)</span>
                <span className="font-bold text-indigo-700 text-base">{scores.ai}</span>
              </div>
            </div>

            {/* Mascot reaction based on game state */}
            <div className="flex justify-center mb-4">
              <PandaMascot
                mood={
                  winner === "player"
                    ? "cheering"
                    : winner === "ai"
                    ? "laughing"
                    : !isPlayerTurn
                    ? "thinking"
                    : "listening"
                }
                size="md"
              />
            </div>

            {/* 3x3 Game Board */}
            <div className="grid grid-cols-3 gap-3 w-72 h-72 mx-auto mb-6">
              {board.map((cell, idx) => (
                <button
                  key={idx}
                  id={`tictactoe-cell-${idx}`}
                  onClick={() => handleCellClick(idx)}
                  disabled={Boolean(cell) || Boolean(winner) || !isPlayerTurn}
                  className={`rounded-2xl text-3xl font-extrabold flex items-center justify-center transition-all shadow-xs border cursor-pointer select-none ${
                    cell
                      ? "bg-purple-50/70 border-purple-200"
                      : "bg-[#FAF8F5] hover:bg-purple-100/50 border-slate-200"
                  }`}
                >
                  {cell && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 20 }}
                    >
                      {cell}
                    </motion.span>
                  )}
                </button>
              ))}
            </div>

            {/* Status / Game Result Banner */}
            {winner && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100 text-purple-900 font-bold text-sm mb-4 border border-purple-200 shadow-xs"
              >
                {winner === "player" && "🎉 Lovely game! You won with gentle poise!"}
                {winner === "ai" && "🐼 Bao wins this round! A friendly rematch?"}
                {winner === "tie" && "🤝 A balanced tie! Mindful harmony achieved."}
              </motion.div>
            )}

            <button
              id="tictactoe-rematch-btn"
              onClick={resetGame}
              className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs sm:text-sm inline-flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              {winner ? "Play Again" : "Reset Board"}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          2. LISTEN: MUSIC RECOMMENDATIONS BY VIBE
          ======================================================== */}
      {activeTab === "listen" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold font-heading text-slate-800">
                Music Soundscapes & Recommendations
              </h3>
              <p className="text-xs text-slate-500">
                Sonic mood elevators curated for calm, joy, or gentle nostalgia
              </p>
            </div>
          </div>

          {/* Vibes horizontal pill row */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {musicVibes.map((v) => {
              const active = selectedVibe === v.vibe;
              return (
                <button
                  key={v.vibe}
                  onClick={() => {
                    soundEngine.playPop();
                    setSelectedVibe(v.vibe);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-[#FAF8F5] border border-slate-200 text-slate-600 hover:border-purple-300"
                  }`}
                >
                  <span>{v.emoji}</span>
                  <span>{v.vibe}</span>
                </button>
              );
            })}
          </div>

          {/* Vibe Description Header */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
            <div className="text-xs text-purple-900">
              <strong className="capitalize">{currentVibeData.vibe} Atmosphere:</strong>{" "}
              {currentVibeData.description}
            </div>
            <Music className="w-5 h-5 text-purple-500 shrink-0 ml-3" />
          </div>

          {/* Tracks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(currentVibeData.tracks || []).map((track, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80 hover:border-purple-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span className="font-medium text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded-full">
                      {track.tag}
                    </span>
                    <span>{track.duration}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                    {track.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mb-2">
                    {track.artist}
                  </p>

                  <p className="text-[11px] text-slate-600 italic bg-white/70 p-2.5 rounded-xl border border-slate-100">
                    "{track.whyGood}"
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => soundEngine.playChime(480 + idx * 40, 1.5)}
                    className="text-[11px] text-purple-700 hover:text-purple-900 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Sample Chime
                  </button>

                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      `${track.title} ${track.artist}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-purple-600 hover:border-purple-300 transition-colors"
                    title="Search and listen online"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          3. WATCH: MOVIE / SHOW SUGGESTIONS (MOOD FIRST)
          ======================================================== */}
      {activeTab === "watch" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold font-heading text-slate-800">
                Comfort Watch & Movie Suggestions
              </h3>
              <p className="text-xs text-slate-500">
                Cinema thoughtfully matched to your immediate emotional state
              </p>
            </div>

            {watchMood && (
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setWatchMood(null);
                }}
                className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <span>Change Your Mood</span>
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* If mood is not selected yet, ask mood FIRST */}
          {!watchMood ? (
            <div className="space-y-4 py-4">
              <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border border-purple-100/80 flex items-center gap-4">
                <PandaMascot mood="listening" size="sm" />
                <div>
                  <h4 className="text-base font-bold text-slate-800">
                    How are you feeling right now?
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Before picking a movie, tell Bao your vibe so we can recommend the perfect comfort watch.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {watchMoodOptions.map((opt) => (
                  <button
                    key={opt.id}
                    id={`watch-mood-btn-${opt.id}`}
                    onClick={() => handleSelectWatchMood(opt)}
                    className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/90 hover:border-purple-300 hover:bg-white hover:shadow-xs transition-all text-left flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <span className="text-2xl mb-1.5 block group-hover:scale-110 transition-transform">
                        {opt.emoji}
                      </span>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-purple-700">
                        {opt.label}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {opt.description}
                      </div>
                    </div>
                    <div className="mt-3 text-[10px] font-semibold text-purple-700 flex items-center justify-between border-t border-slate-200/70 pt-2">
                      <span>Curates: {opt.recommendedGenre}</span>
                      <span>→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Mood Pill Banner */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">
                    {watchMoodOptions.find((o) => o.id === watchMood)?.emoji || "🎬"}
                  </span>
                  <div>
                    <span className="text-xs text-purple-800 font-semibold">
                      Curating for:{" "}
                      <strong>
                        {watchMoodOptions.find((o) => o.id === watchMood)?.label || "Your Mood"}
                      </strong>
                    </span>
                    <p className="text-[11px] text-purple-600">
                      Genre highlighted: <strong>{selectedGenre}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      setWatchMood(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-purple-800 hover:bg-purple-100 text-xs font-semibold cursor-pointer"
                  >
                    Pick Different Mood
                  </button>
                </div>
              </div>

              {/* Genre selector tabs */}
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                {watchRecommendations.map((g) => {
                  const active = selectedGenre === g.genre;
                  return (
                    <button
                      key={g.genre}
                      id={`watch-genre-${g.genre.toLowerCase()}`}
                      onClick={() => {
                        soundEngine.playPop();
                        setSelectedGenre(g.genre);
                      }}
                      className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        active
                          ? "bg-purple-600 text-white shadow-xs"
                          : "bg-[#FAF8F5] border border-slate-200 text-slate-600 hover:border-purple-300"
                      }`}
                    >
                      {g.genre}
                    </button>
                  );
                })}
              </div>

              {/* Shows Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentGenreData.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#FAF8F5] border border-slate-200/80 hover:border-purple-300 hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                          {item.platform}
                        </span>
                        <span className="text-slate-400">{item.year}</span>
                      </div>

                      <h4 className="text-base font-bold font-heading text-slate-800 mb-1">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {item.synopsis}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 text-[11px] space-y-1">
                      <div className="text-purple-800 font-medium">
                        ✨ <strong>Why it helps:</strong> {item.whyWatch}
                      </div>
                      <div className="text-amber-600 font-medium">
                        ☕ <strong>Comfort Rating:</strong> {item.comfortRating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          4. LAUGH: JOKES WITH PLAYFUL PANDA REACTIONS
          ======================================================== */}
      {activeTab === "laugh" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-purple-100 shadow-xs">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <div>
              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-semibold uppercase tracking-wide">
                Dopamine & Giggles
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-800 mt-2 mb-1">
                Lighthearted Chuckles with Bao
              </h3>
              <p className="text-xs text-slate-500">
                Laughter reduces cortisol and relaxes physical tension
              </p>
            </div>

            {/* Category pills */}
            <div className="flex justify-center gap-1.5 flex-wrap">
              {["Wholesome", "Puns", "Animal", "Work & Study", "Everyday"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    soundEngine.playPop();
                    setJokeCategory(cat);
                    setCurrentJokeIndex(0);
                    setShowPunchline(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    jokeCategory === cat
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-[#FAF8F5] border border-slate-200 text-slate-600 hover:border-purple-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mascot reaction */}
            <div className="flex justify-center">
              <PandaMascot
                mood={showPunchline ? "laughing" : "thinking"}
                size="lg"
              />
            </div>

            {/* Joke Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-pink-50/60 via-purple-50/40 to-amber-50/40 border border-purple-200/70 shadow-xs text-center space-y-4">
              <div className="text-base sm:text-lg font-bold font-heading text-slate-800 leading-snug">
                "{currentJoke.setup}"
              </div>

              <AnimatePresence>
                {showPunchline ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-white shadow-xs border border-purple-100 text-purple-900 font-bold text-base sm:text-lg"
                  >
                    🎉 {currentJoke.punchline}
                    <div className="text-xs font-normal text-slate-500 mt-2 italic">
                      {currentJoke.pandaReaction}
                    </div>
                  </motion.div>
                ) : (
                  <button
                    id="reveal-punchline-btn"
                    onClick={() => {
                      soundEngine.playPop();
                      soundEngine.playChime(528, 1.5);
                      setShowPunchline(true);
                      try {
                        confetti({
                          particleCount: 25,
                          spread: 50,
                          origin: { y: 0.65 },
                        });
                      } catch {}
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs inline-flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Reveal Punchline
                  </button>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-3">
              <button
                id="next-joke-btn"
                onClick={handleNextJoke}
                className="px-6 py-2.5 rounded-2xl bg-[#FAF8F5] border border-slate-200 hover:border-purple-300 text-slate-700 font-medium text-xs inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Next Joke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
