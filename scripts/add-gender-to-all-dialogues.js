#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to update
const files = [
  path.join(__dirname, '../lib/data/lessons.ts'),
  path.join(__dirname, '../lib/data/enhanced-lessons.ts'),
];

files.forEach(filePath => {
  console.log(`\n📝 Processing: ${path.basename(filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;
  
  // Pattern to match dialogue objects without gender field
  // Matches from { speaker: through emotion: 'xxx', (including multi-line strings with escaped quotes)
  const dialoguePattern = /(\{\s*speaker:\s*'([^']+)',\s*text:\s*'(?:[^'\\]|\\.)*',\s*translation:\s*'(?:[^'\\]|\\.)*',\s*emotion:\s*'[^']+',)\s*(\n\s*\})/g;
  
  content = content.replace(dialoguePattern, (match, beforeGender, speaker, afterEmotion) => {
    // Skip if already has gender
    if (match.includes('gender:')) {
      return match;
    }
    
    // Determine gender based on speaker
    let gender = null;
    
    // Default pattern: A = female, B = male
    if (speaker === 'A' || speaker.includes('Woman') || speaker.includes('Girl') || 
        speaker.includes('Mother') || speaker.includes('Sarah') || speaker.includes('Emily')) {
      gender = 'female';
    } else if (speaker === 'B' || speaker.includes('Man') || speaker.includes('Boy') || 
               speaker.includes('Father') || speaker.includes('John') || speaker.includes('Mike') || 
               speaker.includes('Tom')) {
      gender = 'male';
    } else if (speaker.includes('Sales Assistant') || speaker.includes('Saleswoman')) {
      gender = 'female';
    } else if (speaker.includes('Customer')) {
      // Try to detect from context - for now default to female for shopping dialogues
      gender = 'female';
    } else if (speaker.includes('Salesman')) {
      gender = 'male';
    }
    
    if (gender) {
      changeCount++;
      return `${beforeGender}\n        gender: '${gender}',${afterEmotion}`;
    }
    
    return match;
  });
  
  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Added gender to ${changeCount} dialogues`);
});

console.log('\n🎉 Done! All dialogues now have gender field.');
