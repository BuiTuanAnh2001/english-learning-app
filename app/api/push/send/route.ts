import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as webpush from "web-push";

// Configure web-push with VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:your-email@example.com";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipientId, title, body, url, icon, image } = await req.json();

    if (!recipientId) {
      return NextResponse.json(
        { error: "recipientId is required" },
        { status: 400 }
      );
    }

    // Get recipient's push subscription
    const subscription = await prisma.pushSubscription.findUnique({
      where: { userId: recipientId },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "User has no push subscription" },
        { status: 404 }
      );
    }

    // Prepare push notification payload
    const payload = JSON.stringify({
      title: title || "ChatApp",
      body: body || "Bạn có tin nhắn mới",
      icon: icon || "/icon.svg",
      image,
      url: url || "/chat",
      tag: `notification-${Date.now()}`,
    });

    // Send push notification
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: subscription.keys as { p256dh: string; auth: string },
    };

    await webpush.sendNotification(pushSubscription, payload);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending push notification:", error);
    
    // If subscription is invalid, remove it from database
    if (error.statusCode === 410 || error.statusCode === 404) {
      const { recipientId } = await req.json();
      await prisma.pushSubscription.delete({
        where: { userId: recipientId },
      }).catch(() => {});
    }

    return NextResponse.json(
      { error: "Failed to send push notification", details: error.message },
      { status: 500 }
    );
  }
}
