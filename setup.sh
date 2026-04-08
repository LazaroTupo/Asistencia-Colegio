#!/bin/bash
set -e

cd /home/lazaro/Workspace/asistencia
mise use node@20

# Backend
mkdir -p backend
cd backend
if [ ! -f package.json ]; then
    mise exec node@20 -- npm init -y
fi
mise exec node@20 -- npm install express cors dotenv prisma node-cron axios
mise exec node@20 -- npm install -D typescript @types/express @types/cors @types/node @types/node-cron ts-node nodemon
if [ ! -f tsconfig.json ]; then
    mise exec node@20 -- npx tsc --init
fi
if [ ! -d prisma ]; then
    mise exec node@20 -- npx prisma init
fi

# Frontend
cd /home/lazaro/Workspace/asistencia
if [ ! -d frontend ]; then
    mise exec node@20 -- npx -y create-vite@latest frontend --template react-ts
fi
cd frontend
mise exec node@20 -- npm install
mise exec node@20 -- npm install react-router-dom axios html5-qrcode
