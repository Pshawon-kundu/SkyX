import express from "express";
import { getLeaderboard } from "../utils/leaderboardManager";

const router = express.Router();

router.get("/", async (req, res) => {
  const limit = parseInt((req.query.limit as string) || "5", 10) || 5;
  try {
    const data = await getLeaderboard(limit);
    res.json({ data });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

export default router;
