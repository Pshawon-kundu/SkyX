/**
 * Database Seeding Script
 * Populates dev database with sample data
 * Usage: npm run migrate
 */

import mongoose from "mongoose";
import { User, Task, Referral, GameSession } from "../models/index";
import { generateReferralCode } from "../logic/points-and-referrals";
import { TaskType } from "../types/index";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/skyx";

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Task.deleteMany({});
    await Referral.deleteMany({});
    await GameSession.deleteMany({});
    console.log("✓ Cleared");

    // Create sample users
    console.log("Creating sample users...");
    const users = await User.insertMany([
      {
        email: "alice@skyxventures.com",
        fullName: "Alice Johnson",
        passwordHash: "hashed_password_1", // In production: bcrypt
        referralCode: generateReferralCode("user1"),
        points: 2500,
        totalPointsEarned: 5000,
        tierLevel: 3,
        role: "user",
        isActive: true,
        kycStatus: "verified",
      },
      {
        email: "bob@skyxventures.com",
        fullName: "Bob Smith",
        passwordHash: "hashed_password_2",
        referralCode: generateReferralCode("user2"),
        points: 1250,
        totalPointsEarned: 2500,
        tierLevel: 2,
        referredBy: undefined, // Will set this after users are created
        role: "user",
        isActive: true,
        kycStatus: "pending",
      },
      {
        email: "charlie@skyxventures.com",
        fullName: "Charlie Brown",
        passwordHash: "hashed_password_3",
        referralCode: generateReferralCode("user3"),
        points: 8500,
        totalPointsEarned: 15000,
        tierLevel: 4,
        role: "user",
        isActive: true,
        kycStatus: "verified",
      },
      {
        email: "admin@skyxventures.com",
        fullName: "Admin User",
        passwordHash: "hashed_password_admin",
        referralCode: generateReferralCode("admin"),
        points: 0,
        totalPointsEarned: 0,
        tierLevel: 1,
        role: "admin",
        isActive: true,
        kycStatus: "verified",
      },
    ]);

    console.log(`✓ Created ${users.length} users`);

    // Set Bob's referrer to Alice
    await User.updateOne({ _id: users[1]._id }, { referredBy: users[0]._id });

    // Create sample tasks
    console.log("Creating sample tasks...");
    const tasks = await Task.insertMany([
      {
        title: "Complete KYC Verification",
        description: "Verify your identity to unlock full platform access",
        taskType: TaskType.VERIFICATION,
        pointsReward: 100,
        isActive: true,
        maxCompletionsPerUser: 1,
        estimatedDurationMinutes: 10,
        metadata: {
          provider: "Stripe Identity",
          fields: ["firstName", "lastName", "dateOfBirth"],
        },
      },
      {
        title: "Web3 Knowledge Survey",
        description: "Share your experience with decentralized finance",
        taskType: TaskType.SURVEY,
        pointsReward: 50,
        isActive: true,
        maxCompletionsPerUser: 1,
        estimatedDurationMinutes: 5,
        metadata: {
          surveyUrl: "https://survey.example.com/web3",
        },
      },
      {
        title: "Share SkyX on Twitter",
        description: "Tweet about SkyX with #SkyXVentures",
        taskType: TaskType.SOCIAL_SHARE,
        pointsReward: 25,
        isActive: true,
        maxCompletionsPerUser: 3, // Can complete multiple times
        estimatedDurationMinutes: 2,
        metadata: {
          platform: "twitter",
          hashtag: "#SkyXVentures",
        },
      },
      {
        title: 'Create Content: "Why I love Web3"',
        description: "Write a blog post or article about your Web3 journey",
        taskType: TaskType.CONTENT_CREATION,
        pointsReward: 150,
        isActive: true,
        maxCompletionsPerUser: 1,
        estimatedDurationMinutes: 45,
        metadata: {
          minWordCount: 500,
          acceptedFormats: ["blog", "medium", "substack"],
        },
      },
    ]);

    console.log(`✓ Created ${tasks.length} tasks`);

    // Create sample referral
    console.log("Creating sample referral...");
    const referral = await Referral.create({
      referrerId: users[0]._id,
      refereeId: users[1]._id,
      referralCode: users[0].referralCode,
      status: "active",
      signUpBonusAwarded: true,
      investmentThreshold: 1000,
      currentInvestment: 0,
      rewardPoints: 50,
      acceptedAt: new Date(),
    });

    console.log("✓ Created referral");

    // Create sample game sessions
    console.log("Creating sample game sessions...");
    const gameSessions = await GameSession.insertMany([
      {
        userId: users[0]._id,
        gameType: "web3_quiz",
        difficulty: "hard",
        score: 85,
        pointsEarned: 42,
        startedAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        completedAt: new Date(),
      },
      {
        userId: users[2]._id,
        gameType: "web3_quiz",
        difficulty: "medium",
        score: 92,
        pointsEarned: 38,
        startedAt: new Date(Date.now() - 1000 * 60 * 3),
        completedAt: new Date(),
      },
    ]);

    console.log(`✓ Created ${gameSessions.length} game sessions`);

    console.log("\n✓ Database seeding completed successfully!");
    console.log("\nSample Users:");
    console.log(
      `- Alice (referrer): ${users[0].email}, code: ${users[0].referralCode}`,
    );
    console.log(
      `- Bob (referee): ${users[1].email}, code: ${users[1].referralCode}`,
    );
    console.log(`- Charlie: ${users[2].email}, code: ${users[2].referralCode}`);
    console.log(`- Admin: ${users[3].email}, code: ${users[3].referralCode}`);

    process.exit(0);
  } catch (error) {
    console.error("✗ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
