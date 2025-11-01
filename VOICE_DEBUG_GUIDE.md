# 🎤 Hướng dẫn Test & Debug Giọng nói

## Vấn đề phát hiện

Một số giọng nói bị phân loại sai giới tính:
- Lisa → Bị nhận là giọng nam ❌
- David → Bị nhận là giọng nữ ❌

## Cách Test

### 1. Test trong Admin Panel

1. Đăng nhập Admin với mật khẩu: `bta@23901`
2. Click nút **"🎤 Test Giọng nói"**
3. Xem danh sách giọng được phân loại:
   - 👨 Male Voices
   - 👩 Female Voices
4. Click "Test" để nghe thử từng giọng
5. Kiểm tra xem Lisa có ở Female, David có ở Male không

### 2. Test trong Browser Console

Mở DevTools (F12) và paste script sau:

```javascript
// Copy từ file: scripts/test-voice-classification.js
// Hoặc chạy trực tiếp trong console
```

Script sẽ hiển thị:
- Tổng số giọng có sẵn
- Danh sách giọng nam/nữ
- Giọng chưa phân loại
- Kiểm tra cụ thể Lisa, David, Emma, Daniel, Samantha

### 3. Test trong Dialogue View

1. Vào một bài học có hội thoại
2. Mở Console (F12)
3. Click vào icon 🔊 để phát giọng
4. Xem log trong console:
   ```
   🎤 Voice Debug: { speakerIndex: 0, maleVoices: [...], femaleVoices: [...] }
   ✅ Speaker 0 (Female): Microsoft Lisa - English
   ```

## Giải pháp đã implement

### 1. Cải thiện Keywords

**Female Keywords:**
```typescript
'Female', 'female', 'Woman', 'woman', 'feminine',
'Samantha', 'Karen', 'Victoria', 'Susan', 'Zira', 'Joanna',
'Kate', 'Lisa', 'Emma', 'Amy', 'Salli', 'Kimberly',
'Moira', 'Fiona', 'Serena', 'Tessa', 'Ava', 'Allison',
'Nữ', 'female-', 'girl', 'lady'
```

**Male Keywords:**
```typescript
'Male', 'male', 'Man', 'man', 'masculine',
'David', 'Daniel', 'James', 'Thomas', 'Alex', 'George', 
'Fred', 'Oliver', 'Rishi', 'Ryan', 'Aaron', 'Bruce',
'Guy', 'Male', 'Nam', 'male-'
```

### 2. Thay đổi Logic Phân loại

**Trước:**
```typescript
if (isMale && !isFemale) {
  male.push(voice);
} else if (isFemale && !isMale) {
  female.push(voice);
}
```

**Sau:**
```typescript
// Ưu tiên female keywords trước
if (isFemale) {
  female.push(voice);
} else if (isMale) {
  male.push(voice);
}
```

### 3. Thêm Debug Logging

```typescript
console.log('🔍 Voice Classification Debug:', {
  name: voice.name,
  isMale,
  isFemale,
  matchedMale: maleKeywords.filter(k => voiceLower.includes(k.toLowerCase())),
  matchedFemale: femaleKeywords.filter(k => voiceLower.includes(k.toLowerCase()))
});
```

### 4. Hỗ trợ Giọng Việt Nam

```typescript
const englishVoices = voices.filter(v => 
  v.lang.startsWith('en') || 
  v.lang.startsWith('vi') || 
  v.name.includes('Vietnam')
);
```

## Kiểm tra Giọng nói trong Hệ thống

### macOS
- Samantha (Female) ✅
- Karen (Female) ✅
- Alex (Male) ✅
- Fred (Male) ✅

### Windows
- Microsoft David Desktop (Male) ✅
- Microsoft Zira Desktop (Female) ✅
- Microsoft Mark (Male) ✅
- Microsoft Eva (Female) ✅

### Chrome/Edge (Network voices)
- Google US English (Female) ✅
- Google UK English Male (Male) ✅
- Google UK English (Female) ✅

### Vietnamese Voices (if available)
- Any voice with "Vietnam" in name
- Voices with lang starting with "vi"

## Debugging Steps

1. **Xem tất cả giọng có sẵn:**
   ```javascript
   console.log(speechSynthesis.getVoices());
   ```

2. **Tìm giọng cụ thể:**
   ```javascript
   const lisa = speechSynthesis.getVoices()
     .find(v => v.name.toLowerCase().includes('lisa'));
   console.log(lisa);
   ```

3. **Test giọng ngay:**
   ```javascript
   const utterance = new SpeechSynthesisUtterance("Hello, this is a test");
   utterance.voice = lisa;
   speechSynthesis.speak(utterance);
   ```

4. **Xem classification:**
   - Mở Admin panel
   - Click "🎤 Test Giọng nói"
   - Kiểm tra Lisa có trong Female Voices không

## Nếu vẫn bị sai

### Nguyên nhân có thể:

1. **Tên giọng không chứa "Lisa":**
   - Có thể là "Microsoft Lisa Online"
   - Hoặc "Google Lisa" 
   - Cần thêm vào keywords

2. **Giọng có cả male và female trong tên:**
   - Ví dụ: "Lisa (Female, Male)"
   - Logic sẽ ưu tiên female

3. **Browser không hỗ trợ giọng đó:**
   - Thử browser khác (Chrome, Edge, Safari)
   - Kiểm tra System Preferences > Accessibility > Spoken Content

### Cách fix thủ công:

1. Mở `lib/utils/speech.ts`
2. Thêm tên giọng cụ thể vào keywords:
   ```typescript
   const femaleKeywords = [
     // ... existing keywords
     'Lisa', // Đảm bảo Lisa có trong list
     'Tên_Giọng_Cụ_Thể_Của_Bạn'
   ];
   ```

## Test Final

1. Vào bài học có dialogue (Lesson 15 hoặc 16)
2. Click icon 🔊 ở dialogue đầu tiên
3. Check console log:
   - `✅ Speaker 0 (Female): [Tên giọng nữ]`
4. Click icon 🔊 ở dialogue thứ 2
5. Check console log:
   - `✅ Speaker 1 (Male): [Tên giọng nam]`
6. Nghe và xác nhận giọng đúng

## Support

Nếu vẫn gặp vấn đề:
1. Copy toàn bộ log từ console
2. Chạy `scripts/test-voice-classification.js` trong console
3. Screenshot Admin Voice Debug Panel
4. Báo cáo với thông tin:
   - Browser & version
   - OS & version
   - List giọng có sẵn
   - Giọng nào bị sai
