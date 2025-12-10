# ChatApp - Modern Real-time Chat Application

## 🚀 Setup Instructions

### 1. Install Required Packages
```bash
npm install next-auth @next-auth/prisma-adapter
```

### 2. Setup Database in Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Copy content from `prisma/reset-to-chat.sql`
5. Paste and click **Run**

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Configure Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized JavaScript origins: `http://localhost:3000`
7. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
8. Copy Client ID and Client Secret
9. Update `.env` file:
   ```
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

### 5. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## 📁 Files to Delete (Old English Learning App)

Run these commands to clean up:
```bash
rm -rf app/lessons
rm -rf app/notebook
rm -rf app/progress
rm -rf app/friends
rm -rf app/admin
rm -rf app/messages
rm -rf app/notifications
rm -rf app/api/lessons
rm -rf app/api/friends
rm -rf app/api/messages
rm -rf app/api/notifications
rm -rf app/api/vocabulary-notes
rm -rf app/api/categories
rm -rf app/api/progress
rm -rf app/api/user
rm -rf components/lessons
rm -rf lib/data
rm -rf scripts
rm -f lib/contexts/lessons-context.tsx
rm -f components/global-notification-listener.tsx
rm -f prisma/seed-*.ts
```

## ✨ Features

- ✅ Google OAuth & Email/Password Authentication
- ✅ Real-time messaging with Supabase
- ✅ Direct (1-on-1) conversations
- ✅ Group chat
- ✅ Online/Offline status
- ✅ Read receipts
- ✅ Message history
- ✅ Beautiful responsive UI
- 🔄 Typing indicators (Schema ready, UI pending)
- 🔄 File/Image upload (Schema ready, UI pending)
- 🔄 Message reactions (Can be added)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Realtime**: Supabase Realtime
- **Auth**: NextAuth.js (Google OAuth + Credentials)
- **UI Components**: Shadcn UI

## 📝 Default Credentials

After running the app, you can register new accounts or use Google OAuth.

## 🔧 Environment Variables

Check `.env` file and update:
- `DATABASE_URL` - Already configured for Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Already configured
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Already configured
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

## 📱 Routes

- `/` - Landing page
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/chat` - Main chat interface (protected)

## 🐛 Troubleshooting

If you see errors:
1. Make sure you ran the SQL script in Supabase
2. Run `npx prisma generate` after any schema changes
3. Install missing packages: `npm install`
4. Check `.env` file has correct values
