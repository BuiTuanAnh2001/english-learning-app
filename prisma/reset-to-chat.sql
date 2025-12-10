-- Drop all existing tables (CAREFUL!)
DROP TABLE IF EXISTS "QuizAnswer" CASCADE;
DROP TABLE IF EXISTS "QuizResult" CASCADE;
DROP TABLE IF EXISTS "QuizQuestion" CASCADE;
DROP TABLE IF EXISTS "Quiz" CASCADE;
DROP TABLE IF EXISTS "VocabularyNote" CASCADE;
DROP TABLE IF EXISTS "UserProgress" CASCADE;
DROP TABLE IF EXISTS "Tip" CASCADE;
DROP TABLE IF EXISTS "Objective" CASCADE;
DROP TABLE IF EXISTS "DialogueLine" CASCADE;
DROP TABLE IF EXISTS "Dialogue" CASCADE;
DROP TABLE IF EXISTS "Phrase" CASCADE;
DROP TABLE IF EXISTS "Vocabulary" CASCADE;
DROP TABLE IF EXISTS "Lesson" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "Notification" CASCADE;
DROP TABLE IF EXISTS "Message" CASCADE;
DROP TABLE IF EXISTS "Friendship" CASCADE;
DROP TABLE IF EXISTS "ReadReceipt" CASCADE;
DROP TABLE IF EXISTS "TypingStatus" CASCADE;
DROP TABLE IF EXISTS "ConversationMember" CASCADE;
DROP TABLE IF EXISTS "Conversation" CASCADE;
DROP TABLE IF EXISTS "VerificationToken" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Drop old enums
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "Level" CASCADE;
DROP TYPE IF EXISTS "Gender" CASCADE;
DROP TYPE IF EXISTS "QuestionType" CASCADE;
DROP TYPE IF EXISTS "FriendshipStatus" CASCADE;
DROP TYPE IF EXISTS "NotificationType" CASCADE;
DROP TYPE IF EXISTS "Difficulty" CASCADE;
DROP TYPE IF EXISTS "QuizType" CASCADE;
DROP TYPE IF EXISTS "UserStatus" CASCADE;
DROP TYPE IF EXISTS "ConversationType" CASCADE;
DROP TYPE IF EXISTS "MemberRole" CASCADE;
DROP TYPE IF EXISTS "MessageType" CASCADE;

-- Create new enums
CREATE TYPE "UserStatus" AS ENUM ('ONLINE', 'AWAY', 'BUSY', 'OFFLINE');
CREATE TYPE "ConversationType" AS ENUM ('DIRECT', 'GROUP');
CREATE TYPE "MemberRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE', 'SYSTEM');

-- Create User table
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "avatar" TEXT,
    "image" TEXT,
    "provider" TEXT,
    "providerId" TEXT,
    "password" TEXT,
    "bio" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'OFFLINE',
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create Conversation table
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "type" "ConversationType" NOT NULL DEFAULT 'DIRECT',
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create ConversationMember table
CREATE TABLE "ConversationMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConversationMember_conversationId_userId_key" UNIQUE ("conversationId", "userId"),
    CONSTRAINT "ConversationMember_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE,
    CONSTRAINT "ConversationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create Message table
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "replyToId" TEXT,
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "Message_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Message"("id") ON DELETE SET NULL
);

-- Create ReadReceipt table
CREATE TABLE "ReadReceipt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReadReceipt_messageId_userId_key" UNIQUE ("messageId", "userId"),
    CONSTRAINT "ReadReceipt_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE
);

-- Create TypingStatus table
CREATE TABLE "TypingStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isTyping" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TypingStatus_conversationId_userId_key" UNIQUE ("conversationId", "userId"),
    CONSTRAINT "TypingStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create NextAuth tables
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_provider_providerAccountId_key" UNIQUE ("provider", "providerAccountId"),
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VerificationToken_identifier_token_key" UNIQUE ("identifier", "token")
);

-- Create indexes
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "ConversationMember_conversationId_idx" ON "ConversationMember"("conversationId");
CREATE INDEX "ConversationMember_userId_idx" ON "ConversationMember"("userId");
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");
CREATE INDEX "ReadReceipt_messageId_idx" ON "ReadReceipt"("messageId");
CREATE INDEX "TypingStatus_conversationId_idx" ON "TypingStatus"("conversationId");
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- Enable Realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE "User";
ALTER PUBLICATION supabase_realtime ADD TABLE "Conversation";
ALTER PUBLICATION supabase_realtime ADD TABLE "ConversationMember";
ALTER PUBLICATION supabase_realtime ADD TABLE "Message";
ALTER PUBLICATION supabase_realtime ADD TABLE "ReadReceipt";
ALTER PUBLICATION supabase_realtime ADD TABLE "TypingStatus";
