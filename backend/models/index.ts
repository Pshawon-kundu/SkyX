/**
 * Mongoose Models for SkyX Backend
 * Database schema definitions for production use
 */

import mongoose, { Schema, Document } from "mongoose";
import {
  IUser,
  UserRole,
  IReferral,
  ReferralStatus,
  ITask,
  TaskType,
  ITaskCompletion,
  IGameSession,
  IRewardTransaction,
  RewardType,
} from "../types/index";

// ============ USER MODEL ============
const userSchema = new Schema<IUser & Document>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      // Optional if using OAuth
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    profileImage: String,
    bio: {
      type: String,
      maxlength: 500,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPointsEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    tierLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: Date,
    kycStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    walletAddress: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for query optimization
userSchema.index({ email: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ totalPointsEarned: -1 }); // For leaderboard

// ============ REFERRAL MODEL ============
const referralSchema = new Schema<IReferral & Document>(
  {
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    refereeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    referralCode: {
      type: String,
      required: true,
      index: true,
    },
    refereeEmail: String,
    status: {
      type: String,
      enum: Object.values(ReferralStatus),
      default: ReferralStatus.PENDING,
      index: true,
    },
    signUpBonusAwarded: {
      type: Boolean,
      default: false,
    },
    investmentThreshold: {
      type: Number,
      default: 1000, // e.g., $1000 USD
    },
    currentInvestment: {
      type: Number,
      default: 0,
    },
    rewardPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    acceptedAt: Date,
    completedAt: Date,
  },
  {
    timestamps: true,
  },
);

referralSchema.index({ referrerId: 1, status: 1 });
referralSchema.index({ refereeId: 1 });

// ============ TASK MODEL ============
const taskSchema = new Schema<ITask & Document>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    taskType: {
      type: String,
      enum: Object.values(TaskType),
      required: true,
      index: true,
    },
    pointsReward: {
      type: Number,
      required: true,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    maxCompletionsPerUser: {
      type: Number,
      default: 1,
      min: 1,
    },
    estimatedDurationMinutes: {
      type: Number,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// ============ TASK COMPLETION MODEL ============
const taskCompletionSchema = new Schema<ITaskCompletion & Document>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    proofUrl: String,
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: Date,
    pointsAwarded: {
      type: Number,
      default: 0,
    },
    notes: String,
    completedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    timestamps: true,
  },
);

// Unique compound index: one user can only complete a task once
taskCompletionSchema.index({ userId: 1, taskId: 1 }, { unique: true });

// ============ GAME SESSION MODEL ============
const gameSessionSchema = new Schema<IGameSession & Document>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    gameType: {
      type: String,
      required: true,
      index: true,
    },
    startedAt: {
      type: Date,
      default: () => new Date(),
    },
    completedAt: Date,
    score: {
      type: Number,
      default: 0,
    },
    pointsEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// ============ REWARD TRANSACTION MODEL ============
const rewardTransactionSchema = new Schema<IRewardTransaction & Document>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rewardType: {
      type: String,
      enum: Object.values(RewardType),
      required: true,
      index: true,
    },
    pointsAmount: {
      type: Number,
      required: true,
    },
    sourceId: {
      type: Schema.Types.ObjectId,
      // Can reference Task, GameSession, Referral, etc.
    },
    description: {
      type: String,
      required: true,
    },
    isProcessed: {
      type: Boolean,
      default: false,
      index: true,
    },
    processedAt: Date,
  },
  {
    timestamps: true,
  },
);

// Compound index for transaction queries
rewardTransactionSchema.index({ userId: 1, createdAt: -1 });
rewardTransactionSchema.index({ rewardType: 1, isProcessed: 1 });

// ============ EXPORT MODELS ============
export const User = mongoose.model<IUser & Document>("User", userSchema);
export const Referral = mongoose.model<IReferral & Document>(
  "Referral",
  referralSchema,
);
export const Task = mongoose.model<ITask & Document>("Task", taskSchema);
export const TaskCompletion = mongoose.model<ITaskCompletion & Document>(
  "TaskCompletion",
  taskCompletionSchema,
);
export const GameSession = mongoose.model<IGameSession & Document>(
  "GameSession",
  gameSessionSchema,
);
export const RewardTransaction = mongoose.model<IRewardTransaction & Document>(
  "RewardTransaction",
  rewardTransactionSchema,
);
