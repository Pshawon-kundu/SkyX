/**
 * Task & Game Session Business Logic
 * Handles task completion, verification, and game session rewards
 */

import { User, Task, TaskCompletion, GameSession } from "../models/index";
import { awardPoints, getTierMultiplier } from "./points-and-referrals";
import { RewardType } from "../types/index";

// ============ TASK COMPLETION ============

/**
 * Submit task completion for verification
 * Validates that:
 * 1. Task exists and is active
 * 2. User hasn't exceeded max completions
 * 3. Prevents duplicate submissions
 */
export const submitTaskCompletion = async (
  userId: string,
  taskId: string,
  proofUrl?: string,
): Promise<string> => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");
  if (!task.isActive) throw new Error("Task is no longer active");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Check if user already completed this task
  const existingCompletion = await TaskCompletion.findOne({ userId, taskId });
  if (existingCompletion) {
    throw new Error(`User has already completed this task`);
  }

  // Check max completions limit
  const completionCount = await TaskCompletion.countDocuments({
    userId,
    taskId,
    verificationStatus: "approved",
  });

  if (completionCount >= task.maxCompletionsPerUser) {
    throw new Error(
      `Max completions (${task.maxCompletionsPerUser}) reached for this task`,
    );
  }

  // Create task completion record
  const completion = await TaskCompletion.create({
    userId,
    taskId,
    proofUrl,
    verificationStatus: "pending",
    pointsAwarded: 0,
    completedAt: new Date(),
  });

  // For auto-approve tasks (e.g., surveys), approve immediately
  if (task.taskType === "survey" || task.taskType === "social_share") {
    await approveTaskCompletion(completion._id!.toString(), task.pointsReward);
  }

  return completion._id!.toString();
};

/**
 * Approve task completion and award points
 * Called by admin or auto-approval system
 */
export const approveTaskCompletion = async (
  completionId: string,
  pointsToAward: number,
  adminId?: string,
  notes?: string,
): Promise<void> => {
  const completion =
    await TaskCompletion.findById(completionId).populate("userId");
  if (!completion) throw new Error("Task completion not found");

  if (completion.verificationStatus === "approved") {
    throw new Error("Task already approved");
  }

  completion.verificationStatus = "approved";
  completion.pointsAwarded = pointsToAward;
  completion.verifiedBy = adminId ? adminId : undefined;
  completion.verifiedAt = new Date();
  completion.notes = notes;
  await completion.save();

  // Award points to user
  const description = `Task completion: ${(await Task.findById(completion.taskId))?.title}`;
  await awardPoints(
    completion.userId.toString(),
    pointsToAward,
    RewardType.TASK_COMPLETION,
    description,
    completion.taskId.toString(),
  );
};

/**
 * Reject task completion
 */
export const rejectTaskCompletion = async (
  completionId: string,
  adminId: string,
  reason: string,
): Promise<void> => {
  const completion = await TaskCompletion.findById(completionId);
  if (!completion) throw new Error("Task completion not found");

  completion.verificationStatus = "rejected";
  completion.verifiedBy = adminId;
  completion.verifiedAt = new Date();
  completion.notes = `Rejected: ${reason}`;
  completion.pointsAwarded = 0;
  await completion.save();
};

/**
 * Get user's completed tasks with stats
 */
export const getUserTaskStats = async (userId: string) => {
  const completions = await TaskCompletion.find({ userId })
    .populate("taskId", "title pointsReward taskType")
    .sort({ completedAt: -1 });

  const stats = {
    totalSubmitted: completions.length,
    approved: completions.filter((c) => c.verificationStatus === "approved")
      .length,
    pending: completions.filter((c) => c.verificationStatus === "pending")
      .length,
    rejected: completions.filter((c) => c.verificationStatus === "rejected")
      .length,
    totalPointsEarned: completions
      .filter((c) => c.verificationStatus === "approved")
      .reduce((sum, c) => sum + c.pointsAwarded, 0),
    completions,
  };

  return stats;
};

/**
 * Get pending task completions for admin review
 */
export const getPendingTaskCompletions = async (
  limit: number = 20,
  skip: number = 0,
) => {
  const pending = await TaskCompletion.find({ verificationStatus: "pending" })
    .populate("userId", "fullName email profileImage")
    .populate("taskId", "title description taskType pointsReward")
    .sort({ completedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await TaskCompletion.countDocuments({
    verificationStatus: "pending",
  });

  return { pending, total };
};

// ============ GAME SESSIONS ============

/**
 * Start a new game session
 */
export const startGameSession = async (
  userId: string,
  gameType: string,
  difficulty: "easy" | "medium" | "hard",
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const session = await GameSession.create({
    userId,
    gameType,
    difficulty,
    startedAt: new Date(),
  });

  return session;
};

/**
 * Complete game session and calculate rewards
 * Base points vary by difficulty
 */
export const completeGameSession = async (
  sessionId: string,
  score: number,
): Promise<number> => {
  const session = await GameSession.findById(sessionId);
  if (!session) throw new Error("Game session not found");

  if (session.completedAt) {
    throw new Error("Session already completed");
  }

  // Calculate base points by difficulty
  const basePointsByDifficulty: Record<string, number> = {
    easy: 10,
    medium: 25,
    hard: 50,
  };

  const basePoints = basePointsByDifficulty[session.difficulty] || 10;

  // Calculate bonus based on score (e.g., 70% correct = 0.7 multiplier)
  const scoreMultiplier = Math.min(1.5, Math.max(0.5, score / 100));
  const totalPoints = Math.floor(basePoints * scoreMultiplier);

  session.score = score;
  session.pointsEarned = totalPoints;
  session.completedAt = new Date();
  await session.save();

  // Award points to user
  const description = `Game session: ${session.gameType} (${session.difficulty}, score: ${score}%)`;
  await awardPoints(
    session.userId.toString(),
    totalPoints,
    RewardType.GAME_WINNINGS,
    description,
    sessionId,
  );

  return totalPoints;
};

/**
 * Get user's game session stats
 */
export const getUserGameStats = async (userId: string) => {
  const sessions = await GameSession.find({
    userId,
    completedAt: { $ne: null },
  }).sort({
    completedAt: -1,
  });

  const stats = {
    totalSessions: sessions.length,
    totalPointsEarned: sessions.reduce((sum, s) => sum + s.pointsEarned, 0),
    averageScore:
      sessions.length > 0
        ? Math.round(
            sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length,
          )
        : 0,
    by_difficulty: {
      easy: {
        count: sessions.filter((s) => s.difficulty === "easy").length,
        points: sessions
          .filter((s) => s.difficulty === "easy")
          .reduce((sum, s) => sum + s.pointsEarned, 0),
      },
      medium: {
        count: sessions.filter((s) => s.difficulty === "medium").length,
        points: sessions
          .filter((s) => s.difficulty === "medium")
          .reduce((sum, s) => sum + s.pointsEarned, 0),
      },
      hard: {
        count: sessions.filter((s) => s.difficulty === "hard").length,
        points: sessions
          .filter((s) => s.difficulty === "hard")
          .reduce((sum, s) => sum + s.pointsEarned, 0),
      },
    },
    recentSessions: sessions.slice(0, 10),
  };

  return stats;
};

/**
 * Get leaderboard for a specific game
 */
export const getGameLeaderboard = async (
  gameType: string,
  limit: number = 50,
) => {
  const sessions = await GameSession.find({
    gameType,
    completedAt: { $ne: null },
  })
    .populate("userId", "fullName profileImage")
    .sort({ pointsEarned: -1, score: -1 })
    .limit(limit);

  return sessions.map((session, idx) => ({
    rank: idx + 1,
    user: {
      id: session.userId._id,
      fullName: (session.userId as any).fullName,
      profileImage: (session.userId as any).profileImage,
    },
    score: session.score,
    pointsEarned: session.pointsEarned,
    difficulty: session.difficulty,
    completedAt: session.completedAt,
  }));
};
