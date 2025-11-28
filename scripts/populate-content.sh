#!/bin/bash

echo "🚀 Bắt đầu thêm nội dung mới vào database..."
echo ""

echo "📚 Bước 1: Thêm 10 bài học cơ bản, giao tiếp, kinh doanh, du lịch..."
node scripts/add-more-lessons.js

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Bước 1 hoàn thành!"
  echo ""
  echo "💡 Bước 2: Thêm nội dung nâng cao (Idioms, Phrasal Verbs, Academic, Restaurant)..."
  node scripts/add-advanced-content.js
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Hoàn thành! Đã thêm thành công:"
    echo "   ✓ 15 bài học mới"
    echo "   ✓ 180+ từ vựng"
    echo "   ✓ 50+ cụm từ thông dụng"
    echo "   ✓ 10+ đoạn hội thoại"
    echo "   ✓ Idioms & Phrasal Verbs"
    echo "   ✓ Small Talk & Restaurant"
    echo "   ✓ Academic & Business English"
    echo ""
  else
    echo "❌ Lỗi ở bước 2"
    exit 1
  fi
else
  echo "❌ Lỗi ở bước 1"
  exit 1
fi
