import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBrowserClient } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { messageId } = params;

    // Check if message exists
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Don't create read receipt for own messages
    if (message.senderId === currentUser.id) {
      return NextResponse.json({ success: true });
    }

    // Create or update read receipt
    const readReceipt = await prisma.readReceipt.upsert({
      where: {
        messageId_userId: {
          messageId: messageId,
          userId: currentUser.id,
        },
      },
      update: {
        readAt: new Date(),
      },
      create: {
        messageId: messageId,
        userId: currentUser.id,
      },
    });

    // Broadcast read receipt via Supabase
    const supabase = createBrowserClient();
    if (supabase) {
      const channel = supabase.channel(`conversation:${message.conversationId}`);
      await channel.send({
        type: "broadcast",
        event: "message_read",
        payload: {
          messageId: messageId,
          userId: currentUser.id,
          userName: currentUser.name,
          readAt: readReceipt.readAt,
        },
      });
    }

    return NextResponse.json({ success: true, data: readReceipt });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
