-- Script kiểm tra Supabase Realtime setup
-- Chạy trong Supabase SQL Editor

-- 1. Kiểm tra table name chính xác
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE '%essage%';

-- 2. Kiểm tra Realtime publication (tables được enable cho realtime)
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- 3. Kiểm tra RLS policies cho Message table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'Message' OR tablename = 'message';

-- 4. Enable Realtime cho Message table (nếu chưa enable)
-- CHẠY LỆNH NÀY nếu bước 2 không thấy Message table
ALTER PUBLICATION supabase_realtime ADD TABLE "Message";

-- Hoặc nếu table name là lowercase:
-- ALTER PUBLICATION supabase_realtime ADD TABLE "message";

-- 5. Tạo policy cho realtime (nếu chưa có)
-- Policy này cho phép authenticated users xem tất cả messages
DROP POLICY IF EXISTS "Enable realtime for Message" ON "Message";
CREATE POLICY "Enable realtime for Message"
ON "Message"
FOR SELECT
TO authenticated
USING (true);

-- 6. Kiểm tra xem user có thể query Message table không
SELECT COUNT(*) as total_messages FROM "Message";

-- 7. Test insert một message (để trigger realtime)
-- INSERT INTO "Message" (id, "conversationId", "senderId", content, type)
-- VALUES ('test-' || gen_random_uuid(), 'YOUR_CONVERSATION_ID', 'YOUR_USER_ID', 'Test realtime message', 'TEXT');
