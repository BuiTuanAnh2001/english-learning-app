# 🧪 API Testing Guide

Hướng dẫn test các API endpoints.

## 📋 Setup

Đảm bảo server đang chạy:
```bash
npm run dev
```

Server chạy tại: http://localhost:3000

## 🔐 Authentication

### 1. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vocaplanet.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "admin@vocaplanet.com",
      "name": "Admin",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save token** để dùng cho các request sau:
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User"
  }'
```

## 📚 Lessons API

### 1. Get All Lessons
```bash
# All lessons
curl http://localhost:3000/api/lessons

# Filter by category
curl http://localhost:3000/api/lessons?category=daily

# Filter by level
curl http://localhost:3000/api/lessons?level=beginner

# Search
curl http://localhost:3000/api/lessons?search=hello
```

### 2. Get Lesson by ID
```bash
curl http://localhost:3000/api/lessons/LESSON_ID
```

### 3. Create New Lesson (Admin only)
```bash
curl -X POST http://localhost:3000/api/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Lesson",
    "description": "This is a test lesson",
    "level": "beginner",
    "duration": "10 phút",
    "categoryId": "CATEGORY_ID",
    "vocabulary": [
      {
        "word": "Hello",
        "pronunciation": "/həˈloʊ/",
        "meaning": "Xin chào",
        "example": "Hello, how are you?",
        "tags": ["greeting"]
      }
    ],
    "phrases": [
      {
        "phrase": "How are you?",
        "meaning": "Bạn khỏe không?",
        "example": "Hello! How are you today?"
      }
    ],
    "dialogues": [
      {
        "speaker": "A",
        "text": "Hello!",
        "translation": "Xin chào!",
        "gender": "male"
      }
    ]
  }'
```

### 4. Update Lesson (Admin only)
```bash
curl -X PUT http://localhost:3000/api/lessons/LESSON_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Updated Lesson Title",
    "description": "Updated description"
  }'
```

### 5. Delete Lesson (Admin only)
```bash
curl -X DELETE http://localhost:3000/api/lessons/LESSON_ID \
  -H "Authorization: Bearer $TOKEN"
```

## 📁 Categories API

### 1. Get All Categories
```bash
curl http://localhost:3000/api/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Daily Conversation",
      "description": "...",
      "icon": "MessageCircle",
      "lessonCount": 5
    }
  ]
}
```

### 2. Create Category (Admin only)
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "New Category",
    "description": "Category description",
    "icon": "BookOpen"
  }'
```

## 🧪 Testing with Postman

### Import Collection

Create a Postman collection with these requests:

#### 1. Login
- Method: POST
- URL: `{{baseUrl}}/api/auth/login`
- Body (JSON):
```json
{
  "email": "admin@vocaplanet.com",
  "password": "admin123"
}
```
- Test script:
```javascript
pm.environment.set("token", pm.response.json().data.token);
```

#### 2. Get Lessons
- Method: GET
- URL: `{{baseUrl}}/api/lessons`
- Headers: (none needed)

#### 3. Create Lesson
- Method: POST
- URL: `{{baseUrl}}/api/lessons`
- Headers: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- Body: See example above

### Environment Variables
```json
{
  "baseUrl": "http://localhost:3000",
  "token": ""
}
```

## 🔍 Testing with Browser

### JavaScript Console

```javascript
// Login
const login = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@vocaplanet.com',
    password: 'admin123'
  })
})
const { data } = await login.json()
const token = data.token
console.log('Token:', token)

// Get lessons
const lessons = await fetch('http://localhost:3000/api/lessons')
const lessonsData = await lessons.json()
console.log('Lessons:', lessonsData)

// Create lesson (with auth)
const newLesson = await fetch('http://localhost:3000/api/lessons', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Test Lesson',
    description: 'Test',
    level: 'beginner',
    categoryId: 'daily',
    vocabulary: [],
    phrases: [],
    dialogues: []
  })
})
const result = await newLesson.json()
console.log('Created:', result)
```

## ✅ Expected Responses

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "error": "Missing required fields"
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden - Admin access required"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "error": "Lesson not found"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to fetch lessons"
}
```

## 🎯 Test Checklist

- [ ] ✅ Login với admin credentials
- [ ] ✅ Login với invalid credentials (should fail)
- [ ] ✅ Register new user
- [ ] ✅ Get all lessons
- [ ] ✅ Get lessons with filters (category, level, search)
- [ ] ✅ Get lesson by ID
- [ ] ✅ Create lesson without auth (should fail 401)
- [ ] ✅ Create lesson with user token (should fail 403 if not admin)
- [ ] ✅ Create lesson with admin token (should succeed)
- [ ] ✅ Update lesson
- [ ] ✅ Delete lesson
- [ ] ✅ Get categories
- [ ] ✅ Create category

## 📊 Performance Testing

### Load Test with Apache Bench
```bash
# Test GET /api/lessons
ab -n 100 -c 10 http://localhost:3000/api/lessons

# -n: Total requests
# -c: Concurrent requests
```

### Expected Performance
- GET requests: < 100ms
- POST requests: < 200ms
- Database queries: < 50ms

## 🐛 Debugging Tips

### Check Database
```bash
npm run db:studio
# Verify data exists
```

### Check Logs
```bash
# Server logs show all queries
npm run dev
# Watch for errors in terminal
```

### Verify Token
```javascript
// Decode JWT at https://jwt.io
// Paste your token to see payload
```

### Test with Different Users
```bash
# Login as admin
# Login as regular user
# Compare access levels
```

## 📝 Notes

- Admin token required for POST, PUT, DELETE
- GET requests don't need authentication
- Token expires in 7 days
- Always check response status and success field
- Use Prisma Studio to verify database changes

---

Happy Testing! 🎉
