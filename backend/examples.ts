/**
 * API Examples & Request/Response Payloads
 * Complete reference for all SkyX backend endpoints
 */

// ============ AUTHENTICATION SETUP ============
/*
 * All requests require auth headers:
 * x-user-id: MongoDB user ID (e.g., "507f1f77bcf86cd799439011")
 * x-user-role: "user", "admin", or "moderator"
 *
 * In production: Use JWT token in Authorization header
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

// ============ USER REGISTRATION ============

export const USER_REGISTRATION_EXAMPLE = {
  request: {
    method: "POST",
    url: "/api/users/register",
    body: {
      email: "alice@skyxventures.com",
      fullName: "Alice Johnson",
      password: "SecurePass123!",
      referralCode: "SKYXYZ12AB", // optional
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc369e8e27d037", // optional
    },
  },

  response_success: {
    status: 201,
    body: {
      user: {
        id: "507f1f77bcf86cd799439011",
        email: "alice@skyxventures.com",
        fullName: "Alice Johnson",
        referralCode: "SKYJ01N1AB",
        points: 0,
        tierLevel: 1,
        createdAt: "2024-01-15T10:00:00Z",
      },
      referralBonusApplied: true,
      bonusPoints: 50,
    },
  },

  response_error: {
    status: 409,
    body: {
      error: "Email already registered",
    },
  },
};

// ============ USER PROFILE ============

export const USER_PROFILE_EXAMPLE = {
  request: {
    method: "GET",
    url: "/api/users/profile",
    headers: {
      "x-user-id": "507f1f77bcf86cd799439011",
    },
  },

  response: {
    status: 200,
    body: {
      user: {
        _id: "507f1f77bcf86cd799439011",
        email: "alice@skyxventures.com",
        fullName: "Alice Johnson",
        referralCode: "SKYJ01N1AB",
        profileImage: "https://cdn.skyxventures.com/profiles/alice.jpg",
        bio: "Web3 enthusiast & early SkyX supporter",
        role: "user",
        points: 1250,
        totalPointsEarned: 2500,
        tierLevel: 2,
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc369e8e27d037",
        isActive: true,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-22T14:30:00Z",
      },
      stats: {
        totalPoints: 1250,
        pointsThisMonth: 350,
        completedTasks: 5,
        activeReferrals: 3,
        referralEarnings: 200,
        gameEarnings: 150,
      },
      nextMilestone: {
        pointsRequired: 5000,
        pointsRemaining: 2500,
        tier: 3,
      },
      referralCode: "SKYJ01N1AB",
      leaderboardRank: 42,
      recentTransactions: [
        {
          _id: "507f1f77bcf86cd799439015",
          userId: "507f1f77bcf86cd799439011",
          rewardType: "task_completion",
          pointsAmount: 50,
          description: "Task completion: Complete KYC Verification",
          createdAt: "2024-01-22T14:00:00Z",
          isProcessed: true,
        },
        {
          _id: "507f1f77bcf86cd799439016",
          userId: "507f1f77bcf86cd799439011",
          rewardType: "game_winnings",
          pointsAmount: 42,
          description: "Game session: quiz (hard, score: 85%)",
          createdAt: "2024-01-22T13:30:00Z",
          isProcessed: true,
        },
      ],
    },
  },
};

// ============ REFERRAL SIGNUP ============

export const REFERRAL_SIGNUP_FLOW = {
  step_1_validate_code: {
    request: {
      method: "POST",
      url: "/api/users/register",
      body: {
        email: "bob@example.com",
        fullName: "Bob Smith",
        password: "SecurePass456!",
        referralCode: "SKYJ01N1AB", // Alice's referral code
      },
    },
    response: {
      status: 201,
      body: {
        user: {
          id: "507f1f77bcf86cd799439012",
          email: "bob@example.com",
          fullName: "Bob Smith",
          referralCode: "SKYB0B2CD",
          points: 50, // Sign-up bonus
          tierLevel: 1,
          createdAt: "2024-01-23T11:00:00Z",
        },
        referralBonusApplied: true,
        bonusPoints: 50,
      },
    },
  },

  step_2_alice_referral_stats: {
    request: {
      method: "GET",
      url: "/api/users/referrals/stats",
      headers: {
        "x-user-id": "507f1f77bcf86cd799439011", // Alice
      },
    },
    response: {
      status: 200,
      body: {
        totalReferrals: 4,
        activeReferrals: 3,
        completedReferrals: 1,
        totalReferralEarnings: 250,
        referrals: [
          {
            _id: "507f1f77bcf86cd799439020",
            referrerId: "507f1f77bcf86cd799439011",
            refereeId: "507f1f77bcf86cd799439012", // Bob
            referralCode: "SKYJ01N1AB",
            status: "active",
            signUpBonusAwarded: true,
            investmentThreshold: 1000,
            currentInvestment: 0,
            rewardPoints: 50,
            createdAt: "2024-01-23T11:00:00Z",
            acceptedAt: "2024-01-23T11:00:00Z",
          },
        ],
      },
    },
  },
};

// ============ TASKS ============

export const TASKS_EXAMPLE = {
  list_tasks: {
    request: {
      method: "GET",
      url: "/api/tasks?type=survey&limit=10",
    },
    response: {
      status: 200,
      body: {
        tasks: [
          {
            _id: "507f1f77bcf86cd799439021",
            title: "Complete KYC Verification",
            description: "Verify your identity to unlock full platform access",
            taskType: "verification",
            pointsReward: 100,
            estimatedDurationMinutes: 10,
            createdAt: "2024-01-10T10:00:00Z",
          },
          {
            _id: "507f1f77bcf86cd799439022",
            title: "Web3 Knowledge Survey",
            description: "Share your Web3 experience and preferences",
            taskType: "survey",
            pointsReward: 50,
            estimatedDurationMinutes: 5,
            createdAt: "2024-01-12T09:30:00Z",
          },
        ],
        total: 24,
      },
    },
  },

  get_task_detail: {
    request: {
      method: "GET",
      url: "/api/tasks/507f1f77bcf86cd799439021",
    },
    response: {
      status: 200,
      body: {
        _id: "507f1f77bcf86cd799439021",
        title: "Complete KYC Verification",
        description: "Verify your identity to unlock full platform access",
        taskType: "verification",
        pointsReward: 100,
        isActive: true,
        maxCompletionsPerUser: 1,
        estimatedDurationMinutes: 10,
        metadata: {
          kycProvider: "Stripe Identity",
          requiredFields: ["firstName", "lastName", "dateOfBirth", "address"],
        },
        createdAt: "2024-01-10T10:00:00Z",
      },
    },
  },

  submit_task: {
    request: {
      method: "POST",
      url: "/api/tasks/507f1f77bcf86cd799439022/submit",
      headers: {
        "x-user-id": "507f1f77bcf86cd799439012", // Bob
      },
      body: {
        proofUrl: "https://example.com/survey-completion-certificate.pdf",
      },
    },
    response: {
      status: 200,
      body: {
        completionId: "507f1f77bcf86cd799439030",
        status: "pending",
        message: "Task submitted for review",
      },
    },
  },

  get_my_tasks: {
    request: {
      method: "GET",
      url: "/api/tasks/completions/my-tasks",
      headers: {
        "x-user-id": "507f1f77bcf86cd799439012",
      },
    },
    response: {
      status: 200,
      body: {
        totalSubmitted: 3,
        approved: 2,
        pending: 1,
        rejected: 0,
        totalPointsEarned: 150,
        completions: [
          {
            _id: "507f1f77bcf86cd799439030",
            userId: "507f1f77bcf86cd799439012",
            taskId: "507f1f77bcf86cd799439022",
            verificationStatus: "pending",
            pointsAwarded: 0,
            completedAt: "2024-01-23T14:00:00Z",
            createdAt: "2024-01-23T14:00:00Z",
          },
        ],
      },
    },
  },
};

// ============ GAMES ============

export const GAMES_EXAMPLE = {
  start_game: {
    request: {
      method: "POST",
      url: "/api/games/start",
      headers: {
        "x-user-id": "507f1f77bcf86cd799439012",
      },
      body: {
        gameType: "web3_quiz",
        difficulty: "hard",
      },
    },
    response: {
      status: 201,
      body: {
        sessionId: "507f1f77bcf86cd799439031",
        gameType: "web3_quiz",
        difficulty: "hard",
        startedAt: "2024-01-23T14:30:00Z",
      },
    },
  },

  complete_game: {
    request: {
      method: "POST",
      url: "/api/games/507f1f77bcf86cd799439031/complete",
      headers: {
        "x-user-id": "507f1f77bcf86cd799439012",
      },
      body: {
        score: 85, // 85% correct
      },
    },
    response: {
      status: 200,
      body: {
        message: "Game completed",
        score: 85,
        pointsEarned: 42,
        newTotalPoints: 1292,
      },
    },
  },

  game_leaderboard: {
    request: {
      method: "GET",
      url: "/api/games/web3_quiz/leaderboard?limit=10",
    },
    response: {
      status: 200,
      body: {
        leaderboard: [
          {
            rank: 1,
            user: {
              id: "507f1f77bcf86cd799439001",
              fullName: "Jane Doe",
              profileImage: "https://cdn.skyxventures.com/profiles/jane.jpg",
            },
            score: 98,
            pointsEarned: 59,
            difficulty: "hard",
            completedAt: "2024-01-23T13:00:00Z",
          },
        ],
      },
    },
  },
};

// ============ LEADERBOARD ============

export const LEADERBOARD_EXAMPLE = {
  global_leaderboard: {
    request: {
      method: "GET",
      url: "/api/leaderboard?limit=5",
    },
    response: {
      status: 200,
      body: {
        leaderboard: [
          {
            rank: 1,
            userId: "507f1f77bcf86cd799439001",
            fullName: "Jane Doe",
            profileImage: "https://cdn.skyxventures.com/profiles/jane.jpg",
            points: 8500,
            tierLevel: 4,
            referralCount: 12,
          },
          {
            rank: 2,
            userId: "507f1f77bcf86cd799439011",
            fullName: "Alice Johnson",
            profileImage: "https://cdn.skyxventures.com/profiles/alice.jpg",
            points: 2500,
            tierLevel: 2,
            referralCount: 3,
          },
        ],
      },
    },
  },

  leaderboard_context: {
    request: {
      method: "GET",
      url: "/api/leaderboard/context?contextSize=5",
      headers: {
        "x-user-id": "507f1f77bcf86cd799439011", // Alice
      },
    },
    response: {
      status: 200,
      body: {
        userRank: 42,
        userPoints: 2500,
        nearbyUsers: [
          {
            rank: 40,
            fullName: "Charlie Brown",
            profileImage: "https://cdn.skyxventures.com/profiles/charlie.jpg",
            points: 2600,
            tierLevel: 2,
            isCurrentUser: false,
          },
          {
            rank: 41,
            fullName: "David Wong",
            profileImage: "https://cdn.skyxventures.com/profiles/david.jpg",
            points: 2550,
            tierLevel: 2,
            isCurrentUser: false,
          },
          {
            rank: 42,
            fullName: "Alice Johnson",
            profileImage: "https://cdn.skyxventures.com/profiles/alice.jpg",
            points: 2500,
            tierLevel: 2,
            isCurrentUser: true,
          },
          {
            rank: 43,
            fullName: "Eve Martinez",
            profileImage: "https://cdn.skyxventures.com/profiles/eve.jpg",
            points: 2450,
            tierLevel: 2,
            isCurrentUser: false,
          },
        ],
      },
    },
  },
};

// ============ ERROR RESPONSES ============

export const ERROR_EXAMPLES = {
  validation_error: {
    status: 400,
    body: {
      error: "Email, fullName, and password are required",
    },
  },

  auth_error: {
    status: 401,
    body: {
      error: "Unauthorized",
    },
  },

  forbidden_error: {
    status: 403,
    body: {
      error: "Admin role required",
    },
  },

  not_found_error: {
    status: 404,
    body: {
      error: "Task not found",
    },
  },

  conflict_error: {
    status: 409,
    body: {
      error: "Email already registered",
    },
  },

  server_error: {
    status: 500,
    body: {
      error: "Internal server error",
    },
  },
};
