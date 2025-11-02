// Script to add gender to all dialogues based on speaker patterns
// Run this in Node.js to update enhanced-lessons.ts

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/data/enhanced-lessons.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Define gender patterns
const femalePatterns = [
  /speaker: 'A'/g,
  /speaker: 'Sales Assistant'/g,
  /speaker: 'Saleswoman'/g,
  /speaker: 'Woman'/g,
  /speaker: 'Girl'/g,
  /speaker: 'Mother'/g,
  /speaker: 'Sarah'/g,
  /speaker: 'Emily'/g,
  /speaker: 'Lisa'/g,
];

const malePatterns = [
  /speaker: 'B'/g,
  /speaker: 'Man'/g,
  /speaker: 'Boy'/g,
  /speaker: 'Father'/g,
  /speaker: 'John'/g,
  /speaker: 'Mike'/g,
  /speaker: 'Tom'/g,
];

// For dialogues without gender field, add it based on speaker pattern
const addGenderToDialogues = () => {
  // Match dialogue objects
  const dialogueRegex = /{\s*speaker:\s*'([^']+)',\s*text:\s*'[^']*(?:\\.[^']*)*',\s*translation[^}]*emotion:\s*'[^']*',?\s*}/gs;
  
  content = content.replace(dialogueRegex, (match) => {
    // Skip if already has gender
    if (match.includes('gender:')) {
      return match;
    }
    
    // Determine gender based on speaker
    let gender = null;
    
    // Check if it's speaker A (female) or B (male)
    if (match.includes("speaker: 'A'")) {
      gender = 'female';
    } else if (match.includes("speaker: 'B'")) {
      gender = 'male';
    } else if (match.includes("speaker: 'Customer'")) {
      // Customer alternates - need to check context
      // For simplicity, assign based on position in file
      return match; // Skip for now, handle manually
    } else if (match.includes("speaker: 'Sales Assistant'")) {
      gender = 'female'; // Most sales assistants in examples are female
    }
    
    if (gender) {
      // Add gender before closing brace
      return match.replace(/,?\s*}$/, `,\n        gender: '${gender}',\n      }`);
    }
    
    return match;
  });
  
  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Added gender fields to dialogues in enhanced-lessons.ts');
};

addGenderToDialogues();
