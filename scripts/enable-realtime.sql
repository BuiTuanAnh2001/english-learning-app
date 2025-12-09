-- Enable Realtime for tables
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/vehatkcukaloprvqcejz/editor)

-- 1. Enable Realtime for Message table
ALTER PUBLICATION supabase_realtime ADD TABLE "Message";

-- 2. Enable Realtime for Notification table
ALTER PUBLICATION supabase_realtime ADD TABLE "Notification";

-- 3. Enable Realtime for Friendship table (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE "Friendship";

-- 4. Disable RLS (because we use custom JWT auth, not Supabase Auth)
ALTER TABLE "Message" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Friendship" DISABLE ROW LEVEL SECURITY;

-- 5. Grant permissions for realtime
GRANT SELECT, INSERT, UPDATE, DELETE ON "Message" TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "Notification" TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON "Friendship" TO anon, authenticated;

-- Verify realtime is enabled
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
