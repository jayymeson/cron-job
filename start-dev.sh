#!/bin/bash

echo "🚀 Starting Cron Job NestJS Development Environment"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start PostgreSQL container
echo "🐘 Starting PostgreSQL container..."
docker run --name postgres-dev \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=cronjob_db \
    -p 5432:5432 \
    -d postgres:15-alpine

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Navigate to app directory
cd app

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run database seed
echo "🌱 Seeding database..."
npm run seed

# Start the application in development mode
echo "🎯 Starting NestJS application..."
npm run start:dev 