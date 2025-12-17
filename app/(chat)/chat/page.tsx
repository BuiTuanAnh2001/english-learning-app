"use client";

import { GifPicker } from "@/components/chat/gif-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  registerServiceWorker,
  requestNotificationPermission,
  subscribeToPushNotifications,
} from "@/lib/push-notification";
import { createBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Archive,
  Check,
  CheckCheck,
  FileText,
  Image as ImageIcon,
  LogOut,
  MessageSquare,
  MoreVertical,
  Phone,
  Plus,
  Reply,
  Search,
  Send,
  Settings,
  Smile,
  User as UserIcon,
  Users,
  Video,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

// Custom hook for mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  type: "DIRECT" | "GROUP";
  isOnline?: boolean;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  createdAt: Date;
  type: "TEXT" | "IMAGE" | "FILE" | "GIF";
  fileUrl?: string;
  fileName?: string;
  reactions?: { [emoji: string]: { userId: string; userName: string }[] };
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
    type?: "TEXT" | "IMAGE" | "FILE" | "GIF";
    fileUrl?: string;
    fileName?: string;
  };
  readReceipts?: { userId: string; readAt: Date }[];
}

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "messages" | "contacts" | "profile"
  >("messages");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<{
    [conversationId: string]: { userId: string; userName: string }[];
  }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(
    null
  );
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showConversationList, setShowConversationList] = useState(true);
  const isMobile = useIsMobile();

  // Define callbacks before useEffect to avoid dependency issues
  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const response = await res.json();
        const conversations = response.success ? response.data : [];

        // Transform the data to match our interface
        const transformedConversations = (conversations || []).map(
          (conv: any) => {
            const otherMember = conv.members?.find(
              (m: any) => m.userId !== session?.user?.id
            );

            return {
              id: conv.id,
              name:
                conv.type === "GROUP"
                  ? conv.name
                  : otherMember?.user?.name || "Unknown",
              avatar:
                conv.type === "GROUP" ? conv.avatar : otherMember?.user?.avatar,
              lastMessage: conv.messages?.[0]?.content,
              lastMessageTime: conv.messages?.[0]?.createdAt,
              unreadCount: conv.unreadCount || 0,
              type: conv.type,
              isOnline: otherMember?.user?.status === "ONLINE",
            };
          }
        );

        // Deduplicate conversations by ID
        const uniqueConversations = transformedConversations.filter(
          (conv: Conversation, index: number, self: Conversation[]) =>
            index === self.findIndex((c) => c.id === conv.id)
        );

        setConversations(uniqueConversations);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      setConversations([]);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [session?.user?.id]);

  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (res.ok) {
        const response = await res.json();
        const messagesData = response.success ? response.data : [];

        // Transform messages to match our interface
        const transformedMessages = (messagesData || []).map((msg: any) => {
          // Transform reactions from array to object format
          const reactionsObj: {
            [emoji: string]: { userId: string; userName: string }[];
          } = {};
          if (msg.reactions && Array.isArray(msg.reactions)) {
            msg.reactions.forEach((reaction: any) => {
              if (!reactionsObj[reaction.emoji]) {
                reactionsObj[reaction.emoji] = [];
              }
              reactionsObj[reaction.emoji].push({
                userId: reaction.userId,
                userName: reaction.user?.name || "Unknown",
              });
            });
          }

          return {
            id: msg.id,
            content: msg.content,
            senderId: msg.senderId,
            senderName: msg.sender?.name || "Unknown",
            senderAvatar: msg.sender?.avatar,
            createdAt: msg.createdAt,
            type: msg.type || "TEXT",
            fileUrl: msg.fileUrl,
            fileName: msg.fileName,
            reactions: reactionsObj,
            replyTo: msg.replyTo
              ? {
                  id: msg.replyTo.id,
                  content: msg.replyTo.content,
                  senderName: msg.replyTo.sender?.name || "Unknown",
                  type: msg.replyTo.type,
                  fileUrl: msg.replyTo.fileUrl,
                  fileName: msg.replyTo.fileName,
                }
              : undefined,
            readReceipts: msg.readReceipts || [],
          };
        });

        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Không thể tải tin nhắn");
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // Broadcast typing status
  const broadcastTyping = useCallback(
    async (isTyping: boolean) => {
      if (!selectedConversation?.id || !session?.user) return;

      const supabase = createBrowserClient();
      if (!supabase) return;

      const channel = supabase.channel(
        `conversation:${selectedConversation.id}`
      );

      try {
        await channel.send({
          type: "broadcast",
          event: isTyping ? "typing_start" : "typing_stop",
          payload: {
            userId: session.user.id,
            userName: session.user.name,
          },
        });
      } catch (error) {
        console.error("Error broadcasting typing status:", error);
      }
    },
    [selectedConversation?.id, session?.user]
  );

  // Handle typing indicator with debounce
  const handleTyping = useCallback(() => {
    broadcastTyping(true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      broadcastTyping(false);
    }, 3000);
  }, [broadcastTyping]);

  // Mark messages as read
  const markMessagesAsRead = useCallback(async () => {
    if (!selectedConversation?.id || !session?.user?.id) return;

    // Find unread messages (messages from others that don't have our read receipt)
    const unreadMessages = messages.filter(
      (msg) =>
        msg.senderId !== session.user.id &&
        !msg.readReceipts?.some((r) => r.userId === session.user.id)
    );

    // Mark each unread message as read
    for (const message of unreadMessages) {
      try {
        await fetch(`/api/messages/${message.id}/read`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }

    // Reset unread count for current conversation
    if (unreadMessages.length > 0) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    }
  }, [selectedConversation?.id, session?.user?.id, messages]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      loadConversations();

      // Register Service Worker and setup push notifications
      const setupPushNotifications = async () => {
        try {
          // First, request permission
          const permission = await requestNotificationPermission();

          if (permission === "denied") {
            console.log("❌ Notification permission denied");
            toast.error(
              "Bạn đã từ chối quyền thông báo. Vui lòng bật lại trong cài đặt trình duyệt."
            );
            return;
          }

          if (permission === "default") {
            console.log("⏳ Notification permission not yet granted");
            return;
          }

          console.log("✅ Notification permission granted");

          // Permission granted, register service worker
          const registration = await registerServiceWorker();
          if (!registration) {
            console.error("❌ Service Worker registration failed");
            toast.error("Không thể đăng ký Service Worker");
            return;
          }

          console.log("✅ Service Worker registered");

          // Subscribe to push notifications
          const subscription = await subscribeToPushNotifications(
            session.user.id
          );
          if (subscription) {
            toast.success("🔔 Thông báo đẩy đã được bật thành công!");
            console.log(
              "🔔 Push notifications enabled:",
              subscription.endpoint
            );
          } else {
            console.warn("⚠️ Failed to subscribe to push notifications");
            toast.error("Không thể đăng ký nhận thông báo đẩy");
          }
        } catch (error) {
          console.error("❌ Setup push notifications error:", error);
          toast.error("Lỗi khi thiết lập thông báo đẩy");
        }
      };

      setupPushNotifications();
    }
  }, [session, loadConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when viewing them
  useEffect(() => {
    if (messages.length > 0 && !document.hidden) {
      markMessagesAsRead();
    }
  }, [messages, markMessagesAsRead]);

  // Realtime subscription for conversation list updates
  useEffect(() => {
    if (!session?.user?.id) return;

    const supabase = createBrowserClient();
    if (!supabase) return;

    console.log("🔌 Setting up user conversation updates subscription");

    // Subscribe to a user-specific channel for new conversations/messages
    const channel = supabase
      .channel(`user:${session.user.id}:updates`)
      .on(
        "broadcast",
        { event: "new_conversation_message" },
        async (payload) => {
          console.log(
            "📨 New conversation message broadcast received:",
            payload
          );
          const { conversationId, message } = payload.payload;

          // Check if this conversation exists in our list
          const existingConv = conversations.find(
            (c) => c.id === conversationId
          );

          if (!existingConv) {
            // This is a new conversation - reload to get it
            console.log(
              "🆕 New conversation detected, reloading conversations..."
            );
            // Use a flag to prevent duplicate loads
            setConversations((currentConvs) => {
              // Double check it's still not there
              if (currentConvs.some((c) => c.id === conversationId)) {
                return currentConvs;
              }
              // Trigger reload in next tick
              setTimeout(() => loadConversations(), 0);
              return currentConvs;
            });
          } else {
            // Update existing conversation
            setConversations((prev) => {
              const updated = prev.map((conv) => {
                if (conv.id === conversationId) {
                  return {
                    ...conv,
                    lastMessage:
                      message.content ||
                      (message.type === "IMAGE"
                        ? "📷 Ảnh"
                        : message.type === "GIF"
                        ? "🎬 GIF"
                        : ""),
                    lastMessageTime: new Date(message.createdAt),
                    unreadCount: (conv.unreadCount || 0) + 1,
                  };
                }
                return conv;
              });

              // Sort conversations by last message time
              return updated.sort((a, b) => {
                const timeA = a.lastMessageTime
                  ? new Date(a.lastMessageTime).getTime()
                  : 0;
                const timeB = b.lastMessageTime
                  ? new Date(b.lastMessageTime).getTime()
                  : 0;
                return timeB - timeA;
              });
            });
          }
        }
      )
      .subscribe((status) => {
        console.log("📡 User updates subscription status:", status);
      });

    return () => {
      console.log("🔌 Cleaning up user updates subscription");
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, loadConversations, conversations]);

  // Realtime subscription for messages
  useEffect(() => {
    if (!selectedConversation?.id || !session?.user?.id) return;

    console.log(
      "🔌 Setting up realtime subscription for conversation:",
      selectedConversation.id
    );
    const supabase = createBrowserClient();
    if (!supabase) {
      console.warn("⚠️ Supabase client not available");
      return;
    }

    // Subscribe to broadcast events (manual broadcasts from API)
    const channel = supabase
      .channel(`conversation:${selectedConversation.id}`)
      .on("broadcast", { event: "new_message" }, (payload) => {
        console.log("📨 New message received via broadcast:", payload);
        const newMsg = payload.payload;

        // Don't add if it's our own message (already added optimistically)
        if (newMsg.senderId === session.user.id) {
          console.log("⏭️ Skipping own message");
          return;
        }

        const message: Message = {
          id: newMsg.id,
          content: newMsg.content,
          senderId: newMsg.senderId,
          senderName: newMsg.senderName || "Unknown",
          senderAvatar: newMsg.senderAvatar,
          createdAt: new Date(newMsg.createdAt),
          type: newMsg.type || "TEXT",
          fileUrl: newMsg.fileUrl,
          fileName: newMsg.fileName,
          replyTo: newMsg.replyTo
            ? {
                id: newMsg.replyTo.id,
                content: newMsg.replyTo.content,
                senderName: newMsg.replyTo.senderName,
                type: newMsg.replyTo.type,
                fileUrl: newMsg.replyTo.fileUrl,
                fileName: newMsg.replyTo.fileName,
              }
            : undefined,
        };

        setMessages((prev) => {
          // Check if message already exists
          if (prev.some((m) => m.id === message.id)) {
            console.log("⏭️ Message already exists, skipping");
            return prev;
          }
          console.log("✅ Adding new message to state");

          // Show notification: toast if in current chat, push if tab hidden
          if (!document.hidden) {
            // User is viewing the app - show toast
            toast.success(
              `${newMsg.senderName || "Ai đó"} đã gửi tin nhắn mới`,
              {
                duration: 3000,
              }
            );
          }

          return [...prev, message];
        });
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `conversationId=eq.${selectedConversation.id}`,
        },
        async (payload) => {
          console.log("📨 New message received via realtime:", payload);
          const newMsg = payload.new as any;

          // Don't add if it's our own message (already added optimistically)
          if (newMsg.senderId === session.user.id) return;

          // Fetch sender info
          try {
            const res = await fetch(`/api/users/${newMsg.senderId}`);
            let senderInfo = { name: "Unknown", avatar: undefined };
            if (res.ok) {
              const user = await res.json();
              senderInfo = { name: user.name, avatar: user.image };
            }

            const message: Message = {
              id: newMsg.id,
              content: newMsg.content,
              senderId: newMsg.senderId,
              senderName: senderInfo.name,
              senderAvatar: senderInfo.avatar,
              createdAt: new Date(newMsg.createdAt),
              type: newMsg.type || "TEXT",
              fileUrl: newMsg.fileUrl,
              fileName: newMsg.fileName,
            };

            setMessages((prev) => {
              // Check if message already exists
              if (prev.some((m) => m.id === message.id)) return prev;

              // Show notification based on user context
              if (document.hidden) {
                // Tab is hidden - show push notification
                if (Notification.permission === "granted") {
                  new Notification(`${senderInfo.name}`, {
                    body:
                      newMsg.type === "IMAGE"
                        ? "📷 Đã gửi một ảnh"
                        : newMsg.type === "GIF"
                        ? "🎬 Đã gửi một GIF"
                        : newMsg.content,
                    icon: senderInfo.avatar || "/default-avatar.png",
                    tag: newMsg.id,
                  });
                }
              } else {
                // Tab is visible - show toast
                const messagePreview =
                  newMsg.type === "IMAGE"
                    ? "📷 Đã gửi một ảnh"
                    : newMsg.type === "GIF"
                    ? "🎬 Đã gửi một GIF"
                    : newMsg.content;
                toast(`${senderInfo.name}: ${messagePreview}`, {
                  duration: 3000,
                  icon: "💬",
                });
              }

              return [...prev, message];
            });
          } catch (error) {
            console.error("Error processing realtime message:", error);
          }
        }
      )
      .on("broadcast", { event: "reaction_added" }, (payload) => {
        const { messageId, userId, userName, emoji } = payload.payload;
        console.log("👍 Reaction added:", payload);

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === messageId) {
              const reactions = msg.reactions || {};
              const emojiReactions = reactions[emoji] || [];

              // Check if user already reacted
              if (emojiReactions.some((r) => r.userId === userId)) {
                return msg;
              }

              return {
                ...msg,
                reactions: {
                  ...reactions,
                  [emoji]: [...emojiReactions, { userId, userName }],
                },
              };
            }
            return msg;
          })
        );

        if (userId !== session.user.id) {
          toast(`${userName} đã thả reaction ${emoji}`, { duration: 2000 });
        }
      })
      .on("broadcast", { event: "reaction_removed" }, (payload) => {
        const { messageId, userId, emoji } = payload.payload;
        console.log("👎 Reaction removed:", payload);

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === messageId) {
              const reactions = { ...(msg.reactions || {}) };
              if (reactions[emoji]) {
                reactions[emoji] = reactions[emoji].filter(
                  (r) => r.userId !== userId
                );
                if (reactions[emoji].length === 0) {
                  delete reactions[emoji];
                }
              }
              return { ...msg, reactions };
            }
            return msg;
          })
        );
      })
      .on("broadcast", { event: "typing_start" }, (payload) => {
        const { userId, userName } = payload.payload;
        console.log("⌨️ User started typing:", userName);

        if (userId !== session.user.id && selectedConversation?.id) {
          setTypingUsers((prev) => {
            const convTyping = prev[selectedConversation.id] || [];
            if (!convTyping.some((u) => u.userId === userId)) {
              return {
                ...prev,
                [selectedConversation.id]: [
                  ...convTyping,
                  { userId, userName },
                ],
              };
            }
            return prev;
          });
        }
      })
      .on("broadcast", { event: "typing_stop" }, (payload) => {
        const { userId } = payload.payload;
        console.log("⌨️ User stopped typing");

        if (selectedConversation?.id) {
          setTypingUsers((prev) => {
            const convTyping = prev[selectedConversation.id] || [];
            return {
              ...prev,
              [selectedConversation.id]: convTyping.filter(
                (u) => u.userId !== userId
              ),
            };
          });
        }
      })
      .on("broadcast", { event: "message_read" }, (payload) => {
        const { messageId, userId, readAt } = payload.payload;
        console.log("👁️ Message read:", payload);

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === messageId) {
              const readReceipts = msg.readReceipts || [];
              // Check if already marked as read by this user
              if (readReceipts.some((r) => r.userId === userId)) {
                return msg;
              }
              return {
                ...msg,
                readReceipts: [
                  ...readReceipts,
                  { userId, readAt: new Date(readAt) },
                ],
              };
            }
            return msg;
          })
        );
      })
      .subscribe((status) => {
        console.log("📡 Subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to realtime updates");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Channel error - Realtime may not be enabled");
        } else if (status === "TIMED_OUT") {
          console.error("⏱️ Subscription timed out");
        }
      });

    return () => {
      console.log("🔌 Cleaning up realtime subscription");
      supabase.removeChannel(channel);

      // Clear typing indicator when leaving conversation
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      broadcastTyping(false);
    };
  }, [selectedConversation?.id, session?.user?.id, broadcastTyping]);

  const handleConversationClick = useCallback(
    (conversation: Conversation) => {
      setSelectedConversation(conversation);
      loadMessages(conversation.id);
      // On mobile, hide conversation list when chat is selected
      if (window.innerWidth < 768) {
        setShowConversationList(false);
      }
    },
    [loadMessages]
  );

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh!");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh tối đa 5MB!");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleAddReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!session?.user?.id) return;

      setShowReactionPicker(null);

      // Optimistic update
      const userId = session.user.id;
      const userName = session.user.name || "You";

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId) {
            const reactions = { ...(msg.reactions || {}) };
            const emojiReactions = reactions[emoji] || [];

            // Check if already reacted - toggle reaction
            const alreadyReacted = emojiReactions.some(
              (r) => r.userId === userId
            );

            if (alreadyReacted) {
              reactions[emoji] = emojiReactions.filter(
                (r) => r.userId !== userId
              );
              if (reactions[emoji].length === 0) delete reactions[emoji];
            } else {
              reactions[emoji] = [...emojiReactions, { userId, userName }];
            }

            return { ...msg, reactions };
          }
          return msg;
        })
      );

      // Debounce API call
      if (reactionTimeoutRef.current) {
        clearTimeout(reactionTimeoutRef.current);
      }

      reactionTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/messages/${messageId}/reactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emoji }),
          });

          if (!res.ok) {
            // Revert optimistic update on error
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id === messageId) {
                  const reactions = { ...(msg.reactions || {}) };
                  const emojiReactions = reactions[emoji] || [];
                  const alreadyReacted = emojiReactions.some(
                    (r) => r.userId === userId
                  );

                  if (alreadyReacted) {
                    reactions[emoji] = emojiReactions.filter(
                      (r) => r.userId !== userId
                    );
                    if (reactions[emoji].length === 0) delete reactions[emoji];
                  } else {
                    reactions[emoji] = [
                      ...emojiReactions,
                      { userId, userName },
                    ];
                  }

                  return { ...msg, reactions };
                }
                return msg;
              })
            );
            toast.error("Không thể thả reaction");
          }
        } catch (error) {
          console.error("Error adding reaction:", error);
          toast.error("Không thể thả reaction");
        }
      }, 300);
    },
    [session?.user?.id, session?.user?.name]
  );

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Stop typing indicator when sending
      broadcastTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (
        (!newMessage.trim() && !selectedImage) ||
        !selectedConversation ||
        isSendingMessage
      )
        return;

      const messageContent = newMessage;
      const tempId = `temp-${Date.now()}`;
      const currentReply = replyingTo;

      // Clear UI immediately for instant feedback
      setNewMessage("");
      setShowEmojiPicker(false);
      setReplyingTo(null);
      setIsSendingMessage(true);

      // Optimistic update - add message immediately (even before image upload)
      const optimisticMessage: Message = {
        id: tempId,
        content: messageContent || "",
        senderId: session?.user?.id || "",
        senderName: session?.user?.name || "You",
        senderAvatar: session?.user?.image || undefined,
        createdAt: new Date(),
        type: selectedImage ? "IMAGE" : "TEXT",
        fileUrl: selectedImage ? URL.createObjectURL(selectedImage) : undefined,
        fileName: selectedImage?.name,
        reactions: {},
        replyTo: currentReply
          ? {
              id: currentReply.id,
              content: currentReply.content,
              senderName: currentReply.senderName,
              type: currentReply.type,
              fileUrl: currentReply.fileUrl,
              fileName: currentReply.fileName,
            }
          : undefined,
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      // Update conversation list optimistically
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: messageContent || "📷 Ảnh",
                lastMessageTime: new Date(),
              }
            : conv
        )
      );

      let imageUrl: string | null = null;
      let imageName: string | null = null;

      // Upload image if selected (in background)
      if (selectedImage) {
        setIsUploading(true);
        try {
          const formData = new FormData();
          formData.append("file", selectedImage);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            imageUrl = uploadData.data.url;
            imageName = uploadData.data.fileName;

            // Update optimistic message with real image URL
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === tempId
                  ? {
                      ...msg,
                      fileUrl: imageUrl ?? undefined,
                      fileName: imageName ?? undefined,
                    }
                  : msg
              )
            );
          } else {
            toast.error("Không thể upload ảnh. Vui lòng thử lại!");
            setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
            setNewMessage(messageContent);
            setIsUploading(false);
            setIsSendingMessage(false);
            return;
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Lỗi khi upload ảnh!");
          setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
          setNewMessage(messageContent);
          setIsUploading(false);
          setIsSendingMessage(false);
          return;
        }
        setIsUploading(false);
        handleRemoveImage();
      }

      try {
        const res = await fetch(
          `/api/conversations/${selectedConversation.id}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: messageContent || (imageUrl ? "" : ""),
              type: imageUrl ? "IMAGE" : "TEXT",
              fileUrl: imageUrl,
              fileName: imageName,
              replyToId: currentReply?.id,
            }),
          }
        );

        if (res.ok) {
          const response = await res.json();
          const messageData = response.success ? response.data : response;

          // Replace temporary message with real one and sort by timestamp
          setMessages((prev) => {
            const updated = prev.map((msg) =>
              msg.id === tempId
                ? {
                    id: messageData.id,
                    content: messageData.content,
                    senderId: messageData.senderId || session?.user?.id || "",
                    senderName:
                      messageData.sender?.name || session?.user?.name || "You",
                    senderAvatar:
                      messageData.sender?.avatar || session?.user?.image,
                    createdAt: messageData.createdAt || new Date(),
                    type: messageData.type || "TEXT",
                    fileUrl: messageData.fileUrl,
                    fileName: messageData.fileName,
                    reactions: {},
                    replyTo: messageData.replyTo
                      ? {
                          id: messageData.replyTo.id,
                          content: messageData.replyTo.content,
                          senderName: messageData.replyTo.sender?.name || "",
                          type: messageData.replyTo.type,
                          fileUrl: messageData.replyTo.fileUrl,
                          fileName: messageData.replyTo.fileName,
                        }
                      : undefined,
                  }
                : msg
            );

            // Sort messages by createdAt to maintain correct order
            return updated.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );
          });
        } else {
          // Remove optimistic message on error
          setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
          toast.error("Không thể gửi tin nhắn");
          setNewMessage(messageContent);
          if (currentReply) setReplyingTo(currentReply);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        toast.error("Không thể gửi tin nhắn");
        setNewMessage(messageContent);
        if (currentReply) setReplyingTo(currentReply);
      } finally {
        setIsSendingMessage(false);
      }
    },
    [
      newMessage,
      selectedImage,
      selectedConversation,
      isSendingMessage,
      replyingTo,
      session?.user?.id,
      session?.user?.name,
      session?.user?.image,
      handleRemoveImage,
      broadcastTyping,
    ]
  );

  // Send GIF function
  const sendGif = useCallback(
    async (gifUrl: string) => {
      if (!selectedConversation || isSendingMessage) return;

      const tempId = `temp-${Date.now()}`;
      const currentReply = replyingTo;

      // Clear UI
      setReplyingTo(null);
      setIsSendingMessage(true);

      // Optimistic update
      const optimisticMessage: Message = {
        id: tempId,
        content: "",
        senderId: session?.user?.id || "",
        senderName: session?.user?.name || "You",
        senderAvatar: session?.user?.image || undefined,
        createdAt: new Date(),
        type: "GIF",
        fileUrl: gifUrl,
        reactions: {},
        replyTo: currentReply
          ? {
              id: currentReply.id,
              content: currentReply.content,
              senderName: currentReply.senderName,
              type: currentReply.type,
              fileUrl: currentReply.fileUrl,
              fileName: currentReply.fileName,
            }
          : undefined,
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      // Update conversation list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: "🎬 GIF",
                lastMessageTime: new Date(),
              }
            : conv
        )
      );

      try {
        const res = await fetch(
          `/api/conversations/${selectedConversation.id}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: "",
              type: "GIF",
              fileUrl: gifUrl,
              replyToId: currentReply?.id,
            }),
          }
        );

        if (res.ok) {
          const response = await res.json();
          const messageData = response.success ? response.data : response;

          // Replace temporary message with real one
          setMessages((prev) => {
            const updated = prev.map((msg) =>
              msg.id === tempId
                ? {
                    id: messageData.id,
                    content: messageData.content,
                    senderId: messageData.senderId || session?.user?.id || "",
                    senderName:
                      messageData.sender?.name || session?.user?.name || "You",
                    senderAvatar:
                      messageData.sender?.avatar || session?.user?.image,
                    createdAt: messageData.createdAt || new Date(),
                    type: "GIF" as const,
                    fileUrl: messageData.fileUrl,
                    reactions: {},
                    replyTo: messageData.replyTo
                      ? {
                          id: messageData.replyTo.id,
                          content: messageData.replyTo.content,
                          senderName: messageData.replyTo.sender?.name || "",
                          type: messageData.replyTo.type,
                          fileUrl: messageData.replyTo.fileUrl,
                          fileName: messageData.replyTo.fileName,
                        }
                      : undefined,
                  }
                : msg
            );

            return updated.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );
          });
        } else {
          setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
          toast.error("Không thể gửi GIF");
          if (currentReply) setReplyingTo(currentReply);
        }
      } catch (error) {
        console.error("Error sending GIF:", error);
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        toast.error("Không thể gửi GIF");
        if (currentReply) setReplyingTo(currentReply);
      } finally {
        setIsSendingMessage(false);
      }
    },
    [
      selectedConversation,
      isSendingMessage,
      replyingTo,
      session?.user?.id,
      session?.user?.name,
      session?.user?.image,
    ]
  );

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchedUsers([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/users/search?q=${encodeURIComponent(query)}`
      );
      if (res.ok) {
        const users = await res.json();
        setSearchedUsers(users);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const createConversation = async (userId: string) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type: "DIRECT" }),
      });

      if (res.ok) {
        const response = await res.json();
        const conv = response.data;

        // Transform the conversation data
        const otherMember = conv.members?.find(
          (m: any) => m.userId !== session?.user?.id
        );

        const conversation: Conversation = {
          id: conv.id,
          name: otherMember?.user?.name || "Unknown",
          avatar: otherMember?.user?.avatar,
          lastMessage: undefined,
          lastMessageTime: undefined,
          unreadCount: 0,
          type: "DIRECT",
          isOnline: otherMember?.user?.status === "ONLINE",
        };

        // Check if conversation already exists
        setConversations((prev) => {
          const exists = prev.some((c) => c.id === conversation.id);
          if (exists) {
            return prev; // Don't add duplicate
          }
          return [conversation, ...prev];
        });

        setSelectedConversation(conversation);
        setShowNewChatDialog(false);
        setUserSearchQuery("");
        setSearchedUsers([]);
        loadMessages(conversation.id);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const filteredConversations = useMemo(
    () =>
      (conversations || []).filter((conv) =>
        conv?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [conversations, searchQuery]
  );

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-900 flex overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:flex w-16 bg-slate-950 border-r border-slate-800 flex-col items-center py-4 gap-2 flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center cursor-pointer mb-4">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 flex flex-col gap-1">
          <button
            onClick={() => setActiveTab("messages")}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
              activeTab === "messages"
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            )}
            title="Tin nhắn"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab("contacts")}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
              activeTab === "contacts"
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            )}
            title="Danh bạ"
          >
            <Users className="w-5 h-5" />
          </button>

          <button
            onClick={() => router.push("/profile")}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
            title="Hồ sơ"
          >
            <UserIcon className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => router.push("/settings")}
          className="w-10 h-10 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 flex items-center justify-center transition-all mb-2"
          title="Cài đặt"
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="relative group">
          <Avatar className="w-10 h-10 cursor-pointer ring-2 ring-transparent hover:ring-cyan-500 transition-all">
            <AvatarImage src={session?.user?.image || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-sm font-semibold">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute left-full ml-2 bottom-0 bg-slate-800 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white whitespace-nowrap"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
      {/* Conversation List - full width on mobile, fixed width on desktop */}
      <div
        className={cn(
          "bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 transition-all",
          isMobile ? (showConversationList ? "w-full" : "hidden") : "w-80"
        )}
      >
        <div className="p-4 border-b border-slate-800/50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white">Tin nhắn</h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowNewChatDialog(true)}
              className="w-8 h-8 text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Tìm kiếm cuộc trò chuyện"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-slate-800/50 border-0 text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-cyan-500"
            />
          </div>
        </div>

        <div className="flex gap-1 px-3 py-2 border-b border-slate-800/50 overflow-x-auto">
          <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-500 text-white whitespace-nowrap">
            Tất cả
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:bg-slate-800 whitespace-nowrap">
            Chưa đọc
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:bg-slate-800 whitespace-nowrap">
            Nhóm
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:bg-slate-800 whitespace-nowrap flex items-center gap-1">
            <Archive className="w-3 h-3" />
            Lưu trữ
          </button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {isLoadingConversations && filteredConversations.length === 0 && (
              <div className="flex flex-col justify-center items-center">
                <div className="w-10 h-10 border-4 border-cyan-500 pb-2 border-t-transparent rounded-full  animate-spin"></div>
                <h3>Đang tải cuộc trò chuyện...</h3>
              </div>
            )}
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationClick(conversation)}
                className={cn(
                  "flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all mb-0.5",
                  selectedConversation?.id === conversation.id
                    ? "bg-slate-800/70 border-l-2 border-cyan-500"
                    : "hover:bg-slate-800/40"
                )}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="w-11 h-11">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold">
                      {conversation.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-0.5">
                    <h3 className="font-semibold text-white truncate text-sm">
                      {conversation.name}
                    </h3>
                    {conversation.lastMessageTime && (
                      <span className="text-[10px] text-slate-500 flex-shrink-0">
                        {formatDistanceToNow(
                          new Date(conversation.lastMessageTime),
                          {
                            addSuffix: false,
                            locale: vi,
                          }
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-400 truncate flex-1">
                      {conversation.lastMessage || "Bắt đầu trò chuyện"}
                    </p>
                    {conversation.unreadCount &&
                      conversation.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-white">
                            {conversation.unreadCount > 9
                              ? "9+"
                              : conversation.unreadCount}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}

            {filteredConversations.length === 0 && !isLoadingConversations && (
              <div className="text-center py-20 text-slate-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Không tìm thấy cuộc trò chuyện</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area - full width on mobile when shown */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0",
          isMobile && showConversationList ? "hidden" : "flex"
        )}
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-14 border-b border-slate-800/50 flex items-center justify-between px-4 flex-shrink-0 bg-slate-900/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                {/* Back button for mobile */}
                {isMobile && (
                  <button
                    onClick={() => setShowConversationList(true)}
                    className="mr-2 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                <div className="relative">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={selectedConversation.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm font-semibold">
                      {selectedConversation.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    {selectedConversation.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {typingUsers[selectedConversation.id]?.length > 0 ? (
                      <span className="text-cyan-400 flex items-center gap-1">
                        <span className="animate-pulse">●</span>
                        {typingUsers[selectedConversation.id].length === 1
                          ? `${
                              typingUsers[selectedConversation.id][0].userName
                            } đang nhập...`
                          : `${
                              typingUsers[selectedConversation.id].length
                            } người đang nhập...`}
                      </span>
                    ) : selectedConversation.isOnline ? (
                      <span className="text-green-400">● Đang hoạt động</span>
                    ) : (
                      "Không hoạt động"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 md:w-9 md:h-9 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 hidden sm:flex"
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 md:w-9 md:h-9 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 hidden sm:flex"
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 md:w-9 md:h-9 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 hidden sm:flex"
                >
                  <Video className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 md:w-9 md:h-9 text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-2 md:px-4 py-3">
              <div className="space-y-3 max-w-4xl mx-auto">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-slate-400">
                        Đang tải tin nhắn...
                      </p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-20 text-slate-500">
                    <p className="text-sm">Chưa có tin nhắn nào</p>
                    <p className="text-xs mt-1">Hãy gửi tin nhắn đầu tiên!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOwn = message.senderId === session?.user?.id;
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-2 items-end",
                          isOwn && "flex-row-reverse"
                        )}
                      >
                        {!isOwn && (
                          <Avatar className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0">
                            <AvatarImage src={message.senderAvatar} />
                            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs font-semibold">
                              {message.senderName?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={cn(
                            "flex flex-col gap-0.5",
                            isOwn && "items-end"
                          )}
                        >
                          <div className="relative group">
                            <div
                              className={cn(
                                "max-w-[280px] sm:max-w-md px-3 py-2 rounded-2xl break-words",
                                isOwn
                                  ? "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-br-sm"
                                  : "bg-slate-800 text-white rounded-bl-sm"
                              )}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                setShowReactionPicker(
                                  showReactionPicker === message.id
                                    ? null
                                    : message.id
                                );
                              }}
                            >
                              {/* Replied message preview */}
                              {message.replyTo && (
                                <div
                                  className={cn(
                                    "mb-2 p-2 rounded-lg border-l-2 text-xs opacity-80",
                                    isOwn
                                      ? "bg-cyan-700/30 border-white/50"
                                      : "bg-slate-700/50 border-slate-400"
                                  )}
                                >
                                  <div className="font-semibold mb-0.5">
                                    {message.replyTo.senderName}
                                  </div>
                                  {message.replyTo.type === "IMAGE" &&
                                  message.replyTo.fileUrl ? (
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={message.replyTo.fileUrl}
                                        alt="Reply image"
                                        className="w-10 h-10 rounded object-cover"
                                      />
                                      <span className="text-slate-300">
                                        📷 Ảnh
                                      </span>
                                    </div>
                                  ) : message.replyTo.type === "GIF" &&
                                    message.replyTo.fileUrl ? (
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={message.replyTo.fileUrl}
                                        alt="Reply GIF"
                                        className="w-10 h-10 rounded object-cover"
                                      />
                                      <span className="text-slate-300">
                                        🎬 GIF
                                      </span>
                                    </div>
                                  ) : message.replyTo.type === "FILE" ? (
                                    <div className="flex items-center gap-1">
                                      <FileText className="w-3 h-3" />
                                      <span className="truncate">
                                        {message.replyTo.fileName || "File"}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="truncate">
                                      {message.replyTo.content}
                                    </div>
                                  )}
                                </div>
                              )}

                              {message.type === "TEXT" && (
                                <p className="text-sm leading-relaxed">
                                  {message.content}
                                </p>
                              )}
                              {message.type === "IMAGE" && (
                                <div
                                  className="cursor-pointer"
                                  onClick={() =>
                                    setViewingImage(message.fileUrl!)
                                  }
                                >
                                  <img
                                    src={message.fileUrl}
                                    alt={message.fileName}
                                    className="max-w-[200px] sm:max-w-[300px] max-h-[300px] sm:max-h-[400px] rounded-lg hover:opacity-90 transition-opacity object-cover"
                                  />
                                </div>
                              )}
                              {message.type === "GIF" && (
                                <div className="cursor-pointer">
                                  <img
                                    src={message.fileUrl}
                                    alt="GIF"
                                    className="max-w-[200px] sm:max-w-[300px] max-h-[300px] sm:max-h-[400px] rounded-lg hover:opacity-90 transition-opacity"
                                  />
                                </div>
                              )}
                              {message.type === "FILE" && (
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4" />
                                  <span className="text-sm">
                                    {message.fileName}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Action buttons */}
                            <div
                              className={cn(
                                "absolute top-0 gap-1 transition-opacity",
                                "hidden sm:flex sm:opacity-0 sm:group-hover:opacity-100",
                                isOwn
                                  ? "-left-12 sm:-left-16"
                                  : "-right-12 sm:-right-16"
                              )}
                            >
                              {/* Reply button */}
                              <button
                                onClick={() => {
                                  setReplyingTo(message);
                                  messageInputRef.current?.focus();
                                }}
                                className="bg-slate-700 hover:bg-slate-600 rounded-full p-1"
                                title="Trả lời"
                              >
                                <Reply className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
                              </button>

                              {/* Reaction button */}
                              <button
                                onClick={() =>
                                  setShowReactionPicker(
                                    showReactionPicker === message.id
                                      ? null
                                      : message.id
                                  )
                                }
                                className="bg-slate-700 hover:bg-slate-600 rounded-full p-1"
                                title="Thêm reaction"
                              >
                                <Smile className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
                              </button>
                            </div>

                            {/* Reaction picker popup */}
                            {showReactionPicker === message.id && (
                              <div
                                className={cn(
                                  "absolute top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10",
                                  isOwn ? "right-0" : "left-0"
                                )}
                              >
                                {/* Mobile: Show actions + reactions */}
                                <div className="sm:hidden">
                                  <button
                                    onClick={() => {
                                      setReplyingTo(message);
                                      messageInputRef.current?.focus();
                                      setShowReactionPicker(null);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-slate-700 w-full text-left text-sm"
                                  >
                                    <Reply className="w-4 h-4" />
                                    <span>Trả lời</span>
                                  </button>
                                  <div className="border-t border-slate-700 px-2 py-2">
                                    <div className="flex gap-1">
                                      {["👍", "❤️", "😂", "😮", "😢", "🎉"].map(
                                        (emoji) => (
                                          <button
                                            key={emoji}
                                            onClick={() =>
                                              handleAddReaction(
                                                message.id,
                                                emoji
                                              )
                                            }
                                            className="text-2xl hover:scale-125 transition-transform p-1"
                                          >
                                            {emoji}
                                          </button>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Desktop: Only reactions */}
                                <div className="hidden sm:flex gap-1 p-2">
                                  {["👍", "❤️", "😂", "😮", "😢", "🎉"].map(
                                    (emoji) => (
                                      <button
                                        key={emoji}
                                        onClick={() =>
                                          handleAddReaction(message.id, emoji)
                                        }
                                        className="text-2xl hover:scale-125 transition-transform p-1"
                                      >
                                        {emoji}
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Display reactions */}
                            {message.reactions &&
                              Object.keys(message.reactions).length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {Object.entries(message.reactions).map(
                                    ([emoji, users]) => (
                                      <button
                                        key={emoji}
                                        onClick={() =>
                                          handleAddReaction(message.id, emoji)
                                        }
                                        className="bg-slate-700 hover:bg-slate-600 rounded-full px-2 py-0.5 text-xs flex items-center gap-1 transition-colors"
                                        title={users
                                          .map((u) => u.userName)
                                          .join(", ")}
                                      >
                                        <span>{emoji}</span>
                                        <span className="text-slate-300">
                                          {users.length}
                                        </span>
                                      </button>
                                    )
                                  )}
                                </div>
                              )}
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500 px-1">
                              {message.createdAt
                                ? format(new Date(message.createdAt), "HH:mm")
                                : ""}
                            </span>
                            {isOwn &&
                              message.readReceipts &&
                              message.readReceipts.length > 0 && (
                                <div className="text-cyan-400" title="Đã xem">
                                  <CheckCheck className="w-3 h-3" />
                                </div>
                              )}
                            {isOwn &&
                              (!message.readReceipts ||
                                message.readReceipts.length === 0) && (
                                <div className="text-slate-500" title="Đã gửi">
                                  <Check className="w-3 h-3" />
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t border-slate-800/50 p-2 md:p-3 bg-slate-900/50 backdrop-blur-sm flex-shrink-0">
              {/* Reply Preview Banner */}
              {replyingTo && (
                <div className="max-w-4xl mx-auto mb-2 bg-slate-800 rounded-lg p-2 md:p-3 flex items-start gap-2 border border-slate-700">
                  <Reply className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-cyan-400 mb-1">
                      Trả lời {replyingTo.senderName}
                    </div>
                    {replyingTo.type === "IMAGE" && replyingTo.fileUrl ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={replyingTo.fileUrl}
                          alt="Reply preview"
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="text-xs md:text-sm text-slate-300">
                          📷 Ảnh
                        </span>
                      </div>
                    ) : replyingTo.type === "FILE" ? (
                      <div className="flex items-center gap-2 text-xs md:text-sm text-slate-300">
                        <FileText className="w-4 h-4" />
                        <span className="truncate">
                          {replyingTo.fileName || "File"}
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs md:text-sm text-slate-300 truncate">
                        {replyingTo.content}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-slate-400 hover:text-white transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="max-w-4xl mx-auto mb-3 relative inline-block">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-32 md:max-h-40 rounded-lg border-2 border-cyan-500"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSendMessage}
                className="flex items-end gap-2 max-w-4xl mx-auto"
              >
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* Image upload button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-9 h-9 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 flex-shrink-0"
                  disabled={isUploading}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>

                {/* GIF button */}
                <div className="relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowGifPicker(!showGifPicker)}
                    className="w-9 h-9 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 flex-shrink-0"
                    disabled={isUploading}
                  >
                    <span className="text-base font-semibold">GIF</span>
                  </Button>

                  {/* GIF Picker Popup */}
                  {showGifPicker && (
                    <GifPicker
                      onSelect={(gifUrl) => {
                        sendGif(gifUrl);
                        setShowGifPicker(false);
                      }}
                      onClose={() => setShowGifPicker(false)}
                    />
                  )}
                </div>

                <div className="flex-1 relative">
                  <Input
                    ref={messageInputRef}
                    placeholder={
                      isUploading ? "Đang upload ảnh..." : "Nhập tin nhắn..."
                    }
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    disabled={isUploading}
                    className="pr-10 bg-slate-800 border-0 text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-cyan-500 rounded-xl"
                  />

                  {/* Emoji picker button */}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-8 h-8 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 hidden sm:flex"
                    >
                      <Smile className="w-4 h-4" />
                    </Button>

                    {/* Emoji Picker Popup */}
                    {showEmojiPicker && (
                      <div className="absolute bottom-full right-0 mb-2 z-50">
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            setNewMessage((prev) => prev + emojiData.emoji);
                            setShowEmojiPicker(false);
                          }}
                          // theme="dark"
                          width={320}
                          height={400}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  size="icon"
                  className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-lg shadow-cyan-500/20 flex-shrink-0"
                  disabled={
                    (!newMessage.trim() && !selectedImage) ||
                    isUploading ||
                    isSendingMessage
                  }
                >
                  {isUploading || isSendingMessage ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
              <p className="text-xs text-slate-500 text-center mt-2 hidden sm:block">
                Nhấn Enter để gửi, Shift + Enter để xuống dòng
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center text-slate-400">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                Chọn một cuộc trò chuyện
              </h3>
              <p className="text-sm md:text-base">
                Chọn một cuộc trò chuyện để bắt đầu nhắn tin
              </p>
              {isMobile && (
                <button
                  onClick={() => setShowConversationList(true)}
                  className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Xem danh sách trò chuyện
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* New Chat Dialog */}
      <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>Bắt đầu cuộc trò chuyện mới</DialogTitle>
            <DialogDescription className="text-slate-400">
              Tìm kiếm người dùng để nhắn tin
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={userSearchQuery}
                onChange={(e) => {
                  setUserSearchQuery(e.target.value);
                  searchUsers(e.target.value);
                }}
                className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <ScrollArea className="h-[300px]">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-slate-400">Đang tìm kiếm...</div>
                </div>
              ) : searchedUsers.length > 0 ? (
                <div className="space-y-1">
                  {searchedUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => createConversation(user.id)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.image} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                          {user.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">
                          {user.name}
                        </h4>
                        <p className="text-sm text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : userSearchQuery.trim() ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                  <Users className="w-12 h-12 mb-2 opacity-30" />
                  <p className="text-sm">Không tìm thấy người dùng</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                  <Search className="w-12 h-12 mb-2 opacity-30" />
                  <p className="text-sm">Nhập tên hoặc email để tìm kiếm</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      {/* Image Viewer Modal */}
      {viewingImage && (
        <Dialog
          open={!!viewingImage}
          onOpenChange={() => setViewingImage(null)}
        >
          <DialogContent className="max-w-4xl bg-slate-900/95 border-slate-800 p-0">
            <div className="relative">
              <button
                onClick={() => setViewingImage(null)}
                className="absolute top-4 right-4 z-10 bg-slate-800 hover:bg-slate-700 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <img
                src={viewingImage}
                alt="Full size"
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid #334155",
          },
        }}
      />
    </div>
  );
}
