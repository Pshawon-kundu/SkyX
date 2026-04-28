import { promises as fs } from "fs";
import path from "path";
import { User } from "../models/index";

type Snapshot = {
  generatedAt: string;
  users: Array<{ _id: string; name: string; points: number; avatar?: string }>;
};

const SNAPSHOT_DIR = path.join(__dirname, "..", "data");
const SNAPSHOT_FILE = path.join(SNAPSHOT_DIR, "leaderboard_snapshot.json");

// Random name pool for anonymous leaderboard
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
  "Jordan",
  "Blake",
  "Drew",
  "Casey",
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
  "Davis",
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

function shuffleArray<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateRandomName(seed: number): string {
  // Deterministic random based on seed for consistent naming per day
  const firstIdx = seed % FIRST_NAMES.length;
  const lastIdx =
    (seed + Math.floor(seed / FIRST_NAMES.length)) % LAST_NAMES.length;
  return `${FIRST_NAMES[firstIdx]} ${LAST_NAMES[lastIdx]}`;
}

function generateRandomPoints(seed: number): number {
  // Deterministic random points based on seed
  const base = 1500 + (seed % 1500);
  return base + (seed % 500);
}

async function readSnapshot(): Promise<Snapshot | null> {
  try {
    const raw = await fs.readFile(SNAPSHOT_FILE, "utf8");
    return JSON.parse(raw) as Snapshot;
  } catch (err) {
    return null;
  }
}

async function writeSnapshot(snapshot: Snapshot): Promise<void> {
  await fs.mkdir(SNAPSHOT_DIR, { recursive: true });
  await fs.writeFile(SNAPSHOT_FILE, JSON.stringify(snapshot, null, 2), "utf8");
}

export async function getLeaderboard(limit = 5) {
  try {
    const now = new Date();
    const snapshot = await readSnapshot();
    const snapshotDate = snapshot ? new Date(snapshot.generatedAt) : null;

    const needsShuffle =
      !snapshotDate ||
      !snapshot ||
      (snapshot &&
        Array.isArray(snapshot.users) &&
        snapshot.users.length === 0) ||
      snapshotDate.getUTCFullYear() !== now.getUTCFullYear() ||
      snapshotDate.getUTCMonth() !== now.getUTCMonth() ||
      snapshotDate.getUTCDate() !== now.getUTCDate();

    let ordered: Snapshot["users"] = [];

    if (needsShuffle) {
      // Generate random names and points for top 5
      const randomUsers = Array.from({ length: 5 }, (_, i) => {
        const seed = i + now.getUTCDate() * 1000; // Different seed per day
        const name = generateRandomName(seed);
        const points = generateRandomPoints(seed);
        return {
          _id: `random-${i}`,
          name,
          points,
          avatar: name
            .split(" ")
            .map((s: string) => s[0])
            .join("")
            .toUpperCase(),
        };
      });

      // Shuffle the array so rankings change
      shuffleArray(randomUsers);

      ordered = randomUsers;

      const newSnapshot: Snapshot = {
        generatedAt: now.toISOString(),
        users: ordered,
      };

      try {
        await writeSnapshot(newSnapshot);
      } catch (e) {
        console.warn("Failed to write leaderboard snapshot:", e);
      }
    } else {
      ordered = snapshot!.users;
    }

    return ordered.slice(0, limit);
  } catch (err) {
    console.warn("Leaderboard manager error", err);
    return [];
  }
}

export default { getLeaderboard };
