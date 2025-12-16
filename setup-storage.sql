-- Script để tạo Storage Bucket cho chat images
-- Chạy trong Supabase SQL Editor

-- 1. Tạo bucket 'chat-images' (nếu chưa có)
-- Lưu ý: Có thể cần tạo bucket qua UI Dashboard thay vì SQL

-- 2. Tạo RLS policies cho Storage
-- Allow authenticated users to upload images
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Policy: Cho phép user upload file vào folder của họ
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Policy: Cho phép mọi người xem file (public bucket)
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'chat-images');

-- 5. Policy: Cho phép user xóa file của họ
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
