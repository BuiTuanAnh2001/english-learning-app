# ⚡ Backend & Supabase Quick Reference

## 🔗 Important Links

- **Supabase:** https://supabase.com
- **Dashboard:** https://supabase.com/dashboard  
- **Docs:** https://supabase.com/docs

## 📋 Complete Setup Checklist

### Backend Setup
- [ ] 1. Run `npm install` (installs Prisma 5)
- [ ] 2. Create Supabase account at supabase.com
- [ ] 3. Create New Project (save password!)
- [ ] 4. Copy connection string from Settings → Database → URI
- [ ] 5. Replace `[YOUR-PASSWORD]` with your actual password
- [ ] 6. Create `.env` file in project root
- [ ] 7. Paste DATABASE_URL into `.env`
- [ ] 8. Generate JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] 9. Add JWT_SECRET to `.env`
- [ ] 10. Run `npm run db:generate`
- [ ] 11. Run `npm run db:push`
- [ ] 12. Run `npm run db:seed`
- [ ] 13. Verify with `npm run db:studio`
- [ ] 14. Test with `npm run dev`

## 💻 Essential Commands

```bash
# Database Setup
npm install              # Install dependencies (Prisma 5)
npm run db:generate      # Generate Prisma Client
npm run db:push         # Create tables in Supabase
npm run db:seed         # Import 13+ lessons

# Development
npm run dev             # Start Next.js server (http://localhost:3000)
npm run db:studio       # Open database GUI (http://localhost:5555)

# Database Management
npm run db:reset        # ⚠️ Delete ALL data & re-seed
```

## 🔑 Default Admin Account

```
Email:    admin@vocaplanet.com
Password: admin123
```

**⚠️ Change password after first login!**

## 📂 .env File Template

```env
# Copy this into your .env file

# Database (from Supabase)
DATABASE_URL="postgresql://postgres.xxxxx:YOUR_ACTUAL_PASSWORD@aws-0-xx-xxx.pooler.supabase.com:5432/postgres"

# JWT Secret (generate with command above)
JWT_SECRET="a8f5f167f44f4964e6c998dee827110c8b9c2e5f3a4d6e7f8b9a0c1d2e3f4a5b"

# API Base URL
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🧪 Test Your Setup

### 1. Test Database Connection
```bash
npx prisma db pull
# Should succeed if connection is OK
```

### 2. Test Login API
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vocaplanet.com","password":"admin123"}'

# Should return: {"success":true,"data":{"user":{...},"token":"..."}}
```

### 3. Test Get Lessons
```bash
curl http://localhost:3000/api/lessons

# Should return: {"success":true,"data":[...lessons...]}
```

## 📊 Supabase Dashboard Guide

### View Your Data
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Table Editor** in sidebar
4. Browse tables: User, Lesson, Vocabulary, etc.

### Run SQL Queries
1. Click **SQL Editor** in sidebar
2. Try these queries:

```sql
-- See all lessons
SELECT * FROM "Lesson";

-- Count total vocabulary
SELECT COUNT(*) FROM "Vocabulary";

-- See admin user
SELECT email, name, role FROM "User" WHERE role = 'ADMIN';

-- Lessons by category
SELECT l.title, c.name as category 
FROM "Lesson" l 
JOIN "Category" c ON l."categoryId" = c.id;
```

### Check Database Usage
Dashboard → **Settings** → **Usage**
- Storage used
- API requests
- Bandwidth

## ⚠️ Common Issues & Quick Fixes

| Error | Quick Fix |
|-------|-----------|
| `P1012: datasource property url is no longer supported` | Run `npm install` (fixes Prisma 7→5) |
| `Can't reach database server` | Check internet, verify DATABASE_URL |
| `Authentication failed` | Check password in connection string |
| `Module '@prisma/client' has no exported member` | Run `npm run db:generate` |
| `Environment variable not found: DATABASE_URL` | Create `.env` file with DATABASE_URL |
| `Error seeding database` | Check `lib/data/lessons.ts` exists |

## 🎯 What Gets Created

After running `npm run db:seed`, you'll have:

### Database Tables (14 total)
- ✅ User (admin account)
- ✅ Category (5 categories)
- ✅ Lesson (13+ lessons)
- ✅ Vocabulary (820+ words)
- ✅ Phrase (150+ phrases)
- ✅ Dialogue (conversations)
- ✅ Objective, Tip, Quiz, etc.

### Default Data
- 📚 13 original lessons
- 📦 7 vocabulary packs (820+ words)
- 👤 1 admin account
- 📁 5 categories

## 🚀 API Endpoints Available

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | ❌ | Login user |
| `/api/auth/register` | POST | ❌ | Register new user |
| `/api/lessons` | GET | ❌ | Get all lessons |
| `/api/lessons?category=daily` | GET | ❌ | Filter by category |
| `/api/lessons?level=beginner` | GET | ❌ | Filter by level |
| `/api/lessons?search=hello` | GET | ❌ | Search lessons |
| `/api/lessons/:id` | GET | ❌ | Get single lesson |
| `/api/lessons` | POST | ✅ Admin | Create lesson |
| `/api/lessons/:id` | PUT | ✅ Admin | Update lesson |
| `/api/lessons/:id` | DELETE | ✅ Admin | Delete lesson |
| `/api/categories` | GET | ❌ | Get all categories |

## 📖 Full Documentation

- 📘 **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Detailed Supabase guide
- 🏗️ **[BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)** - System architecture
- 🚀 **[BACKEND_QUICK_START.md](./BACKEND_QUICK_START.md)** - 5-min backend setup
- 📋 **[MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)** - Migration tasks
- 🔧 **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Fix common errors
- 🧪 **[API_TESTING.md](./API_TESTING.md)** - API testing guide

## 🎉 You're Ready When...

- ✅ `npm run db:studio` shows data
- ✅ `curl http://localhost:3000/api/lessons` returns lessons
- ✅ Can login with admin@vocaplanet.com
- ✅ Supabase dashboard shows all tables

**Next:** Start building features! 🚀

---

**Need help?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
