-- Script để kiểm tra và enable Realtime cho bảng Message
-- Chạy script này trong Supabase SQL Editor

-- 1. Kiểm tra xem Realtime đã được enable cho bảng Message chưa
SELECT schemaname, tablename, 
       CASE 
         WHEN tablename = ANY(current_setting('supabase.realtime.tables', true)::text[])
         THEN 'Enabled'
         ELSE 'Disabled'
       END as realtime_status
FROM pg_tables 
WHERE tablename = 'Message';

-- 2. Enable Realtime cho bảng Message (nếu chưa có)
ALTER PUBLICATION supabase_realtime ADD TABLE "Message";

-- 3. Kiểm tra Row Level Security (RLS) policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'Message';

-- 4. Nếu cần tạo RLS policy cho SELECT (để client có thể đọc realtime updates)
-- Uncomment nếu cần:
-- ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;

-- DROP POLICY IF EXISTS "Users can view messages in their conversations" ON "Message";
-- CREATE POLICY "Users can view messages in their conversations"
-- ON "Message"
-- FOR SELECT
-- USING (
--   EXISTS (
--     SELECT 1 FROM "ConversationMember"
--     WHERE "ConversationMember"."conversationId" = "Message"."conversationId"
--     AND "ConversationMember"."userId" = auth.uid()
--   )
-- );

-- 5. Kiểm tra publication
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
