# 🔄 Cách xóa cache để thấy vocabulary packs mới

## Vấn đề
Bạn đã thêm vocabulary packs nhưng vẫn chỉ thấy 13 bài học cũ vì localStorage đã lưu data cũ.

## Giải pháp - Chọn 1 trong 3 cách:

### ✅ Cách 1: Xóa localStorage qua Console (Nhanh nhất)

1. Mở trang web
2. Nhấn `F12` để mở DevTools
3. Vào tab **Console**
4. Gõ lệnh này và Enter:
```javascript
localStorage.clear()
location.reload()
```

### ✅ Cách 2: Xóa qua Application tab

1. Mở trang web
2. Nhấn `F12` để mở DevTools
3. Vào tab **Application**
4. Bên trái, chọn **Storage** → **Local Storage** → chọn domain của bạn
5. Click chuột phải và chọn **Clear**
6. Refresh trang (`F5`)

### ✅ Cách 3: Thêm nút "Reset Data" vào web

Tôi có thể thêm một nút vào Admin panel để bạn reset data dễ dàng hơn!

## Sau khi xóa cache:

Refresh trang và bạn sẽ thấy:
- ✅ **20 lessons** (thay vì 13)
- ✅ **820+ vocabulary items**
- ✅ 7 bộ từ vựng mới xuất hiện

## Lưu ý

- Data cũ của bạn (nếu có custom lessons) sẽ bị xóa
- Nếu muốn giữ data, export trước khi clear localStorage
