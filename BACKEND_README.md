# 🎉 Backend System - Vocaplanet

## ✨ Tổng quan

Hệ thống backend đã được xây dựng hoàn chỉnh với:
- ✅ **PostgreSQL Database** với Prisma ORM
- ✅ **RESTful API** với Next.js API Routes
- ✅ **JWT Authentication** & Authorization
- ✅ **Complete CRUD** cho Lessons, Categories, Users
- ✅ **Database Seeding** với data mẫu
- ✅ **Type-safe** với TypeScript

## 📚 Tài liệu

### Quick Start
👉 **[BACKEND_QUICK_START.md](./BACKEND_QUICK_START.md)** - Setup trong 5 phút

### Chi tiết
- 📖 [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Hướng dẫn đầy đủ
- 🏗️ [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) - Cấu trúc & architecture
- 📋 [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md) - Checklist migrate từ localStorage

## 🚀 Quick Commands

```bash
# Setup (lần đầu)
npm install
npm install -D tsx
npm run db:generate
npm run db:push
npm run db:seed

# Development
npm run dev              # Start server
npm run db:studio        # Open database GUI

# Database
npm run db:reset         # Reset database
npm run db:seed          # Re-seed data
```

## 🔑 Default Admin

```
Email: admin@vocaplanet.com
Password: admin123
```

## 📁 Cấu trúc Files

```
prisma/
  schema.prisma          # Database models
  seed.ts                # Seed script

app/api/
  auth/
    login/route.ts       # POST /api/auth/login
    register/route.ts    # POST /api/auth/register
  categories/route.ts    # GET, POST /api/categories
  lessons/
    route.ts             # GET, POST /api/lessons
    [id]/route.ts        # GET, PUT, DELETE /api/lessons/:id

lib/
  prisma.ts              # Prisma client
  middleware/auth.ts     # Auth middleware
  services/
    api.ts               # API service (NEW - thay localStorage)
    storage.ts           # localStorage (OLD - sẽ xóa)
```

## 🔄 Migration Path

### 1. Setup Database
```bash
# Chọn Supabase (free): https://supabase.com
# Hoặc Railway: https://railway.app
# Cập nhật .env với DATABASE_URL
```

### 2. Migrate Frontend Code
```typescript
// Before
import { getLessons } from '@/lib/services/storage'
const lessons = getLessons()

// After
import { getLessons } from '@/lib/services/api'
const lessons = await getLessons()
```

### 3. Test & Deploy
```bash
npm run dev              # Test local
# Deploy to Vercel
# Setup env vars in Vercel dashboard
```

## 🎯 Current Status

✅ **Completed:**
- Database schema designed
- API routes implemented
- Authentication system
- API service layer
- Documentation complete

⏳ **To Do:**
- Connect to production database
- Migrate frontend components
- Test all features
- Deploy

## 📊 API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | ❌ | Login user |
| `/api/auth/register` | POST | ❌ | Register user |
| `/api/lessons` | GET | ❌ | Get all lessons |
| `/api/lessons/:id` | GET | ❌ | Get lesson by ID |
| `/api/lessons` | POST | ✅ | Create lesson |
| `/api/lessons/:id` | PUT | ✅ | Update lesson |
| `/api/lessons/:id` | DELETE | ✅ | Delete lesson |
| `/api/categories` | GET | ❌ | Get categories |

## 🔐 Security Features

- ✅ Password hashing với bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control (USER/ADMIN)
- ✅ Protected API routes
- ✅ SQL injection protection (Prisma)

## 📈 Next Steps

1. **Setup Database** - Chọn Supabase hoặc Railway
2. **Run Migrations** - `npm run db:push` và `npm run db:seed`
3. **Migrate Components** - Update import từ storage → api
4. **Test Features** - Verify tất cả hoạt động
5. **Deploy** - Vercel + production database

## 💡 Tips

- Dùng `npm run db:studio` để xem data visually
- Test API với Postman hoặc curl
- Check [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md) để track progress
- Backup database trước khi reset

## 🆘 Troubleshooting

**Lỗi Prisma Client?**
```bash
npm run db:generate
```

**Lỗi kết nối database?**
- Check DATABASE_URL trong .env
- Verify database đang chạy
- Check network/firewall

**API không hoạt động?**
- Verify token được gửi đúng: `Authorization: Bearer {token}`
- Check JWT_SECRET đã set
- Xem logs trong terminal

---

**Ready to go!** 🚀 Bắt đầu với [BACKEND_QUICK_START.md](./BACKEND_QUICK_START.md)
