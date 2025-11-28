#!/bin/bash

echo "🔧 Fixing Prisma version and setting up database..."

# Step 1: Install Prisma 5
echo "📦 Installing Prisma 5..."
npm install

# Step 2: Generate Prisma Client
echo "⚙️ Generating Prisma Client..."
npm run db:generate

# Step 3: Push schema to database
echo "🗄️ Pushing schema to database..."
npm run db:push

# Step 4: Seed database
echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Done! Your database is ready."
echo ""
echo "🔑 Default admin account:"
echo "   Email: admin@vocaplanet.com"
echo "   Password: admin123"
echo ""
echo "🚀 Run 'npm run dev' to start the server"
echo "📊 Run 'npm run db:studio' to view database"
