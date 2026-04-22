/**
 * Points & Referral Business Logic
 * Core calculations and reward systems for SkyX
 */

import {
  User,
  Referral,
  RewardTransaction,
  Task,
  TaskCompletion,
  GameSession,
} from "../models/index";
import { RewardType, ReferralStatus, IRewardTransaction } from "../types/index";

// ============ POINT CALCULATION ============

/**
 * Tier levels based on total points earned
 * Tier 1: 0 - 999
 * Tier 2: 1000 - 4999
 * Tier 3: 5000 - 14999
 * Tier 4: 15000 - 49999
 * Tier 5: 50000+
 */
export const getTierLevel = (totalPointsEarned: number): number => {
  if (totalPointsEarned >= 50000) return 5;
  if (totalPointsEarned >= 15000) return 4;
  if (totalPointsEarned >= 5000) return 3;
  if (totalPointsEarned >= 1000) return 2;
  return 1;
};

/**
 * Calculate tier multiplier for bonus points
 * Higher tier = higher multiplier for future earnings
 */
export const getTierMultiplier = (tierLevel: number): number => {
  const multipliers: Record<number, number> = {
    1: 1.0,
    2: 1.1,
    3: 1.25,
    4: 1.5,
    5: 2.0,
  };
  return multipliers[tierLevel] || 1.0;
};

/**
 * Award points to user for a reward type
 * Applies tier multiplier and stores transaction record
 */
export const awardPoints = async (
  userId: string,
  pointsAmount: number,
  rewardType: RewardType,
  description: string,
  sourceId?: string,
): Promise<IRewardTransaction> => {
  const user = await User.findById(userId);
  if (!user) throw new Error(`User ${userId} not found`);

  const tierMultiplier = getTierMultiplier(user.tierLevel);
  const adjustedPoints = Math.floor(pointsAmount * tierMultiplier);

  // Update user points
  user.points += adjustedPoints;
  user.totalPointsEarned += adjustedPoints;

  // Update tier if necessary
  const newTier = getTierLevel(user.totalPointsEarned);
  if (newTier !== user.tierLevel) {
    user.tierLevel = newTier;
  }

  await user.save();

  // Create transaction record
  const transaction = await RewardTransaction.create({
    userId,
    rewardType,
    pointsAmount: adjustedPoints,
    sourceId,
    description,
    isProcessed: true,
    processedAt: new Date(),
  });

  return transaction;
};

/**
 * Deduct points from user (for penalties or refunds)
 */
export const deductPoints = async (
  userId: string,
  pointsAmount: number,
  reason: string,
): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) throw new Error(`User ${userId} not found`);

  const deductAmount = Math.min(pointsAmount, user.points);
  user.points -= deductAmount;
  await user.save();

  await RewardTransaction.create({
    userId,
    rewardType: RewardType.ADJUSTMENT,
    pointsAmount: -deductAmount,
    description: `Deduction: ${reason}`,
    isProcessed: true,
    processedAt: new Date(),
  });
};

/**
 * Get user's point earnings for a specific period (e.g., this month)
 */
export const getPointsInPeriod = async (
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<number> => {
  const transactions = await RewardTransaction.find({
    userId,
    createdAt: { $gte: startDate, $lte: endDate },
    isProcessed: true,
  });

  return transactions.reduce((sum, tx) => sum + tx.pointsAmount, 0);
};

// ============ REFERRAL LOGIC ============

const REFERRAL_SIGN_UP_BONUS = 50; // Points awarded to referrer when referees sign up
const REFERRAL_INVESTMENT_BONUS = 200; // Additional points when referee invests
const REFERRAL_SELF_CHECK_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Generate unique referral code
 * Format: SKYUSER{USERID}{RANDOM}
 */
export const generateReferralCode = (userId: string): string => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SKY${userId.toString().slice(-6).toUpperCase()}${random}`.substring(
    0,
    12,
  );
};

/**
 * Prevent self-referral by checking cooldown
 * Returns true if user is attempting self-referral
 */
export const isSelfReferralAttempt = async (
  referralCode: string,
  newUserEmail: string,
  now: Date,
): Promise<boolean> => {
  const referrer = await User.findOne({ referralCode });
  if (!referrer) return false;

  // Check if referrer email matches new user email
  if (referrer.email === newUserEmail) return true;

  // Check if there's a recent referral attempt from same IP/user
  // (In production, add IP tracking or rate limiting)

  return false;
};

/**
 * Process new user signup with referral
 * 1. Award sign-up bonus to referrer
 * 2. Create referral record
 * 3. Link referee to referrer
 */
export const processReferralSignUp = async (
  referralCode: string,
  newUserId: string,
  refereeEmail: string,
): Promise<string> => {
  const referrer = await User.findOne({ referralCode });
  if (!referrer) throw new Error("Invalid referral code");

  const referee = await User.findById(newUserId);
  if (!referee) throw new Error("New user not found");

  // Prevent duplicate referral records
  const existingReferral = await Referral.findOne({
    refereeId: newUserId,
    status: { $ne: ReferralStatus.REJECTED },
  });

  if (existingReferral) throw new Error("User already has an active referral");

  // Create referral record
  const referral = await Referral.create({
    referrerId: referrer._id,
    refereeId: newUserId,
    referralCode,
    refereeEmail,
    status: ReferralStatus.ACTIVE,
    signUpBonusAwarded: false,
  });

  // Award sign-up bonus to referrer
  const description = `Sign-up bonus for referral from ${refereeEmail}`;
  await awardPoints(
    referrer._id!.toString(),
    REFERRAL_SIGN_UP_BONUS,
    RewardType.REFERRAL_SIGN_UP,
    description,
    referral._id?.toString(),
  );

  // Update referral status and mark bonus as awarded
  referral.signUpBonusAwarded = true;
  referral.acceptedAt = new Date();
  await referral.save();

  // Update referee's referredBy field
  referee.referredBy = referrer._id;
  await referee.save();

  return referral._id!.toString();
};

/**
 * Track referee investment and award investment bonus
 */
export const recordRefereeInvestment = async (
  referralId: string,
  investmentAmount: number,
): Promise<{ referralCompleted: boolean; bonusAwarded: number }> => {
  const referral = await Referral.findById(referralId);
  if (!referral) throw new Error("Referral not found");

  referral.currentInvestment += investmentAmount;

  // Check if investment threshold met
  let bonusAwarded = 0;
  if (
    referral.currentInvestment >= referral.investmentThreshold &&
    !referral.completedAt
  ) {
    referral.status = ReferralStatus.COMPLETED;
    referral.completedAt = new Date();

    // Award investment bonus to referrer
    bonusAwarded = REFERRAL_INVESTMENT_BONUS;
    const description = `Investment bonus: refereed user invested $${investmentAmount}`;
    await awardPoints(
      referral.referrerId.toString(),
      bonusAwarded,
      RewardType.REFERRAL_INVESTMENT,
      description,
      referralId,
    );

    referral.rewardPoints += bonusAwarded;
  }

  await referral.save();

  return {
    referralCompleted: referral.status === ReferralStatus.COMPLETED,
    bonusAwarded,
  };
};

/**
 * Get all active referrals for a user (people they referred)
 */
export const getReferrerStats = async (userId: string) => {
  const referrals = await Referral.find({ referrerId: userId })
    .populate("refereeId", "fullName email profileImage")
    .sort({ createdAt: -1 });

  const stats = {
    totalReferrals: referrals.length,
    activeReferrals: referrals.filter((r) => r.status === ReferralStatus.ACTIVE)
      .length,
    completedReferrals: referrals.filter(
      (r) => r.status === ReferralStatus.COMPLETED,
    ).length,
    totalReferralEarnings: referrals.reduce(
      (sum, r) => sum + r.rewardPoints,
      0,
    ),
    referrals,
  };

  return stats;
};

// ============ LEADERBOARD ============

/**
 * Get global leaderboard (top 100 users by total points)
 */
export const getLeaderboard = async (limit: number = 100) => {
  const users = await User.find({ isActive: true })
    .sort({ totalPointsEarned: -1 })
    .limit(limit)
    .select("fullName profileImage totalPointsEarned tierLevel");

  // Add referral count and rank
  const leaderboard = await Promise.all(
    users.map(async (user, index) => ({
      rank: index + 1,
      userId: user._id.toString(),
      fullName: user.fullName,
      profileImage: user.profileImage,
      points: user.totalPointsEarned,
      tierLevel: user.tierLevel,
      referralCount: await Referral.countDocuments({
        referrerId: user._id,
        status: ReferralStatus.COMPLETED,
      }),
    })),
  );

  return leaderboard;
};

/**
 * Get user's leaderboard rank and nearby competitors
 */
export const getUserLeaderboardContext = async (
  userId: string,
  contextSize: number = 5,
) => {
  const user = await User.findById(userId).select("totalPointsEarned");
  if (!user) throw new Error("User not found");

  // Find rank
  const rank = await User.countDocuments({
    isActive: true,
    totalPointsEarned: { $gt: user.totalPointsEarned },
  });

  // Get nearby users
  const nearby = await User.find({ isActive: true })
    .sort({ totalPointsEarned: -1 })
    .skip(Math.max(0, rank - contextSize))
    .limit(contextSize * 2 + 1)
    .select("fullName profileImage totalPointsEarned tierLevel");

  return {
    userRank: rank + 1,
    userPoints: user.totalPointsEarned,
    nearbyUsers: nearby.map((u, idx) => ({
      rank: rank + 1 - contextSize + idx,
      fullName: u.fullName,
      profileImage: u.profileImage,
      points: u.totalPointsEarned,
      tierLevel: u.tierLevel,
      isCurrentUser: u._id.toString() === userId,
    })),
  };
};

// ============ VALIDATION ============

/**
 * Validate referral code format and existence
 */
export const isValidReferralCode = async (code: string): Promise<boolean> => {
  if (!code || code.length < 8 || code.length > 12) return false;
  const user = await User.findOne({ referralCode: code });
  return !!user;
};

/**
 * Check if referral would violate any rules
 */
export const validateReferral = async (
  referralCode: string,
  newUserEmail: string,
  now: Date,
): Promise<{ valid: boolean; error?: string }> => {
  // Check code validity
  if (!(await isValidReferralCode(referralCode))) {
    return { valid: false, error: "Invalid referral code" };
  }

  // Check self-referral
  if (await isSelfReferralAttempt(referralCode, newUserEmail, now)) {
    return { valid: false, error: "Cannot use own referral code" };
  }

  // Check duplicate signup with same referral
  const existingSignup = await User.findOne({
    email: newUserEmail,
    referredBy: { $ne: null },
  });

  if (existingSignup) {
    return { valid: false, error: "User already signed up with referral" };
  }

  return { valid: true };
};
