const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, '../lib/data/lessons.ts');

let content = fs.readFileSync(lessonsPath, 'utf8');

// Đơn giản hơn: thêm gender sau translation nếu chưa có
const dialoguePattern = /(\s+{\s+speaker: '([AB])',\s+text: '[^']*(?:\\'[^']*)*',\s+translation: '[^']*(?:\\'[^']*)*')(,?\s*})/gs;

let count = 0;
const modified = content.replace(dialoguePattern, (match, before, speaker, after) => {
  // Nếu đã có gender thì skip
  if (match.includes('gender:')) {
    return match;
  }
  
  count++;
  const gender = speaker === 'A' ? 'female' : 'male';
  return `${before},\n        gender: '${gender}' as const${after}`;
});

if (count > 0) {
  fs.writeFileSync(lessonsPath, modified, 'utf8');
  console.log(`✅ Added gender to ${count} dialogues in lessons.ts`);
  console.log('🎉 Done!');
} else {
  console.log('✅ All dialogues already have gender field');
}
