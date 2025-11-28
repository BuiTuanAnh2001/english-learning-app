# 📋 Migration Checklist - localStorage → Backend API

## ✅ Phase 1: Backend Setup (COMPLETED)
- [x] Install dependencies (Prisma, bcrypt, JWT)
- [x] Create Prisma schema
- [x] Create API routes
  - [x] `/api/auth/login`
  - [x] `/api/auth/register`
  - [x] `/api/lessons` (GET, POST)
  - [x] `/api/lessons/:id` (GET, PUT, DELETE)
  - [x] `/api/categories` (GET, POST)
- [x] Create authentication middleware
- [x] Create API service layer
- [x] Create seed script
- [x] Write documentation

## 🔄 Phase 2: Database Setup (TODO)

### Step 1: Choose Database Provider
- [ ] Option A: Supabase (https://supabase.com) - **Recommended**
- [ ] Option B: Railway (https://railway.app)
- [ ] Option C: Local PostgreSQL

### Step 2: Configure Environment
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your database URL
DATABASE_URL="postgresql://..."
JWT_SECRET="random-secret-key"
```

### Step 3: Initialize Database
```bash
npm install -D tsx
npm run db:generate    # Generate Prisma Client
npm run db:push       # Create tables
npm run db:seed       # Import data
```

### Step 4: Verify Setup
```bash
npm run db:studio     # Open Prisma Studio
# Check if data is loaded correctly
```

## 🎨 Phase 3: Frontend Migration (TODO)

### Components to Migrate

#### 3.1 Lessons Page (`app/lessons/page.tsx`)
- [ ] Import API service instead of storage
  ```typescript
  // OLD
  import { getLessons } from '@/lib/services/storage'
  
  // NEW
  import { getLessons } from '@/lib/services/api'
  ```
- [ ] Add async/await
- [ ] Add loading state
- [ ] Add error handling
- [ ] Test: Browse lessons

#### 3.2 Lesson Detail Page (`app/lessons/[id]/page.tsx`)
- [ ] Update import
- [ ] Add async/await for `getLessonById()`
- [ ] Add loading state
- [ ] Add error handling
- [ ] Test: View lesson details

#### 3.3 Admin Panel (`app/admin/page.tsx`)
- [ ] Update authentication check
- [ ] Use `isAuthenticated()` from API service
- [ ] Update lesson CRUD operations
- [ ] Test: Login, create, edit, delete lessons

#### 3.4 Admin Lesson Form (`app/admin/lessons/[id]/edit/page.tsx`)
- [ ] Update `getLessonById()`
- [ ] Update `updateLesson()`
- [ ] Add error handling
- [ ] Test: Edit and save lesson

#### 3.5 Admin New Lesson (`app/admin/lessons/new/page.tsx`)
- [ ] Update `createLesson()`
- [ ] Update `getCategories()`
- [ ] Add error handling
- [ ] Test: Create new lesson

#### 3.6 Progress Page (`app/progress/page.tsx`)
- [ ] Update `getLessons()`
- [ ] Add user progress tracking API (if implemented)
- [ ] Test: View progress

#### 3.7 Quiz Page (`app/lessons/[id]/quiz/page.tsx`)
- [ ] Update `getLessonById()`
- [ ] Add quiz submission API (if implemented)
- [ ] Test: Take quiz

### Components (Smaller)

#### 3.8 Lesson Card (`components/lessons/lesson-card.tsx`)
- [ ] Update any direct data access
- [ ] Ensure lesson prop works with API data
- [ ] Test: Card displays correctly

#### 3.9 Navbar (`components/navigation/navbar.tsx`)
- [ ] Add login/logout UI
- [ ] Show user info if authenticated
- [ ] Test: Login/logout flow

#### 3.10 Auth Context (`lib/contexts/auth-context.tsx`)
- [ ] Integrate with API authentication
- [ ] Use `login()`, `logout()`, `getCurrentUser()` from API service
- [ ] Test: Authentication state management

## 🔐 Phase 4: Authentication Flow (TODO)

### 4.1 Update Login Modal
- [ ] Call API `/api/auth/login`
- [ ] Store JWT token
- [ ] Update user state
- [ ] Test: Login with admin@vocaplanet.com

### 4.2 Update Protected Routes
- [ ] Check `isAuthenticated()` before accessing admin
- [ ] Redirect to login if not authenticated
- [ ] Test: Access control works

### 4.3 Add User Registration (Optional)
- [ ] Create registration form
- [ ] Call `/api/auth/register`
- [ ] Test: Register new user

## 🧪 Phase 5: Testing (TODO)

### Backend Testing
- [ ] Test GET `/api/lessons` - Returns lessons
- [ ] Test GET `/api/lessons/:id` - Returns specific lesson
- [ ] Test POST `/api/lessons` - Creates lesson (with auth)
- [ ] Test PUT `/api/lessons/:id` - Updates lesson (with auth)
- [ ] Test DELETE `/api/lessons/:id` - Deletes lesson (with auth)
- [ ] Test POST `/api/auth/login` - Returns token
- [ ] Test POST `/api/auth/register` - Creates user
- [ ] Test GET `/api/categories` - Returns categories

### Frontend Testing
- [ ] Browse lessons - Works
- [ ] View lesson detail - Works
- [ ] Admin login - Works
- [ ] Create lesson - Works
- [ ] Edit lesson - Works
- [ ] Delete lesson - Works
- [ ] Search lessons - Works
- [ ] Filter by category - Works
- [ ] Filter by level - Works

### Integration Testing
- [ ] Full user flow: Browse → View → Login → Create → Edit → Delete
- [ ] Logout and verify access revoked
- [ ] Test with different user roles (USER vs ADMIN)

## 🚀 Phase 6: Deployment (TODO)

### 6.1 Database
- [ ] Setup production database (Supabase/Railway)
- [ ] Run migrations: `npx prisma db push`
- [ ] Seed production data: `npx prisma db seed`
- [ ] Verify data in Prisma Studio

### 6.2 Backend API
- [ ] Set environment variables in Vercel/production
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `NEXT_PUBLIC_API_URL`
- [ ] Deploy to Vercel
- [ ] Test API endpoints in production

### 6.3 Frontend
- [ ] Update API base URL for production
- [ ] Test all features in production
- [ ] Monitor for errors

### 6.4 Post-Deployment
- [ ] Change default admin password
- [ ] Setup database backups
- [ ] Setup monitoring/logging
- [ ] Document production URLs

## 📊 Phase 7: Optimization (TODO)

### Performance
- [ ] Add pagination to lessons list
- [ ] Implement caching (Redis or SWR)
- [ ] Optimize database queries
- [ ] Add indexes to frequently queried fields

### Features
- [ ] User progress tracking
- [ ] Quiz results storage
- [ ] Vocabulary favorites
- [ ] Study streaks
- [ ] Achievements/badges

### UX
- [ ] Better loading states
- [ ] Error boundaries
- [ ] Offline support (Service Worker)
- [ ] PWA features

## 🗑️ Phase 8: Cleanup (TODO)

### Remove Old Code
- [ ] Remove `lib/services/storage.ts` (localStorage)
- [ ] Remove `lib/data/lessons.ts` (hardcoded data)
- [ ] Remove `lib/data/enhanced-lessons.ts`
- [ ] Remove `public/vocab-packs/*.json`
- [ ] Clean up unused imports

### Documentation
- [ ] Update README.md
- [ ] Document API changes
- [ ] Add migration guide for future updates

## 📝 Notes

### Current Status
- ✅ Backend structure ready
- ✅ API routes created
- ✅ Authentication implemented
- ⏳ Database not yet connected
- ⏳ Frontend not yet migrated

### Dependencies Added
```json
{
  "dependencies": {
    "@prisma/client": "^7.0.1",
    "bcryptjs": "^3.0.3",
    "jsonwebtoken": "^9.0.2",
    "prisma": "^7.0.1"
  },
  "devDependencies": {
    "@types/jsonwebtoken": "^9.0.10",
    "tsx": "^latest"
  }
}
```

### Next Immediate Steps
1. Setup database (Supabase recommended)
2. Run `npm run db:generate`
3. Run `npm run db:push`
4. Run `npm run db:seed`
5. Start migrating components one by one

### Quick Test Commands
```bash
# Start dev server
npm run dev

# Open database GUI
npm run db:studio

# Test API endpoint
curl http://localhost:3000/api/lessons

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vocaplanet.com","password":"admin123"}'
```

---

**Progress**: 1/8 phases completed (Backend Setup)  
**Next**: Setup database and migrate frontend components
