-- Add MessageReaction table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "MessageReaction" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageReaction_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS "MessageReaction_messageId_userId_emoji_key" 
ON "MessageReaction"("messageId", "userId", "emoji");

-- Create index
CREATE INDEX IF NOT EXISTS "MessageReaction_messageId_idx" 
ON "MessageReaction"("messageId");

-- Add foreign key constraint
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_messageId_fkey" 
FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable Realtime for reactions (optional, if you want realtime reaction updates via postgres_changes)
ALTER PUBLICATION supabase_realtime ADD TABLE "MessageReaction";
