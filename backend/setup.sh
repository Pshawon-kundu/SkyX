#!/bin/bash

# SkyX Backend - Quick Start Guide
# Comprehensive setup and deployment instructions

echo "=========================================="
echo "  SkyX Backend - Quick Start Setup"
echo "=========================================="
echo ""

# Check prerequisites
echo "[1/5] Checking prerequisites..."
command -v node &> /dev/null || { echo "✗ Node.js not found. Install from https://nodejs.org"; exit 1; }
command -v npm &> /dev/null || { echo "✗ npm not found"; exit 1; }
command -v docker &> /dev/null || { echo "⚠ Docker not found (optional, but recommended)"; }

NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo "✓ Node.js $NODE_VERSION"
echo "✓ npm $NPM_VERSION"
echo ""

# Install dependencies
echo "[2/5] Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Setup environment
echo "[3/5] Setting up environment..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✓ .env file created (update with your credentials)"
else
  echo "✓ .env file already exists"
fi
echo ""

# Start MongoDB (Docker)
echo "[4/5] Starting MongoDB..."
if command -v docker &> /dev/null; then
  echo "Using Docker Compose to start MongoDB..."
  docker-compose up -d mongodb
  sleep 5
  echo "✓ MongoDB started in Docker"
else
  echo "⚠ Docker not available. Please start MongoDB manually:"
  echo "  mongod --dbpath ~/mongodb_data"
  echo ""
  read -p "Press Enter when MongoDB is ready..."
fi
echo ""

# Run database seed
echo "[5/5] Initializing database..."
npm run migrate
echo "✓ Database initialized with sample data"
echo ""

# Start development server
echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo "Starting development server..."
echo ""
npm run dev
