# 🚀 Load Vocabulary Packs tự động

## Cách 1: Load trong lib/services/storage.ts (RECOMMENDED)

Sửa file `lib/services/storage.ts`:

```typescript
import { lessons as defaultLessons } from '../data/lessons';

// Import vocab packs
import vocabVerbs from '../../public/vocab-packs/100-basic-verbs.json';
import vocabAdjectives from '../../public/vocab-packs/150-adjectives.json';
import vocabAdverbs from '../../public/vocab-packs/100-adverbs.json';
import vocabPhrases from '../../public/vocab-packs/150-phrases.json';
import vocabBusiness from '../../public/vocab-packs/100-business.json';
import vocabTravel from '../../public/vocab-packs/100-travel.json';
import vocabFood from '../../public/vocab-packs/120-food-cooking.json';

const STORAGE_KEY = 'englishapp_lessons';

// Combine default lessons with vocab packs
const allDefaultLessons = [
  ...defaultLessons,
  ...vocabVerbs,
  ...vocabAdjectives,
  ...vocabAdverbs,
  ...vocabPhrases,
  ...vocabBusiness,
  ...vocabTravel,
  ...vocabFood,
];

export const getLessons = (): Lesson[] => {
  if (typeof window === 'undefined') return allDefaultLessons; // SSR

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allDefaultLessons));
    return allDefaultLessons;
  }

  return JSON.parse(stored);
};
```

## Cách 2: Thêm vào lessons.ts (MANUAL)

Copy nội dung từ file vocab packs và paste vào cuối array `lessons` trong `lib/data/lessons.ts`.

File đã có 13 bài học + 100 động từ. Bạn cần thêm 6 pack còn lại.

## Cách 3: Script tự động (Node.js)

Chạy script:

```bash
cd /workspaces/english-learning-app
node scripts/import-vocab-packs.js
```

Script sẽ tự động merge tất cả vocab packs vào `lib/data/lessons.ts`.

## Kiểm tra

Sau khi load xong, bạn sẽ có:
- 13 bài học gốc
- 7 vocabulary packs (820+ items)
- Tổng: 20 lessons

Refresh trang và check tại `/lessons` - sẽ thấy tất cả ngay!

## Khuyến nghị

**Cách 1 là tốt nhất** vì:
- ✅ Không làm phình to file lessons.ts
- ✅ Tách biệt vocab packs ra riêng
- ✅ Dễ maintain và update
- ✅ Load nhanh hơn
