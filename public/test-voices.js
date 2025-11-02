// Test Voice Classification in Browser Console
// Copy and paste this code into your browser console to debug voice classification

console.log('🎤 === VOICE CLASSIFICATION TEST ===\n');

const voices = speechSynthesis.getVoices();
const englishVoices = voices.filter(v => v.lang.startsWith('en'));

console.log(`Found ${englishVoices.length} English voices:\n`);

const maleKeywords = [
  'Male', 'male', 'Man', 'man',
  'David', 'Daniel', 'James', 'Thomas', 'Alex', 'George', 
  'Fred', 'Oliver', 'Rishi', 'Ryan', 'Aaron', 'Bruce',
  'Guy'
];

const femaleKeywords = [
  'Female', 'female', 'Woman', 'woman',
  'Samantha', 'Karen', 'Victoria', 'Susan', 'Zira', 'Joanna',
  'Kate', 'Lisa', 'Emma', 'Amy', 'Salli', 'Kimberly',
  'Moira', 'Fiona', 'Serena', 'Tessa', 'Ava', 'Allison'
];

const male = [];
const female = [];
const unclassified = [];

englishVoices.forEach((voice, idx) => {
  const voiceLower = voice.name.toLowerCase();
  const isMale = maleKeywords.some(k => voiceLower.includes(k.toLowerCase()));
  const isFemale = femaleKeywords.some(k => voiceLower.includes(k.toLowerCase()));
  
  const matchedMale = maleKeywords.filter(k => voiceLower.includes(k.toLowerCase()));
  const matchedFemale = femaleKeywords.filter(k => voiceLower.includes(k.toLowerCase()));
  
  let category = '❓ UNCLASSIFIED';
  let emoji = '❓';
  
  if (isFemale) {
    female.push(voice);
    category = '👩 FEMALE';
    emoji = '👩';
  } else if (isMale) {
    male.push(voice);
    category = '👨 MALE';
    emoji = '👨';
  } else {
    unclassified.push(voice);
  }
  
  console.log(
    `${emoji} [${idx + 1}] ${voice.name}`,
    `\n   Lang: ${voice.lang}`,
    `\n   Category: ${category}`,
    matchedMale.length > 0 ? `\n   Male keywords: ${matchedMale.join(', ')}` : '',
    matchedFemale.length > 0 ? `\n   Female keywords: ${matchedFemale.join(', ')}` : '',
    '\n'
  );
});

console.log('\n📊 === SUMMARY ===');
console.log(`👨 Male voices: ${male.length}`);
male.forEach(v => console.log(`   - ${v.name}`));

console.log(`\n👩 Female voices: ${female.length}`);
female.forEach(v => console.log(`   - ${v.name}`));

console.log(`\n❓ Unclassified: ${unclassified.length}`);
unclassified.forEach(v => console.log(`   - ${v.name}`));

console.log('\n🎯 To test a voice, run:');
console.log('speechSynthesis.speak(new SpeechSynthesisUtterance("Hello, this is a test."));');
