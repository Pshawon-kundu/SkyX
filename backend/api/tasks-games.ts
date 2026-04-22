/**
 * Tasks & Games API Routes
 * Endpoints for task submission, completion, and game sessions
 */

import express, { Router, Request, Response, NextFunction } from "express";
import { Task, TaskCompletion, GameSession } from "../models/index";
import {
  submitTaskCompletion,
  approveTaskCompletion,
  rejectTaskCompletion,
  getUserTaskStats,
  getPendingTaskCompletions,
  startGameSession,
  completeGameSession,
  getUserGameStats,
  getGameLeaderboard,
} from "../logic/tasks-and-games";
import { CompleteTaskDTO, CreateGameSessionDTO } from "../types/index";

const router: Router = express.Router();

// ============ MIDDLEWARE ============

interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const userId = req.headers["x-user-id"] as string;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.userId = userId;
  req.userRole = (req.headers["x-user-role"] as string) || "user";
  next();
};

const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  if (req.userRole !== "admin") {
    res.status(403).json({ error: "Admin role required" });
    return;
  }
  next();
};

// ============ TASKS ============

/**
 * GET /api/tasks
 * List all active tasks
 *
 * Query params:
 * - type: TaskType (optional) - filter by task type
 * - limit: number (default 20)
 * - skip: number (default 0)
 *
 * Response:
 * {
 *   "tasks": [
 *     {
 *       "id": "507f1f77bcf86cd799439011",
 *       "title": "Complete KYC Verification",
 *       "description": "Verify your identity...",
 *       "taskType": "verification",
 *       "pointsReward": 100,
 *       "estimatedDurationMinutes": 5,
 *       "createdAt": "2024-01-10T10:00:00Z"
 *     }
 *   ],
 *   "total": 45
 * }
 */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: any = { isActive: true };

    if (req.query.type) {
      filter.taskType = req.query.type;
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = parseInt(req.query.skip as string) || 0;

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "title description taskType pointsReward estimatedDurationMinutes createdAt",
      );

    const total = await Task.countDocuments(filter);

    res.json({ tasks, total });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * GET /api/tasks/:taskId
 * Get task details
 *
 * Response:
 * {
 *   "id": "507f1f77bcf86cd799439011",
 *   "title": "Complete Survey",
 *   "description": "Tell us about your experience...",
 *   "taskType": "survey",
 *   "pointsReward": 50,
 *   "estimatedDurationMinutes": 10,
 *   "maxCompletionsPerUser": 1,
 *   "metadata": {
 *     "surveyUrl": "https://surveys.example.com/123"
 *   }
 * }
 */
router.get("/:taskId", async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * POST /api/tasks/:taskId/submit
 * Submit task completion for verification
 *
 * Request body:
 * {
 *   "proofUrl": "https://example.com/screenshot.png"  // optional
 * }
 *
 * Response:
 * {
 *   "completionId": "507f1f77bcf86cd799439012",
 *   "status": "pending",
 *   "message": "Task submitted for review"
 * }
 */
router.post(
  "/:taskId/submit",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { proofUrl } = req.body as Partial<CompleteTaskDTO>;

      const completionId = await submitTaskCompletion(
        req.userId!,
        req.params.taskId,
        proofUrl,
      );

      res.json({
        completionId,
        status: "pending",
        message: "Task submitted for review",
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
);

/**
 * GET /api/tasks/completions/my-tasks
 * Get user's task completion history
 *
 * Response:
 * {
 *   "totalSubmitted": 5,
 *   "approved": 4,
 *   "pending": 1,
 *   "rejected": 0,
 *   "totalPointsEarned": 250,
 *   "completions": [...]
 * }
 */
router.get(
  "/completions/my-tasks",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const stats = await getUserTaskStats(req.userId!);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

/**
 * GET /api/tasks/admin/pending
 * Get all pending task completions (admin only)
 *
 * Query params:
 * - limit: number (default 20)
 * - skip: number (default 0)
 *
 * Response:
 * {
 *   "pending": [...],
 *   "total": 47
 * }
 */
router.get(
  "/admin/pending",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = parseInt(req.query.skip as string) || 0;

      const { pending, total } = await getPendingTaskCompletions(limit, skip);

      res.json({ pending, total });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

/**
 * POST /api/tasks/admin/approve/:completionId
 * Approve task completion and award points (admin only)
 *
 * Request body:
 * {
 *   "pointsToAward": 50,
 *   "notes": "Great submission!"
 * }
 *
 * Response:
 * {
 *   "message": "Task approved",
 *   "pointsAwarded": 50
 * }
 */
router.post(
  "/admin/approve/:completionId",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { pointsToAward, notes } = req.body;

      await approveTaskCompletion(
        req.params.completionId,
        pointsToAward,
        req.userId,
        notes,
      );

      res.json({
        message: "Task approved",
        pointsAwarded: pointsToAward,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
);

/**
 * POST /api/tasks/admin/reject/:completionId
 * Reject task completion (admin only)
 *
 * Request body:
 * {
 *   "reason": "Image not clear"
 * }
 *
 * Response:
 * {
 *   "message": "Task rejected"
 * }
 */
router.post(
  "/admin/reject/:completionId",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { reason } = req.body;

      await rejectTaskCompletion(req.params.completionId, req.userId!, reason);

      res.json({
        message: "Task rejected",
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
);

// ============ GAMES ============

/**
 * POST /api/games/start
 * Start a new game session
 *
 * Request body:
 * {
 *   "gameType": "quiz",
 *   "difficulty": "hard"
 * }
 *
 * Response:
 * {
 *   "sessionId": "507f1f77bcf86cd799439013",
 *   "gameType": "quiz",
 *   "difficulty": "hard",
 *   "startedAt": "2024-01-15T10:00:00Z"
 * }
 */
router.post(
  "/start",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { gameType, difficulty } = req.body as CreateGameSessionDTO;

      if (!gameType || !difficulty) {
        res.status(400).json({ error: "gameType and difficulty required" });
        return;
      }

      const session = await startGameSession(req.userId!, gameType, difficulty);

      res.status(201).json({
        sessionId: session._id.toString(),
        gameType: session.gameType,
        difficulty: session.difficulty,
        startedAt: session.startedAt,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

/**
 * POST /api/games/:sessionId/complete
 * Complete game session and calculate rewards
 *
 * Request body:
 * {
 *   "score": 85  // percentage 0-100
 * }
 *
 * Response:
 * {
 *   "message": "Game completed",
 *   "score": 85,
 *   "pointsEarned": 42,
 *   "newTotalPoints": 1292
 * }
 */
router.post(
  "/:sessionId/complete",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { score } = req.body;

      if (score === undefined || score < 0 || score > 100) {
        res.status(400).json({ error: "Score must be between 0 and 100" });
        return;
      }

      const pointsEarned = await completeGameSession(
        req.params.sessionId,
        score,
      );

      // Get updated user points
      const session = await GameSession.findById(req.params.sessionId).populate(
        "userId",
        "points",
      );

      res.json({
        message: "Game completed",
        score,
        pointsEarned,
        newTotalPoints: (session?.userId as any).points,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
);

/**
 * GET /api/games/my-stats
 * Get user's game statistics
 *
 * Response:
 * {
 *   "totalSessions": 12,
 *   "totalPointsEarned": 542,
 *   "averageScore": 78,
 *   "by_difficulty": {
 *     "easy": { "count": 5, "points": 150 },
 *     "medium": { "count": 4, "points": 200 },
 *     "hard": { "count": 3, "points": 192 }
 *   },
 *   "recentSessions": [...]
 * }
 */
router.get(
  "/my-stats",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const stats = await getUserGameStats(req.userId!);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

/**
 * GET /api/games/:gameType/leaderboard?limit=50
 * Get leaderboard for a specific game
 *
 * Response:
 * {
 *   "leaderboard": [
 *     {
 *       "rank": 1,
 *       "user": {
 *         "id": "507f1f77bcf86cd799439011",
 *         "fullName": "Jane Doe",
 *         "profileImage": "https://..."
 *       },
 *       "score": 95,
 *       "pointsEarned": 57,
 *       "difficulty": "hard",
 *       "completedAt": "2024-01-15T09:30:00Z"
 *     }
 *   ]
 * }
 */
router.get(
  "/:gameType/leaderboard",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 500);
      const leaderboard = await getGameLeaderboard(req.params.gameType, limit);

      res.json({ leaderboard });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

export default router;
