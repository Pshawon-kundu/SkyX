/**
 * SkyX Backend - Main Application
 * Express server configuration and initialization
 */

import "dotenv/config";
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./api/users";
import tasksGameRoutes from "./api/tasks-games";
import leaderboardRoutes from "./api/leaderboard";

const app: Express = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/skyx";

// ============ MIDDLEWARE ============

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============ ROUTES ============

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", tasksGameRoutes);
app.use("/api/games", tasksGameRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((error: any, req: Request, res: Response) => {
  console.error("Error:", error);
  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
});

// ============ DATABASE CONNECTION ============

export const connectDB = async (): Promise<void> => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✓ MongoDB connected");
  } catch (error) {
    console.warn("⚠ MongoDB connection failed:", error);
    console.warn("Continuing without MongoDB. API routes may be limited.");
  }
};

// ============ SERVER START ============

export const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ API docs available at http://localhost:${PORT}/api/docs`);
  });
};

// Start if run directly
if (require.main === module) {
  startServer();
}

export default app;
