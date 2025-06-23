#!/bin/bash
# Frontend Dependency Fix Script

echo "🔧 Fixing ZCODER Frontend Dependencies..."

cd frontend

echo "📦 Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

echo "📥 Installing stable dependencies..."
npm install

echo "✅ Dependencies fixed! Try running the frontend again."

cd ..

echo "🚀 Frontend is ready to run!"
