export const OPEN_SKYX_GAME_EVENT = "skyx:open-mini-game";
export const SKYX_GAME_REWARD_EVENT = "skyx:game-reward";

const STORAGE_KEY = "skyx-mini-game-rewards";

const EMPTY_REWARDS = {
  points: 0,
  played: 0,
  wins: 0,
  bestScore: 0,
  lastEarned: 0,
};

function hasStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function readGameRewards() {
  if (!hasStorage()) return EMPTY_REWARDS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_REWARDS;

    const parsed = JSON.parse(raw);
    return {
      points: Number(parsed.points) || 0,
      played: Number(parsed.played) || 0,
      wins: Number(parsed.wins) || 0,
      bestScore: Number(parsed.bestScore) || 0,
      lastEarned: Number(parsed.lastEarned) || 0,
    };
  } catch {
    return EMPTY_REWARDS;
  }
}

export function saveGameReward({
  earnedPoints = 0,
  score = 0,
  won = earnedPoints > 0,
} = {}) {
  const current = readGameRewards();
  const next = {
    points: current.points + Math.max(0, Number(earnedPoints) || 0),
    played: current.played + 1,
    wins: current.wins + (won ? 1 : 0),
    bestScore: Math.max(current.bestScore, Number(score) || 0),
    lastEarned: Math.max(0, Number(earnedPoints) || 0),
  };

  if (hasStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(
      new CustomEvent(SKYX_GAME_REWARD_EVENT, {
        detail: {
          ...next,
          earnedPoints: next.lastEarned,
        },
      }),
    );
  }

  return next;
}

export function openSkyXMiniGame() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_SKYX_GAME_EVENT));
}
