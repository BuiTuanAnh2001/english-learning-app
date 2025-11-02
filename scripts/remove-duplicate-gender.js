const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, '../lib/data/lessons.ts');

let content = fs.readFileSync(lessonsPath, 'utf8');

// Xóa duplicate gender lines
const lines = content.split('\n');
const cleanedLines = [];
let skipNext = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const nextLine = lines[i + 1];
  
  // Nếu line hiện tại có gender và line tiếp theo cũng có gender giống nhau
  if (line.includes('gender:') && nextLine && nextLine.includes('gender:')) {
    cleanedLines.push(line); // Giữ line đầu tiên
    skipNext = true;
    continue;
  }
  
  if (skipNext) {
    skipNext = false;
    continue; // Skip line duplicate
  }
  
  cleanedLines.push(line);
}

const cleaned = cleanedLines.join('\n');
fs.writeFileSync(lessonsPath, cleaned, 'utf8');

console.log('✅ Removed duplicate gender fields');
