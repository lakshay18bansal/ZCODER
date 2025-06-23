#!/bin/bash
# Backend Dependency Fix Script

echo "🔧 Fixing ZCODER Backend Dependencies..."

cd backend

echo "📦 Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

echo "📥 Installing stable dependencies..."
npm install

echo "✅ Dependencies fixed! Try running the server again."

cd ..

echo "🚀 Backend is ready to run!"
