-- Script kiểm tra Supabase Realtime setup
-- Chạy trong Supabase SQL Editor

-- BƯỚC 1: Kiểm tra table name chính xác
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE '%essage%';

-- BƯỚC 2: Kiểm tra Realtime publication (tables được enable cho realtime)
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- BƯỚC 3: Kiểm tra RLS có được enable không
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'Message';

-- BƯỚC 4: Kiểm tra RLS policies hiện tại
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'Message';

-- BƯỚC 5: TẮT RLS HOÀN TOÀN ĐỂ TEST (chạy lệnh này)
ALTER TABLE "Message" DISABLE ROW LEVEL SECURITY;

-- Nếu muốn BẬT lại RLS sau khi test xong:
-- ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;

-- BƯỚC 6: Hoặc tạo policy CHO PHÉP TẤT CẢ (nếu muốn giữ RLS)
DROP POLICY IF EXISTS "Allow all for authenticated users" ON "Message";
CREATE POLICY "Allow all for authenticated users"
ON "Message"
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- BƯỚC 7: Enable Realtime cho Message table (nếu chưa enable)
ALTER PUBLICATION supabase_realtime ADD TABLE "Message";

-- BƯỚC 8: Test query
SELECT COUNT(*) as total_messages FROM "Message";
