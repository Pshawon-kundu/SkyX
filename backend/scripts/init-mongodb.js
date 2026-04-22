/**
 * MongoDB Initialization Script
 * Creates indexes and collections on first run
 * Runs automatically in Docker or manually for local dev
 */

// Database name
db = db.getSiblingDB("skyx");

// Create collections if they don't exist
print("Creating collections...");

// Users collection
db.createCollection("users");
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ referralCode: 1 }, { unique: true });
db.users.createIndex({ totalPointsEarned: -1 }); // For leaderboard
db.users.createIndex({ createdAt: -1 });
print("✓ Users collection created");

// Referrals collection
db.createCollection("referrals");
db.referrals.createIndex({ referrerId: 1, status: 1 });
db.referrals.createIndex({ refereeId: 1 });
db.referrals.createIndex({ referralCode: 1 });
db.referrals.createIndex({ createdAt: -1 });
print("✓ Referrals collection created");

// Tasks collection
db.createCollection("tasks");
db.tasks.createIndex({ taskType: 1, isActive: 1 });
db.tasks.createIndex({ createdAt: -1 });
print("✓ Tasks collection created");

// TaskCompletions collection
db.createCollection("taskcompletions");
db.taskcompletions.createIndex({ userId: 1, taskId: 1 }, { unique: true });
db.taskcompletions.createIndex({ userId: 1, verificationStatus: 1 });
db.taskcompletions.createIndex({ verificationStatus: 1 });
db.taskcompletions.createIndex({ completedAt: -1 });
print("✓ TaskCompletions collection created");

// GameSessions collection
db.createCollection("gamesessions");
db.gamesessions.createIndex({ userId: 1, completedAt: 1 });
db.gamesessions.createIndex({ gameType: 1, pointsEarned: -1 });
db.gamesessions.createIndex({ startedAt: -1 });
print("✓ GameSessions collection created");

// RewardTransactions collection
db.createCollection("rewardtransactions");
db.rewardtransactions.createIndex({ userId: 1, createdAt: -1 });
db.rewardtransactions.createIndex({ rewardType: 1, isProcessed: 1 });
db.rewardtransactions.createIndex({ createdAt: -1 });
print("✓ RewardTransactions collection created");

print("\n✓ MongoDB initialization completed!");
