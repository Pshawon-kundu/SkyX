// Helper utilities and mock data models for SkyX user profile
export function generateReferralCode(name = "user") {
  // simple deterministic-ish code: prefix + base36 of timestamp + hash of name
  const ts = Date.now().toString(36).slice(-5).toUpperCase();
  const clean = (name || "")
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 4)
    .toUpperCase();
  return `SKYX-${clean || "U"}-${ts}`;
}

export function copyToClipboard(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}

export function calcTotalPoints({
  taskPoints = 0,
  referralPoints = 0,
  gamePoints = 0,
}) {
  return Number(taskPoints) + Number(referralPoints) + Number(gamePoints);
}

export function formatTaskStatus(status) {
  const s = (status || "").toLowerCase();
  if (s === "done" || s === "completed") return "Completed";
  if (s === "pending" || s === "todo") return "Pending";
  if (s === "claimed") return "Claimed";
  return "Pending";
}

export function calcLevelProgress(totalPoints, levelBase = 1000) {
  // simple leveling: level = floor(total/levelBase), progress = remainder/levelBase
  const level = Math.floor(totalPoints / levelBase);
  const progress = (totalPoints % levelBase) / levelBase;
  return { level, progress };
}

// Example mock models
export const exampleUser = (overrides = {}) => ({
  id: "u_01",
  fullName: "Alex Rivera",
  email: "alex@example.com",
  avatarUrl: "https://api.dicebear.com/6.x/identicon/svg?seed=SkyXAlex",
  wallet: "0xAbC123...9fE0",
  joinedAt: "2026-04-01T10:00:00.000Z",
  referralCode: generateReferralCode("Alex"),
  referrals: 7,
  successfulReferrals: 4,
  referralPoints: 240,
  taskPoints: 860,
  gamePoints: 120,
  pointsHistory: [
    { id: "p1", date: "2026-04-21", source: "Daily Login", points: 10 },
    { id: "p2", date: "2026-04-20", source: "Referral Signup", points: 60 },
    { id: "p3", date: "2026-04-18", source: "Quest Complete", points: 200 },
  ],
  tasks: [
    {
      id: "t1",
      title: "Daily Login",
      description: "Log in to earn rewards.",
      points: 10,
      status: "completed",
    },
    {
      id: "t2",
      title: "Complete Tutorial",
      description: "Finish the onboarding tutorial.",
      points: 50,
      status: "pending",
    },
    {
      id: "t3",
      title: "Invite a Friend",
      description: "Refer a friend to SkyX.",
      points: 100,
      status: "pending",
    },
  ],
  games: {
    played: 24,
    wins: 12,
    losses: 12,
    pointsFromGames: 120,
    scoreHistory: [820, 910, 760, 880],
  },
  ...overrides,
});

export default {
  generateReferralCode,
  copyToClipboard,
  calcTotalPoints,
  formatTaskStatus,
  calcLevelProgress,
  exampleUser,
};
