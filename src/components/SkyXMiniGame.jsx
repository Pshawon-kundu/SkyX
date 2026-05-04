import { AnimatePresence, motion as Motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Coins,
  Gamepad2,
  MousePointerClick,
  Play,
  RotateCcw,
  Target,
  Timer,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import {
  OPEN_SKYX_GAME_EVENT,
  readGameRewards,
  saveGameReward,
} from "../utils/gameRewards";

const GAME_DURATION = 20;
const TILE_COUNT = 9;
const HIT_POINTS = 12;
const STREAK_BONUS = 8;
const MISS_PENALTY = 3;

function getNextTarget(current, hits, misses) {
  const next = (current + 4 + (hits % 3) * 2 + misses) % TILE_COUNT;
  return next === current ? (next + 1) % TILE_COUNT : next;
}

function getTileLabel(index) {
  return `S${index + 1}`;
}

export default function SkyXMiniGame({ theme = "dark" }) {
  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("ready");
  const [secondsLeft, setSecondsLeft] = useState(GAME_DURATION);
  const [activeTile, setActiveTile] = useState(4);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [earned, setEarned] = useState(0);
  const [rewards, setRewards] = useState(() => readGameRewards());

  const accuracy = useMemo(() => {
    const attempts = hits + misses;
    if (!attempts) return 100;
    return Math.round((hits / attempts) * 100);
  }, [hits, misses]);

  useEffect(() => {
    const handleOpenGame = () => {
      setRewards(readGameRewards());
      setIsOpen(true);
      setStatus("ready");
      setSecondsLeft(GAME_DURATION);
      setActiveTile(4);
      setScore(0);
      setHits(0);
      setMisses(0);
      setEarned(0);
    };

    window.addEventListener(OPEN_SKYX_GAME_EVENT, handleOpenGame);
    return () =>
      window.removeEventListener(OPEN_SKYX_GAME_EVENT, handleOpenGame);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (status !== "running") return undefined;

    const timer = window.setTimeout(() => {
      if (secondsLeft <= 1) {
        const finalEarned = Math.max(0, score);
        setSecondsLeft(0);
        setEarned(finalEarned);
        setRewards(saveGameReward({ earnedPoints: finalEarned, score }));
        setStatus("finished");
        return;
      }

      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [score, secondsLeft, status]);

  const startGame = () => {
    setStatus("running");
    setSecondsLeft(GAME_DURATION);
    setActiveTile(4);
    setScore(0);
    setHits(0);
    setMisses(0);
    setEarned(0);
  };

  const handleTileClick = (index) => {
    if (status !== "running") return;

    if (index === activeTile) {
      const nextHits = hits + 1;
      const bonus = nextHits % 5 === 0 ? STREAK_BONUS : 0;
      setHits(nextHits);
      setScore((current) => current + HIT_POINTS + bonus);
      setActiveTile(getNextTarget(activeTile, nextHits, misses));
      return;
    }

    setMisses((current) => current + 1);
    setScore((current) => Math.max(0, current - MISS_PENALTY));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="skyx-mini-game-title"
        >
          <Motion.div
            className={`relative w-full max-w-3xl overflow-hidden rounded-lg border shadow-2xl ${
              isDark
                ? "border-cyan-300/25 bg-slate-950 text-white shadow-cyan-950/60"
                : "border-slate-200 bg-white text-slate-950 shadow-slate-300/60"
            }`}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            <div
              className={`flex items-start justify-between gap-4 border-b p-5 ${
                isDark
                  ? "border-slate-800 bg-slate-900/70"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-lg border ${
                    isDark
                      ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-200"
                      : "border-cyan-700/20 bg-cyan-50 text-cyan-700"
                  }`}
                >
                  <Gamepad2 className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p
                    className={`text-xs font-bold uppercase tracking-normal ${
                      isDark ? "text-cyan-200" : "text-cyan-700"
                    }`}
                  >
                    Play and earn
                  </p>
                  <h2
                    id="skyx-mini-game-title"
                    className="text-xl font-bold tracking-normal"
                  >
                    Signal Sprint
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                  isDark
                    ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                    : "border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
                aria-label="Close game"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div className="p-5 sm:p-6">
                <div className="mb-5 grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Time",
                      value: `${secondsLeft}s`,
                      icon: <Timer className="h-4 w-4" aria-hidden="true" />,
                    },
                    {
                      label: "Score",
                      value: score,
                      icon: <Target className="h-4 w-4" aria-hidden="true" />,
                    },
                    {
                      label: "Accuracy",
                      value: `${accuracy}%`,
                      icon: (
                        <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                      ),
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className={`rounded-lg border p-3 ${
                        isDark
                          ? "border-slate-800 bg-slate-900/65"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div
                        className={`mb-2 flex items-center gap-2 text-xs font-semibold ${
                          isDark ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {stat.icon}
                        {stat.label}
                      </div>
                      <div className="text-xl font-bold">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="grid aspect-square max-h-[420px] grid-cols-3 gap-3">
                  {Array.from({ length: TILE_COUNT }, (_, index) => {
                    const isActive = status === "running" && index === activeTile;
                    return (
                      <button
                        key={getTileLabel(index)}
                        type="button"
                        onClick={() => handleTileClick(index)}
                        disabled={status !== "running"}
                        className={`relative rounded-lg border text-sm font-bold transition ${
                          isActive
                            ? isDark
                              ? "border-cyan-200 bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-400/25"
                              : "border-cyan-700 bg-cyan-600 text-[#ffffff] shadow-lg shadow-cyan-300/60"
                            : isDark
                              ? "border-slate-800 bg-slate-900 text-slate-500 hover:border-slate-700"
                              : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
                        } ${status !== "running" ? "cursor-default" : "cursor-pointer"}`}
                        aria-label={
                          isActive
                            ? `Active signal ${getTileLabel(index)}`
                            : `Signal ${getTileLabel(index)}`
                        }
                      >
                        {isActive ? (
                          <Zap className="mx-auto h-7 w-7" aria-hidden="true" />
                        ) : (
                          getTileLabel(index)
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <aside
                className={`border-t p-5 lg:border-l lg:border-t-0 ${
                  isDark
                    ? "border-slate-800 bg-slate-900/55"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                {status === "ready" && (
                  <div className="flex h-full flex-col justify-between gap-6">
                    <div>
                      <div
                        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg border ${
                          isDark
                            ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-300"
                            : "border-emerald-700/20 bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        <MousePointerClick
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="text-lg font-bold">How to play</h3>
                      <p
                        className={`mt-2 text-sm leading-6 ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        Tap the lit signal tile as many times as you can before
                        the timer ends. Correct taps earn points. Wrong taps
                        subtract a small penalty.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={startGame}
                      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold ${
                        isDark
                          ? "bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                          : "bg-[#020617] text-[#ffffff] hover:bg-[#111827]"
                      }`}
                    >
                      <Play className="h-4 w-4" aria-hidden="true" />
                      Start Game
                    </button>
                  </div>
                )}

                {status === "running" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-bold">Keep tapping</h3>
                      <p
                        className={`mt-2 text-sm leading-6 ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        Every fifth hit adds a streak bonus. Your final score is
                        saved as game points.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`rounded-lg border p-3 ${
                          isDark
                            ? "border-slate-800 bg-slate-950/45"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <p className="text-xs text-slate-500">Hits</p>
                        <p className="text-2xl font-bold">{hits}</p>
                      </div>
                      <div
                        className={`rounded-lg border p-3 ${
                          isDark
                            ? "border-slate-800 bg-slate-950/45"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <p className="text-xs text-slate-500">Misses</p>
                        <p className="text-2xl font-bold">{misses}</p>
                      </div>
                    </div>
                  </div>
                )}

                {status === "finished" && (
                  <div className="flex h-full flex-col justify-between gap-6">
                    <div>
                      <div
                        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg border ${
                          isDark
                            ? "border-amber-300/30 bg-amber-400/10 text-amber-300"
                            : "border-amber-700/20 bg-amber-50 text-amber-700"
                        }`}
                      >
                        <Trophy className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-bold">Reward saved</h3>
                      <p
                        className={`mt-2 text-sm leading-6 ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        You earned{" "}
                        <span className="font-bold text-emerald-500">
                          {earned} points
                        </span>{" "}
                        from this run.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div
                        className={`rounded-lg border p-4 ${
                          isDark
                            ? "border-slate-800 bg-slate-950/45"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Coins
                            className="h-4 w-4 text-amber-400"
                            aria-hidden="true"
                          />
                          Lifetime game points
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                          {rewards.points}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={startGame}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold ${
                          isDark
                            ? "bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                            : "bg-[#020617] text-[#ffffff] hover:bg-[#111827]"
                        }`}
                      >
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                        Play Again
                      </button>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
