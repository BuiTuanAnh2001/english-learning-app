#!/usr/bin/env node

/**
 * Script để import tất cả vocabulary packs vào lib/data/lessons.ts
 * Chạy: node scripts/import-vocab-packs.js
 */

const fs = require('fs');
const path = require('path');

// Đường dẫn
const VOCAB_PACKS_DIR = path.join(__dirname, '../public/vocab-packs');
const LESSONS_FILE = path.join(__dirname, '../lib/data/lessons.ts');

// Đọc tất cả các file JSON trong vocab-packs
const vocabPackFiles = [
  '100-basic-verbs.json',
  '150-adjectives.json',
  '100-adverbs.json',
  '150-phrases.json',
  '100-business.json',
  '100-travel.json',
  '120-food-cooking.json'
];

console.log('🚀 Bắt đầu import vocabulary packs...\n');

// Đọc tất cả lessons từ vocab packs
const newLessons = [];
vocabPackFiles.forEach(file => {
  const filePath = path.join(VOCAB_PACKS_DIR, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lessons = JSON.parse(content);
    newLessons.push(...lessons);
    console.log(`✅ Đã đọc: ${file} (${lessons[0].vocabulary.length || lessons[0].phrases.length} items)`);
  } catch (error) {
    console.error(`❌ Lỗi đọc file ${file}:`, error.message);
  }
});

console.log(`\n📚 Tổng cộng: ${newLessons.length} vocabulary packs\n`);

// Đọc file lessons.ts hiện tại
const lessonsContent = fs.readFileSync(LESSONS_FILE, 'utf8');

// Tìm vị trí của array lessons
const lessonsStartMatch = lessonsContent.match(/export const lessons: Lesson\[\] = \[/);
if (!lessonsStartMatch) {
  console.error('❌ Không tìm thấy lessons array trong file!');
  process.exit(1);
}

const lessonsStartIndex = lessonsStartMatch.index + lessonsStartMatch[0].length;

// Tìm vị trí kết thúc của array (dấu ];)
const lessonsEndIndex = lessonsContent.lastIndexOf('];');

// Lấy phần lessons hiện tại (không bao gồm vocabulary packs cũ)
let currentLessons = lessonsContent.substring(lessonsStartIndex, lessonsEndIndex).trim();

// Xóa các vocabulary packs cũ nếu có (dựa vào id pattern)
const vocabPackIds = [
  'basic-verbs-001',
  'basic-adjectives-001', 
  'basic-adverbs-001',
  'common-phrases-001',
  'business-vocab-001',
  'travel-vocab-001',
  'food-vocab-001'
];

// Parse current lessons
let parsedLessons = [];
try {
  // Tạm thời wrap trong array để parse
  const tempContent = `[${currentLessons}]`;
  parsedLessons = eval(tempContent);
} catch (e) {
  console.error('❌ Lỗi parse lessons hiện tại:', e.message);
}

// Filter out old vocab packs
const filteredLessons = parsedLessons.filter(lesson => 
  !vocabPackIds.includes(lesson.id)
);

console.log(`🗑️  Đã xóa ${parsedLessons.length - filteredLessons.length} vocabulary packs cũ`);
console.log(`📝 Giữ lại ${filteredLessons.length} bài học gốc\n`);

// Combine: giữ lessons gốc + thêm vocab packs mới
const allLessons = [...filteredLessons, ...newLessons];

// Convert sang TypeScript format
const lessonsString = JSON.stringify(allLessons, null, 2)
  .replace(/"(\w+)":/g, '$1:') // Remove quotes from keys
  .replace(/"/g, "'"); // Use single quotes

// Tạo nội dung file mới
const newContent = `import { Lesson } from '../types';

export const lessons: Lesson[] = ${lessonsString};

// Category counts
export const categoryCount = {
  daily: ${allLessons.filter(l => l.category === 'daily').length},
  business: ${allLessons.filter(l => l.category === 'business').length},
  travel: ${allLessons.filter(l => l.category === 'travel').length},
  beginner: ${allLessons.filter(l => l.category === 'beginner').length},
};
`;

// Ghi file
fs.writeFileSync(LESSONS_FILE, newContent, 'utf8');

console.log('✨ HOÀN TẤT!\n');
console.log('📊 Thống kê:');
console.log(`   - Tổng bài học: ${allLessons.length}`);
console.log(`   - Daily: ${allLessons.filter(l => l.category === 'daily').length}`);
console.log(`   - Business: ${allLessons.filter(l => l.category === 'business').length}`);
console.log(`   - Travel: ${allLessons.filter(l => l.category === 'travel').length}`);
console.log(`   - Beginner: ${allLessons.filter(l => l.category === 'beginner').length}`);
console.log('\n🎉 File lib/data/lessons.ts đã được cập nhật!');
console.log('💡 Bây giờ bạn có thể refresh trang và thấy tất cả vocabulary packs ngay!');
