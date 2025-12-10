#!/bin/bash

echo "🧹 Cleaning up old English Learning App files..."

# Remove old app routes
rm -rf app/lessons
rm -rf app/notebook
rm -rf app/progress
rm -rf app/friends
rm -rf app/admin
rm -rf app/messages
rm -rf app/notifications

# Remove old API routes
rm -rf app/api/lessons
rm -rf app/api/friends
rm -rf app/api/messages
rm -rf app/api/notifications
rm -rf app/api/vocabulary-notes
rm -rf app/api/categories
rm -rf app/api/progress
rm -rf app/api/user

# Remove old components
rm -rf components/lessons
rm -rf components/analytics

# Remove old lib files
rm -rf lib/data
rm -f lib/contexts/lessons-context.tsx
rm -f lib/contexts/auth-context.tsx
rm -f components/global-notification-listener.tsx

# Remove old scripts and seed files
rm -rf scripts
rm -f prisma/seed-*.ts
rm -f prisma/schema-old-english.prisma
rm -f prisma/schema-chat.prisma

echo "✅ Cleanup complete!"

echo ""
echo "📦 Installing required packages..."
npm install next-auth @next-auth/prisma-adapter

echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo ""
echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run SQL script in Supabase Dashboard (see CHAT_APP_README.md)"
echo "2. Configure Google OAuth credentials (optional)"
echo "3. Run: npm run dev"
echo ""
