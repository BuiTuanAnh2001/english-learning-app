-- Chỉ cần chạy lệnh này thôi:
ALTER TABLE "Message" DISABLE ROW LEVEL SECURITY;

-- Kiểm tra xem đã tắt chưa:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'Message';

-- Kết quả phải là: rowsecurity = false
