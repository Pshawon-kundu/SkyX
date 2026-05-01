/**
 * User & Profile API Routes
 * Endpoints for user management, profiles, and general info
 */

import "dotenv/config";
import express, { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, RewardTransaction } from "../models/index";
import {
  generateReferralCode,
  validateReferral,
  processReferralSignUp,
  getReferrerStats,
  getLeaderboard,
  getUserLeaderboardContext,
} from "../logic/points-and-referrals";
import { getUserTaskStats } from "../logic/tasks-and-games";
import { getUserGameStats } from "../logic/tasks-and-games";
import { verifySupabaseToken } from "../utils/supabase";
import {
  IProfileSummary,
  AuthResponseDTO,
  AuthUserDTO,
  CreateUserDTO,
  LoginDTO,
} from "../types/index";

const router: Router = express.Router();

// ============ MIDDLEWARE ============

interface AuthRequest extends Request {
  userId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "skyx-dev-secret";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ||
  process.env.JWT_EXPIRY ||
  "7d") as jwt.SignOptions["expiresIn"];

const buildAuthUser = (user: any): AuthUserDTO => ({
  id: user._id.toString(),
  email: user.email,
  fullName: user.fullName,
  referralCode: user.referralCode,
  points: user.points,
  tierLevel: user.tierLevel,
  createdAt: user.createdAt,
  lastLoginAt: user.lastLoginAt,
});

const signAuthToken = (userId: string) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const normalizeProfileName = (value?: string): string | null => {
  const name = value?.trim();
  return name && name.length >= 2 ? name : null;
};

const buildSupabaseFallbackEmail = (supabaseId: string): string => {
  const safeId = supabaseId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return `user_${safeId || Date.now()}@supabase.local`;
};

const buildSupabaseOnlyReferralCode = (supabaseId: string): string => {
  const safeId = supabaseId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return `SKY${safeId.slice(-9).padStart(9, "X")}`.slice(0, 12);
};

const buildSupabaseOnlyAuthUser = (
  supabaseId: string,
  email: string,
  fullName: string,
): AuthUserDTO => {
  const now = new Date();

  return {
    id: supabaseId,
    email,
    fullName,
    referralCode: buildSupabaseOnlyReferralCode(supabaseId),
    points: 0,
    tierLevel: 1,
    createdAt: now,
    lastLoginAt: now,
  };
};

const getAuthToken = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.slice(7);
  }

  const token = req.headers["x-auth-token"];
  if (typeof token === "string" && token.trim()) {
    return token;
  }

  return null;
};

/**
 * Auth middleware - validates JWT/session and attaches userId
 * In production: validate JWT token from Authorization header
 */
const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = getAuthToken(req);

  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
      req.userId = payload.userId;
      next();
      return;
    } catch {
      // Fall through to legacy header support below.
    }
  }

  const userId = req.headers["x-user-id"] as string; // Backward compatibility for older clients
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  req.userId = userId;
  next();
};

// ============ USER REGISTRATION ============

/**
 * POST /api/users/register
 * Create new user account (with optional referral code)
 *
 * Request body:
 * {
 *   "email": "user@example.com",
 *   "fullName": "John Doe",
 *   "password": "securepassword123",
 *   "referralCode": "SKYABC12XY",  // optional
 *   "walletAddress": "0x..."        // optional
 * }
 *
 * Response:
 * {
 *   "user": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "email": "user@example.com",
 *     "fullName": "John Doe",
 *     "referralCode": "SKY12AB5XY",
 *     "points": 0,
 *     "tierLevel": 1,
 *     "createdAt": "2024-01-15T10:00:00Z"
 *   },
 *   "referralBonusApplied": true,
 *   "bonusPoints": 50
 * }
 */
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, fullName, password, referralCode, walletAddress } =
      req.body as CreateUserDTO;

    // Validate required fields
    if (!email || !fullName || !password) {
      res
        .status(400)
        .json({ error: "Email, fullName, and password are required" });
      return;
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Validate referral code if provided
    let referrerId: string | undefined;
    if (referralCode) {
      const validation = await validateReferral(
        referralCode,
        email,
        new Date(),
      );
      if (!validation.valid) {
        res.status(400).json({ error: validation.error });
        return;
      }

      const referrer = await User.findOne({ referralCode });
      referrerId = referrer?._id.toString();
    }

    // Create user
    const newReferralCode = generateReferralCode("temp");
    const user = await User.create({
      email: email.toLowerCase(),
      fullName,
      passwordHash,
      referralCode: newReferralCode,
      walletAddress,
      referredBy: referrerId,
    });

    // Process referral if applicable
    let referralBonusApplied = false;
    let bonusPoints = 0;
    if (referrerId) {
      await processReferralSignUp(referralCode!, user._id!.toString(), email);
      referralBonusApplied = true;
      bonusPoints = 50; // Sign-up bonus
    }

    const token = signAuthToken(user._id!.toString());
    const authUser = buildAuthUser(user);

    res.status(201).json({
      token,
      user: authUser,
      referralBonusApplied,
      bonusPoints,
    } satisfies AuthResponseDTO & {
      referralBonusApplied: boolean;
      bonusPoints: number;
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * POST /api/users/login
 * Authenticate an existing user and return a token.
 */
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginDTO;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordHash",
    );

    if (!user || !user.passwordHash) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signAuthToken(user._id!.toString());

    res.json({
      token,
      user: buildAuthUser(user),
    } satisfies AuthResponseDTO);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * POST /api/users/sync-profile
 * Sync user profile from Supabase after OAuth/email signup.
 * Verifies the Supabase token and upserts the user into MongoDB.
 *
 * Request body:
 * {
 *   "supabaseToken": "jwt_token_from_supabase",
 *   "fullName": "John Doe"
 * }
 */
router.post(
  "/sync-profile",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { supabaseToken, fullName } = req.body;

      if (!supabaseToken) {
        res.status(400).json({ error: "supabaseToken is required" });
        return;
      }

      // Verify Supabase token
      const supabaseUser = await verifySupabaseToken(supabaseToken);
      if (!supabaseUser) {
        res.status(401).json({ error: "Invalid or expired Supabase token" });
        return;
      }

      const { userId: supabaseId } = supabaseUser;
      const supabaseEmail = supabaseUser.email.trim().toLowerCase();
      const email = supabaseEmail || buildSupabaseFallbackEmail(supabaseId);
      const requestFullName =
        typeof fullName === "string" ? fullName : undefined;
      const incomingFullName =
        normalizeProfileName(requestFullName) ||
        normalizeProfileName(supabaseUser.fullName);
      const resolvedFullName =
        incomingFullName || email.split("@")[0] || "SkyX User";

      if (User.db.readyState !== 1) {
        res.json({
          token: signAuthToken(supabaseId),
          user: buildSupabaseOnlyAuthUser(supabaseId, email, resolvedFullName),
          profileSynced: false,
        } satisfies AuthResponseDTO & { profileSynced: boolean });
        return;
      }

      // Check if user already exists by email or supabaseId
      let user = await User.findOne({
        $or: [{ email }, { supabaseId }],
      });

      if (user) {
        // Update existing user with Supabase ID if not already set
        if (!user.supabaseId) {
          user.supabaseId = supabaseId;
        }
        if (
          supabaseEmail &&
          user.email.endsWith("@supabase.local") &&
          user.email !== supabaseEmail
        ) {
          user.email = supabaseEmail;
        }
        if (incomingFullName) {
          user.fullName = incomingFullName;
        }
        user.lastLoginAt = new Date();
        await user.save();
      } else {
        // Create new user
        const newReferralCode = generateReferralCode(email);
        user = await User.create({
          email,
          fullName: resolvedFullName,
          supabaseId,
          referralCode: newReferralCode,
          points: 0,
          totalPointsEarned: 0,
          tierLevel: 1,
          isActive: true,
          lastLoginAt: new Date(),
        });
      }

      const token = signAuthToken(user._id!.toString());

      res.json({
        token,
        user: buildAuthUser(user),
      } satisfies AuthResponseDTO);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

/**
 * GET /api/users/profile
 * Get current user's full profile with stats
 *
 * Response:
 * {
 *   "user": { ... user data ... },
 *   "stats": {
 *     "totalPoints": 1250,
 *     "pointsThisMonth": 350,
 *     "completedTasks": 5,
 *     "activeReferrals": 3,
 *     "referralEarnings": 200,
 *     "gameEarnings": 150
 *   },
 *   "nextMilestone": {
 *     "pointsRequired": 5000,
 *     "pointsRemaining": 3750,
 *     "tier": 3
 *   },
 *   "referralCode": "SKYAB12XY",
 *   "leaderboardRank": 42,
 *   "recentTransactions": [ ... ]
 * }
 */
router.get(
  "/profile",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Get stats
      const taskStats = await getUserTaskStats(req.userId!);
      const gameStats = await getUserGameStats(req.userId!);
      const referralStats = await getReferrerStats(req.userId!);

      // Get points this month
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const pointsThisMonth = await RewardTransaction.aggregate([
        {
          $match: {
            userId: req.userId,
            createdAt: { $gte: monthStart, $lte: monthEnd },
            isProcessed: true,
          },
        },
        { $group: { _id: null, total: { $sum: "$pointsAmount" } } },
      ]);

      // Get leaderboard rank
      const leaderboardRank =
        (await User.countDocuments({
          isActive: true,
          totalPointsEarned: { $gt: user.totalPointsEarned },
        })) + 1;

      // Get tier milestone
      const tierMilestones: Record<number, number> = {
        1: 1000,
        2: 5000,
        3: 15000,
        4: 50000,
        5: 999999,
      };
      const nextTier = user.tierLevel + 1;
      const pointsRequired = tierMilestones[nextTier] || tierMilestones[5];
      const pointsRemaining = Math.max(
        0,
        pointsRequired - user.totalPointsEarned,
      );

      // Get recent transactions
      const recentTransactions = await RewardTransaction.find({
        userId: req.userId,
      })
        .sort({ createdAt: -1 })
        .limit(10);

      const profile: IProfileSummary = {
        user: user.toObject(),
        stats: {
          totalPoints: user.points,
          pointsThisMonth: pointsThisMonth[0]?.total || 0,
          completedTasks: taskStats.approved,
          activeReferrals: referralStats.activeReferrals,
          referralEarnings: referralStats.totalReferralEarnings,
          gameEarnings: gameStats.totalPointsEarned,
        },
        nextMilestone: {
          pointsRequired,
          pointsRemaining,
          tier: nextTier,
        },
        recentTransactions: recentTransactions.map((tx) => tx.toObject()),
        referralCode: user.referralCode,
        leaderboardRank,
      };

      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

/**
 * GET /api/users/:userId
 * Get public profile of another user
 *
 * Response:
 * {
 *   "id": "507f1f77bcf86cd799439011",
 *   "fullName": "John Doe",
 *   "profileImage": "https://...",
 *   "bio": "Web3 enthusiast",
 *   "totalPointsEarned": 1250,
 *   "tierLevel": 2,
 *   "joinedAt": "2024-01-15T10:00:00Z",
 *   "completedTasksCount": 5,
 *   "gameWinsCount": 12
 * }
 */
router.get("/:userId", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.userId).select(
      "fullName profileImage bio totalPointsEarned tierLevel createdAt",
    );

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const taskStats = await getUserTaskStats(req.params.userId);
    const gameStats = await getUserGameStats(req.params.userId);

    res.json({
      id: user._id.toString(),
      fullName: user.fullName,
      profileImage: user.profileImage,
      bio: user.bio,
      totalPointsEarned: user.totalPointsEarned,
      tierLevel: user.tierLevel,
      joinedAt: user.createdAt,
      completedTasksCount: taskStats.approved,
      gameWinsCount: gameStats.totalSessions,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ============ REFERRAL ENDPOINTS ============

/**
 * GET /api/users/referrals/code
 * Get own referral code
 */
router.get(
  "/referrals/code",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.userId).select("referralCode");
      res.json({ referralCode: user?.referralCode });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

/**
 * GET /api/users/referrals/stats
 * Get referral stats and active referrals
 *
 * Response:
 * {
 *   "totalReferrals": 5,
 *   "activeReferrals": 3,
 *   "completedReferrals": 2,
 *   "totalReferralEarnings": 350,
 *   "referrals": [
 *     {
 *       "id": "507f1f77bcf86cd799439012",
 *       "refereeId": {...},
 *       "status": "active",
 *       "createdAt": "2024-01-10T10:00:00Z",
 *       "rewardPoints": 50
 *     }
 *   ]
 * }
 */
router.get(
  "/referrals/stats",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const stats = await getReferrerStats(req.userId!);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

// ============ LEADERBOARD ============

/**
 * GET /api/leaderboard?limit=100
 * Get global leaderboard
 *
 * Response:
 * {
 *   "leaderboard": [
 *     {
 *       "rank": 1,
 *       "userId": "507f1f77bcf86cd799439011",
 *       "fullName": "Jane Doe",
 *       "profileImage": "https://...",
 *       "points": 5250,
 *       "tierLevel": 3,
 *       "referralCount": 7
 *     }
 *   ]
 * }
 */
router.get(
  "/leaderboard",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
      const leaderboard = await getLeaderboard(limit);
      res.json({ leaderboard });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

/**
 * GET /api/leaderboard/context?contextSize=5
 * Get current user's rank with nearby competitors
 */
router.get(
  "/leaderboard/context",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const contextSize = Math.min(
        parseInt(req.query.contextSize as string) || 5,
        25,
      );
      const context = await getUserLeaderboardContext(req.userId!, contextSize);
      res.json(context);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

export default router;
