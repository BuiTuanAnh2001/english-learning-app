// Voice Classification Test Script
// Paste this in browser console to debug voice issues

console.clear();
console.log('🎤 Voice Classification Test Starting...\n');

// Get all voices
const allVoices = window.speechSynthesis.getVoices();
console.log(`📊 Total voices available: ${allVoices.length}\n`);

// English voices
const englishVoices = allVoices.filter(v => v.lang.startsWith('en'));
console.log(`🇺🇸 English voices: ${englishVoices.length}`);

// Vietnamese voices
const vietnameseVoices = allVoices.filter(v => v.lang.startsWith('vi') || v.name.includes('Vietnam'));
console.log(`🇻🇳 Vietnamese voices: ${vietnameseVoices.length}\n`);

// Keywords for classification
const maleKeywords = [
  'Male', 'male', 'Man', 'man', 'masculine',
  'David', 'Daniel', 'James', 'Thomas', 'Alex', 'George', 
  'Fred', 'Oliver', 'Rishi', 'Ryan', 'Aaron', 'Bruce',
  'Guy', 'Male', 'Nam', 'male-'
];

const femaleKeywords = [
  'Female', 'female', 'Woman', 'woman', 'feminine',
  'Samantha', 'Karen', 'Victoria', 'Susan', 'Zira', 'Joanna',
  'Kate', 'Lisa', 'Emma', 'Amy', 'Salli', 'Kimberly',
  'Moira', 'Fiona', 'Serena', 'Tessa', 'Ava', 'Allison',
  'Nữ', 'female-', 'girl', 'lady'
];

// Classify voices
const male = [];
const female = [];
const unclassified = [];

[...englishVoices, ...vietnameseVoices].forEach(voice => {
  const voiceLower = voice.name.toLowerCase();
  const isMale = maleKeywords.some(keyword => voiceLower.includes(keyword.toLowerCase()));
  const isFemale = femaleKeywords.some(keyword => voiceLower.includes(keyword.toLowerCase()));
  
  if (isFemale) {
    female.push(voice);
  } else if (isMale) {
    male.push(voice);
  } else {
    unclassified.push(voice);
  }
});

console.log('👨 MALE VOICES:', male.length);
male.forEach((v, i) => console.log(`  ${i + 1}. ${v.name} (${v.lang})`));

console.log('\n👩 FEMALE VOICES:', female.length);
female.forEach((v, i) => console.log(`  ${i + 1}. ${v.name} (${v.lang})`));

console.log('\n❓ UNCLASSIFIED VOICES:', unclassified.length);
unclassified.forEach((v, i) => console.log(`  ${i + 1}. ${v.name} (${v.lang})`));

// Check specific voices
console.log('\n🔍 Checking specific voices:');
const checkVoice = (name) => {
  const voice = allVoices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
  if (voice) {
    const voiceLower = voice.name.toLowerCase();
    const isMale = maleKeywords.some(keyword => voiceLower.includes(keyword.toLowerCase()));
    const isFemale = femaleKeywords.some(keyword => voiceLower.includes(keyword.toLowerCase()));
    const category = isFemale ? '👩 FEMALE' : isMale ? '👨 MALE' : '❓ UNCLASSIFIED';
    console.log(`  ${name} → ${category} (${voice.name})`);
  } else {
    console.log(`  ${name} → ❌ NOT FOUND`);
  }
};

checkVoice('Lisa');
checkVoice('David');
checkVoice('Emma');
checkVoice('Daniel');
checkVoice('Samantha');

console.log('\n✅ Test complete!');
console.log('\n💡 To test a voice, run:');
console.log('const voice = speechSynthesis.getVoices().find(v => v.name.includes("Lisa"));');
console.log('const utterance = new SpeechSynthesisUtterance("Hello, this is a test");');
console.log('utterance.voice = voice;');
console.log('speechSynthesis.speak(utterance);');
