# 🎤 KIỂM TRA GIỌNG NÓI NHANH

## Bước 1: Mở trang có dialogue

Vào trang bài học bất kỳ có dialogue (ví dụ: Lesson 15 - Gia đình)

## Bước 2: Mở Console

- **Windows/Linux**: Nhấn `F12` hoặc `Ctrl + Shift + J`
- **Mac**: Nhấn `Cmd + Option + J`

## Bước 3: Chạy lệnh test

Copy và paste vào Console:

```javascript
// Test xem có bao nhiêu giọng
const voices = speechSynthesis.getVoices();
console.log('Total voices:', voices.length);
console.log('English voices:', voices.filter(v => v.lang.startsWith('en')));

// Tìm Lisa và David
const lisa = voices.find(v => v.name.includes('Lisa'));
const david = voices.find(v => v.name.includes('David'));

console.log('Lisa:', lisa);
console.log('David:', david);

// Test phát giọng
if (lisa) {
  const utterance = new SpeechSynthesisUtterance('Hello, I am Lisa');
  utterance.voice = lisa;
  speechSynthesis.speak(utterance);
}
```

## Bước 4: Click nút phát giọng trong dialogue

Trong Console bạn sẽ thấy log:

```
🎤 Available Voices for Dialogue:
👨 Male voices: ['Microsoft David - English (United States)']
👩 Female voices: ['Microsoft Lisa - English (United States)']

🎙️ Speaker 0 [Female]: "Hi! Tell me about your fami..." → Microsoft Lisa - English (United States)
🎙️ Speaker 1 [Male]: "Sure! I come from a big fami..." → Microsoft David - English (United States)
```

## ❓ Nếu Lisa vẫn là giọng nam

1. Copy code này vào Console:

```javascript
const voices = speechSynthesis.getVoices();
const lisa = voices.find(v => v.name.includes('Lisa'));
console.log('Lisa voice details:', {
  name: lisa?.name,
  lang: lisa?.lang,
  localService: lisa?.localService,
  voiceURI: lisa?.voiceURI
});

// Kiểm tra xem Lisa có từ "male" trong tên không
if (lisa && lisa.name.toLowerCase().includes('male')) {
  console.log('⚠️ WARNING: Lisa has "male" in name:', lisa.name);
}
```

2. Chụp màn hình và gửi cho dev

## ✅ Nếu đúng

Bạn sẽ nghe:
- Speaker 0 (A): Giọng nữ (Lisa hoặc tương tự)
- Speaker 1 (B): Giọng nam (David hoặc tương tự)
- Speaker 2 (A): Giọng nữ (Lisa)
- Speaker 3 (B): Giọng nam (David)

## 🔧 Bật Debug Mode

Nếu muốn xem chi tiết hơn, mở `/lib/utils/speech.ts` và thay đổi:

```typescript
const DEBUG_VOICE_CLASSIFICATION = true;  // Thay false → true
```

Sau đó refresh trang, Console sẽ hiển thị toàn bộ quá trình phân loại giọng.
