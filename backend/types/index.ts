/**
 * SkyX Backend Type Definitions
 * Core entities and interfaces for user profile & referral system
 */

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  MODERATOR = "moderator",
}

export enum TaskType {
  SURVEY = "survey",
  VERIFICATION = "verification",
  CONTENT_CREATION = "content_creation",
  SOCIAL_SHARE = "social_share",
  REFERRAL_MILESTONE = "referral_milestone",
  STAKING = "staking",
}

export enum RewardType {
  TASK_COMPLETION = "task_completion",
  GAME_WINNINGS = "game_winnings",
  REFERRAL_SIGN_UP = "referral_sign_up",
  REFERRAL_INVESTMENT = "referral_investment",
  MILESTONE_BONUS = "milestone_bonus",
  LEADERBOARD_BONUS = "leaderboard_bonus",
  ADJUSTMENT = "adjustment",
}

export enum ReferralStatus {
  PENDING = "pending",
  ACTIVE = "active",
  COMPLETED = "completed",
  REJECTED = "rejected",
}

export interface IUser {
  _id?: string;
  email: string;
  fullName: string;
  passwordHash?: string;
  referralCode: string;
  referredBy?: string; // User ID of the referrer
  profileImage?: string;
  bio?: string;
  role: UserRole;
  points: number;
  totalPointsEarned: number;
  tierLevel: number; // 1-5 based on total points
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastLoginAt?: Date;
  kycStatus?: "pending" | "verified" | "rejected";
  walletAddress?: string;
}

export interface IReferral {
  _id?: string;
  referrerId: string; // User who referred
  refereeId?: string; // User who was referred (null until signup)
  referralCode: string;
  refereeEmail?: string; // Email used during signup
  status: ReferralStatus;
  signUpBonusAwarded: boolean;
  investmentThreshold: number; // Target investment to unlock full reward
  currentInvestment: number;
  rewardPoints: number;
  createdAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
}

export interface ITask {
  _id?: string;
  title: string;
  description: string;
  taskType: TaskType;
  pointsReward: number;
  isActive: boolean;
  maxCompletionsPerUser: number;
  estimatedDurationMinutes: number;
  metadata?: Record<string, any>; // Flexible metadata (e.g., survey URL, social share text)
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskCompletion {
  _id?: string;
  userId: string;
  taskId: string;
  completedAt: Date;
  proofUrl?: string; // Screenshot, link, etc.
  verificationStatus: "pending" | "approved" | "rejected";
  verifiedBy?: string; // Admin user ID
  verifiedAt?: Date;
  pointsAwarded: number;
  notes?: string;
}

export interface IGameSession {
  _id?: string;
  userId: string;
  gameType: string; // e.g., 'quiz', 'prediction', 'trivia'
  startedAt: Date;
  completedAt?: Date;
  score: number;
  pointsEarned: number;
  difficulty: "easy" | "medium" | "hard";
  metadata?: Record<string, any>;
}

export interface IRewardTransaction {
  _id?: string;
  userId: string;
  rewardType: RewardType;
  pointsAmount: number;
  sourceId?: string; // Task ID, Game Session ID, Referral ID, etc.
  description: string;
  createdAt: Date;
  isProcessed: boolean;
  processedAt?: Date;
}

export interface ILeaderboardEntry {
  userId: string;
  fullName: string;
  profileImage?: string;
  points: number;
  tierLevel: number;
  referralCount: number;
  rank: number;
}

export interface IProfileSummary {
  user: IUser;
  stats: {
    totalPoints: number;
    pointsThisMonth: number;
    completedTasks: number;
    activeReferrals: number;
    referralEarnings: number;
    gameEarnings: number;
  };
  nextMilestone: {
    pointsRequired: number;
    pointsRemaining: number;
    tier: number;
  };
  recentTransactions: IRewardTransaction[];
  referralCode: string;
  leaderboardRank: number;
}

// Request/Response DTOs
export interface CreateUserDTO {
  email: string;
  fullName: string;
  password?: string;
  referralCode?: string;
  walletAddress?: string;
}

export interface CompleteTaskDTO {
  taskId: string;
  proofUrl?: string;
}

export interface CreateGameSessionDTO {
  gameType: string;
  difficulty: "easy" | "medium" | "hard";
  score: number;
}

export interface ReferralRewardClaimDTO {
  referralId: string;
}
