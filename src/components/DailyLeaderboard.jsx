import { AnimatePresence, motion as Motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  ChevronRight,
  CircleDot,
  Clock,
  Crown,
  Gift,
  Medal,
  Sparkles,
  Target,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";
import { animations } from "../data/animations";

const FIRST_NAMES = [
  "Alex",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Riley",
  "Avery",
  "Quinn",
  "Sam",
  "Dakota",
  "Phoenix",
  "Austin",
  "Bailey",
  "Skylar",
  "Cameron",
  "Parker",
  "Madison",
  "Blake",
  "Drew",
  "Harper",
  "Emerson",
  "Hayden",
];

const LAST_NAMES = [
  "Rivera",
  "Smith",
  "Chen",
  "Blake",
  "Davis",
  "Johnson",
  "Williams",
  "Jones",
  "Garcia",
  "Miller",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
];

const rankVisuals = {
  1: {
    Icon: Crown,
    label: "Champion",
    dark: {
      rankClass:
        "border-amber-300/50 bg-amber-300/15 text-amber-200 shadow-lg shadow-amber-500/10",
      avatarClass:
        "border-amber-300/40 bg-amber-300/15 text-amber-100 shadow-lg shadow-amber-500/10",
      labelClass: "border-amber-300/45 bg-amber-300/15 text-amber-200",
      rowClass: "from-amber-400/12 via-transparent to-transparent",
      accentClass: "bg-amber-300",
      iconClass: "drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]",
    },
    light: {
      rankClass:
        "border-amber-300 bg-amber-50 text-amber-700 shadow-sm shadow-amber-200/80",
      avatarClass:
        "border-amber-300 bg-amber-50 text-amber-800 shadow-sm shadow-amber-200/80",
      labelClass: "border-amber-300 bg-amber-50 text-amber-700",
      rowClass: "from-amber-100 via-amber-50/70 to-transparent",
      accentClass: "bg-amber-400",
      iconClass: "drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]",
    },
  },
  2: {
    Icon: Medal,
    label: "Second",
    dark: {
      rankClass: "border-slate-300/45 bg-slate-300/15 text-slate-200",
      avatarClass: "border-slate-300/35 bg-slate-300/12 text-slate-100",
      labelClass: "border-slate-300/35 bg-slate-300/12 text-slate-200",
      rowClass: "from-slate-300/10 via-transparent to-transparent",
      accentClass: "bg-slate-300",
      iconClass: "drop-shadow-[0_0_8px_rgba(203,213,225,0.35)]",
    },
    light: {
      rankClass:
        "border-slate-300 bg-slate-100 text-slate-700 shadow-sm shadow-slate-200/80",
      avatarClass:
        "border-slate-300 bg-slate-100 text-slate-700 shadow-sm shadow-slate-200/80",
      labelClass: "border-slate-300 bg-slate-100 text-slate-700",
      rowClass: "from-slate-100 via-slate-50/80 to-transparent",
      accentClass: "bg-slate-400",
      iconClass: "drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]",
    },
  },
  3: {
    Icon: Medal,
    label: "Third",
    dark: {
      rankClass: "border-orange-300/45 bg-orange-400/15 text-orange-100",
      avatarClass: "border-orange-300/35 bg-orange-400/12 text-orange-100",
      labelClass: "border-orange-300/40 bg-orange-400/15 text-orange-100",
      rowClass: "from-orange-400/10 via-transparent to-transparent",
      accentClass: "bg-orange-300",
      iconClass: "drop-shadow-[0_0_8px_rgba(251,146,60,0.35)]",
    },
    light: {
      rankClass:
        "border-orange-300 bg-orange-50 text-orange-700 shadow-sm shadow-orange-200/80",
      avatarClass:
        "border-orange-300 bg-orange-50 text-orange-800 shadow-sm shadow-orange-200/80",
      labelClass: "border-orange-300 bg-orange-50 text-orange-700",
      rowClass: "from-orange-100 via-orange-50/70 to-transparent",
      accentClass: "bg-orange-400",
      iconClass: "drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]",
    },
  },
};

function getRankVisual(rank, isDark) {
  const visual = rankVisuals[rank];
  if (!visual) return null;

  return {
    Icon: visual.Icon,
    label: visual.label,
    ...(isDark ? visual.dark : visual.light),
  };
}

function createSeedFromDate(date = new Date()) {
  return Number(
    `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(
      2,
      "0",
    )}${String(date.getUTCDate()).padStart(2, "0")}`,
  );
}

function createDailyRandom(seedInput) {
  let seed = seedInput % 2147483647;
  if (seed <= 0) seed += 2147483646;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function shuffleWithSeed(items, random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function createInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SX"
  );
}

function formatPoints(value = 0) {
  const number = Number(value) || 0;
  if (number >= 1000) {
    return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}K`;
  }
  return new Intl.NumberFormat("en-US").format(number);
}

function normalizeLeaderboard(entries = []) {
  return entries
    .map((entry, index) => {
      const name = entry.name || "SkyX Player";
      const points = Number(entry.points || entry.totalPoints || 0);
      return {
        id: entry._id || entry.id || `${name}-${index}`,
        name,
        points,
        avatar: entry.avatar || createInitials(name),
        change:
          entry.change ||
          `+${80 + ((points + createInitials(name).charCodeAt(0) + index * 37) % 320)}`,
      };
    })
    .sort((a, b) => b.points - a.points)
    .slice(0, 5)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}

function buildDailyLeaderboard(date = new Date()) {
  const seed = createSeedFromDate(date);
  const random = createDailyRandom(seed);
  const names = shuffleWithSeed(
    FIRST_NAMES.map((firstName, index) => {
      const lastName = LAST_NAMES[(index + seed) % LAST_NAMES.length];
      return `${firstName} ${lastName}`;
    }),
    random,
  );

  const pointsBase = 1800 + (seed % 500);
  const shuffledPoints = shuffleWithSeed(
    Array.from({ length: 5 }, (_, index) => pointsBase + index * 120),
    random,
  );

  return normalizeLeaderboard(
    names.slice(0, 5).map((name, index) => ({
      id: `daily-${seed}-${index}`,
      name,
      points: shuffledPoints[index],
      avatar: createInitials(name),
      change: `+${Math.floor(60 + random() * 340)}`,
    })),
  );
}

function getNextUtcMidnight() {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
    ),
  );
}

const DailyLeaderboard = ({ theme }) => {
  const isDark = theme === "dark";

  const [leaderboardData, setLeaderboardData] = useState(() =>
    buildDailyLeaderboard(),
  );

  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
  });

  const dailyStats = useMemo(() => {
    const totalRewards = leaderboardData.reduce(
      (total, user) => total + user.points,
      0,
    );

    return [
      {
        label: "New Registrations",
        value: "24",
        detail: "verified today",
        icon: <UserPlus className="h-5 w-5" aria-hidden="true" />,
        iconClass: isDark
          ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-300"
          : "border-cyan-700/20 bg-cyan-50 text-cyan-700",
      },
      {
        label: "Active Today",
        value: "156",
        detail: "players online",
        icon: <Users className="h-5 w-5" aria-hidden="true" />,
        iconClass: isDark
          ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-300"
          : "border-emerald-700/20 bg-emerald-50 text-emerald-700",
      },
      {
        label: "Reward Pool",
        value: `${formatPoints(totalRewards)} pts`,
        detail: "top 5 today",
        icon: <Gift className="h-5 w-5" aria-hidden="true" />,
        iconClass: isDark
          ? "border-amber-300/30 bg-amber-400/10 text-amber-300"
          : "border-amber-700/20 bg-amber-50 text-amber-700",
      },
    ];
  }, [isDark, leaderboardData]);

  const topUser = leaderboardData[0];

  useEffect(() => {
    const updateCountdown = () => {
      const diff = getNextUtcMidnight().getTime() - Date.now();
      const safeDiff = Math.max(diff, 0);
      const hours = Math.floor(safeDiff / (1000 * 60 * 60));
      const minutes = Math.floor(
        (safeDiff % (1000 * 60 * 60)) / (1000 * 60),
      );
      setTimeRemaining({ hours, minutes });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    const updateFromDailySeed = () => {
      if (!mounted) return;
      setLeaderboardData(buildDailyLeaderboard());
    };

    const fetchLeaderboard = async () => {
      try {
        if (!import.meta.env.DEV) return;

        const API_BASE = "http://localhost:5000";
        const res = await fetch(`${API_BASE}/api/leaderboard?limit=5`);
        if (!res.ok) {
          updateFromDailySeed();
          return;
        }

        const json = await res.json();
        const payload = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json.leaderboard)
            ? json.leaderboard
            : [];

        if (!mounted) return;
        if (!payload.length) {
          updateFromDailySeed();
          return;
        }

        setLeaderboardData(normalizeLeaderboard(payload));
      } catch {
        updateFromDailySeed();
      }
    };

    fetchLeaderboard();
    const timeout = setTimeout(() => {
      updateFromDailySeed();
      fetchLeaderboard();
    }, getNextUtcMidnight().getTime() - Date.now());

    const poll = setInterval(
      fetchLeaderboard,
      import.meta.env.DEV ? 15000 : 60000,
    );

    return () => {
      mounted = false;
      clearTimeout(timeout);
      clearInterval(poll);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.07, duration: 0.35, ease: "easeOut" },
    }),
  };

  return (
    <section
      id="daily-leaderboard"
      className={`relative overflow-hidden py-20 sm:py-24 ${
        isDark
          ? "bg-slate-950/70 text-slate-100"
          : "bg-white/80 text-slate-950"
      }`}
    >
      <div
        className={`absolute inset-0 pointer-events-none ${
          isDark ? "opacity-25" : "opacity-45"
        }`}
        style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.12) 1px, transparent 1px)"
            : "linear-gradient(rgba(14,116,144,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(14,116,144,0.14) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={animations.viewport}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <div
            className={`mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg border ${
              isDark
                ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-200"
                : "border-cyan-700/20 bg-cyan-50 text-cyan-700"
            }`}
          >
            <Trophy className="h-6 w-6" aria-hidden="true" />
          </div>
          <p
            className={`mb-3 text-sm font-semibold uppercase tracking-normal ${
              isDark ? "text-cyan-200" : "text-cyan-700"
            }`}
          >
            Daily rewards
          </p>
          <h2
            className={`text-3xl font-bold tracking-normal ${
              isDark ? "text-white" : "text-slate-950"
            }`}
          >
            Daily Champion Leaderboard
          </h2>
          <p
            className={`mx-auto mt-4 max-w-2xl text-base leading-7 ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Rankings refresh at 00:00 UTC. Top performers earn the daily reward
            pool and keep the momentum visible.
          </p>
        </Motion.div>

        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={animations.viewport}
          className="mb-6 grid gap-4 md:grid-cols-3"
        >
          {dailyStats.map(({ label, value, detail, icon, iconClass }, index) => (
            <Motion.div
              key={label}
              variants={itemVariants}
              custom={index}
              whileHover={{ y: -3 }}
              className={`rounded-lg border p-5 backdrop-blur ${
                isDark
                  ? "border-slate-800 bg-slate-900/65"
                  : "border-slate-200 bg-white/90 shadow-sm shadow-slate-200/70"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {label}
                  </p>
                  <div
                    className={`mt-2 text-2xl font-bold tracking-normal ${
                      isDark ? "text-white" : "text-slate-950"
                    }`}
                  >
                    {value}
                  </div>
                </div>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${iconClass}`}
                >
                  {icon}
                </div>
              </div>
              <div
                className={`mt-4 flex items-center gap-2 text-xs font-semibold ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {detail}
              </div>
            </Motion.div>
          ))}
        </Motion.div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={animations.viewport}
            className={`overflow-hidden rounded-lg border backdrop-blur ${
              isDark
                ? "border-slate-800 bg-slate-900/75"
                : "border-slate-200 bg-white/95 shadow-sm shadow-slate-200/80"
            }`}
            aria-label="Daily champion leaderboard"
          >
            <div
              className={`flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
                isDark
                  ? "border-slate-800 bg-slate-950/35"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                    isDark
                      ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-300"
                      : "border-emerald-700/20 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <Target className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3
                    className={`text-base font-bold tracking-normal ${
                      isDark ? "text-white" : "text-slate-950"
                    }`}
                  >
                    Top 5 Today
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Ranked by verified daily points
                  </p>
                </div>
              </div>

              <div
                className={`flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                  isDark
                    ? "border-cyan-300/25 bg-cyan-400/10 text-cyan-200"
                    : "border-cyan-700/20 bg-cyan-50 text-cyan-700"
                }`}
              >
                <Clock className="h-4 w-4" aria-hidden="true" />
                {String(timeRemaining.hours).padStart(2, "0")}h{" "}
                {String(timeRemaining.minutes).padStart(2, "0")}m left
              </div>
            </div>

            <div
              className={`divide-y ${
                isDark ? "divide-slate-800" : "divide-slate-200"
              }`}
            >
              <AnimatePresence initial={false}>
                {leaderboardData.map((user, index) => {
                  const visual = getRankVisual(user.rank, isDark);
                  const RankIcon = visual?.Icon || CircleDot;

                  return (
                    <Motion.div
                      key={user.id || `${user.name}-${index}`}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={animations.viewport}
                      custom={index}
                      whileHover={{
                        backgroundColor: isDark
                          ? "rgba(15, 23, 42, 0.72)"
                          : "rgba(248, 250, 252, 0.96)",
                      }}
                      className="group relative px-4 py-4 sm:px-5"
                    >
                      <div
                        className={`absolute inset-y-0 left-0 w-1 ${
                          visual?.accentClass || "bg-cyan-300"
                        } ${user.rank > 3 ? "opacity-0" : "opacity-100"}`}
                      />
                      <div
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                          visual?.rowClass ||
                          "from-cyan-400/8 via-transparent to-transparent"
                        }`}
                      />

                      <div className="relative flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border font-bold ${
                              visual?.rankClass ||
                              (isDark
                                ? "border-slate-700 bg-slate-800 text-slate-300"
                                : "border-slate-200 bg-slate-100 text-slate-700")
                            }`}
                            aria-label={`Rank ${user.rank}`}
                          >
                            {user.rank <= 3 ? (
                              <RankIcon
                                className={`h-5 w-5 ${visual?.iconClass || ""}`}
                                strokeWidth={2.6}
                                aria-hidden="true"
                              />
                            ) : (
                              <span className="text-sm">#{user.rank}</span>
                            )}
                          </div>

                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${
                              visual?.avatarClass ||
                              (isDark
                                ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-100"
                                : "border-cyan-700/20 bg-cyan-50 text-cyan-700")
                            }`}
                          >
                            {user.avatar}
                          </div>

                          <div className="min-w-0">
                            <div className="flex min-w-0 items-center gap-2">
                              <p
                                className={`truncate font-semibold ${
                                  isDark ? "text-white" : "text-slate-950"
                                }`}
                              >
                                {user.name}
                              </p>
                              {user.rank <= 3 && (
                                <span
                                  className={`hidden rounded-md border px-2 py-0.5 text-xs font-semibold sm:inline-flex ${
                                    visual.labelClass
                                  }`}
                                >
                                  {visual.label}
                                </span>
                              )}
                            </div>
                            <div
                              className={`mt-1 flex items-center gap-2 text-xs font-medium ${
                                isDark ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              <ArrowUpRight
                                className="h-3.5 w-3.5 text-emerald-400"
                                aria-hidden="true"
                              />
                              {user.change} today
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div
                            className={`text-lg font-bold tracking-normal ${
                              isDark ? "text-white" : "text-slate-950"
                            }`}
                          >
                            {formatPoints(user.points)}
                          </div>
                          <div
                            className={`text-xs font-semibold ${
                              isDark ? "text-slate-500" : "text-slate-500"
                            }`}
                          >
                            points
                          </div>
                        </div>
                      </div>
                    </Motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div
              className={`flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
                isDark
                  ? "border-slate-800 bg-slate-950/35"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div
                className={`flex items-center gap-2 text-sm ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <CalendarClock className="h-4 w-4" aria-hidden="true" />
                Reset: 00:00 UTC
              </div>
              <a
                href="#profile"
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold ${
                  isDark
                    ? "bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                    : "bg-[#020617] text-[#ffffff] hover:bg-[#111827]"
                }`}
              >
                Join the Race
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </Motion.div>

          <Motion.aside
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={animations.viewport}
            className={`rounded-lg border p-5 backdrop-blur ${
              isDark
                ? "border-slate-800 bg-slate-900/65"
                : "border-slate-200 bg-white/95 shadow-sm shadow-slate-200/80"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                  isDark
                    ? "border-amber-300/30 bg-amber-400/10 text-amber-300"
                    : "border-amber-700/20 bg-amber-50 text-amber-700"
                }`}
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
              <div
                className={`rounded-lg border px-3 py-1 text-xs font-bold uppercase tracking-normal ${
                  isDark
                    ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-300"
                    : "border-emerald-700/20 bg-emerald-50 text-emerald-700"
                }`}
              >
                Live
              </div>
            </div>

            <h3
              className={`mt-5 text-xl font-bold tracking-normal ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              Current Champion
            </h3>
            <p
              className={`mt-2 text-sm leading-6 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {topUser?.name || "SkyX Player"} leads with{" "}
              <span
                className={`font-bold ${
                  isDark ? "text-amber-200" : "text-amber-700"
                }`}
              >
                {formatPoints(topUser?.points || 0)} points
              </span>
              .
            </p>

            <div
              className={`mt-5 rounded-lg border p-4 ${
                isDark
                  ? "border-slate-800 bg-slate-950/45"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div
                className={`flex items-center gap-2 text-sm font-semibold ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                <Trophy className="h-4 w-4 text-amber-400" aria-hidden="true" />
                Reward Window
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <div
                    className={`text-2xl font-bold tracking-normal ${
                      isDark ? "text-white" : "text-slate-950"
                    }`}
                  >
                    {String(timeRemaining.hours).padStart(2, "0")}
                  </div>
                  <div
                    className={`text-xs font-semibold ${
                      isDark ? "text-slate-500" : "text-slate-500"
                    }`}
                  >
                    hours
                  </div>
                </div>
                <div>
                  <div
                    className={`text-2xl font-bold tracking-normal ${
                      isDark ? "text-white" : "text-slate-950"
                    }`}
                  >
                    {String(timeRemaining.minutes).padStart(2, "0")}
                  </div>
                  <div
                    className={`text-xs font-semibold ${
                      isDark ? "text-slate-500" : "text-slate-500"
                    }`}
                  >
                    minutes
                  </div>
                </div>
              </div>
            </div>
          </Motion.aside>
        </div>
      </div>
    </section>
  );
};

export default DailyLeaderboard;
