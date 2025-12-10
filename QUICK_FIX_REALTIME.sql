-- QUICK FIX: Chạy tất cả lệnh này trong Supabase SQL Editor
-- https://supabase.com/dashboard/project/vehatkcukaloprvqcejz/sql/new

-- 1. TẮT RLS để test (dễ nhất)
ALTER TABLE "Message" DISABLE ROW LEVEL SECURITY;

-- 2. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE "Message";

-- 3. Verify
SELECT 
  'Table name' as check_type,
  tablename as value
FROM pg_tables 
WHERE schemaname = 'public' AND tablename LIKE '%essage%'

UNION ALL

SELECT 
  'Realtime enabled' as check_type,
  tablename as value
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' AND tablename LIKE '%essage%'

UNION ALL

SELECT 
  'RLS status' as check_type,
  CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as value
FROM pg_tables 
WHERE tablename = 'Message';
