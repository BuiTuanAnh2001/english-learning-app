"use client";

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
  FileText,
  Image as ImageIcon,
  LogOut,
  MessageSquare,
  MoreVertical,
  Phone,
  Plus,
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
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

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
  type: "TEXT" | "IMAGE" | "FILE";
  fileUrl?: string;
  fileName?: string;
  reactions?: { [emoji: string]: { userId: string; userName: string }[] };
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            console.log("Notification permission denied");
            return;
          }

          if (permission === "default") {
            console.log("Notification permission not yet granted");
            return;
          }

          // Permission granted, register service worker
          const registration = await registerServiceWorker();
          if (!registration) {
            console.error("Service Worker registration failed");
            return;
          }

          // Subscribe to push notifications
          const subscription = await subscribeToPushNotifications(
            session.user.id
          );
          if (subscription) {
            toast.success("✅ Thông báo đẩy đã được bật!");
          }
        } catch (error) {
          console.error("Setup push notifications error:", error);
        }
      };

      setupPushNotifications();
    }
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        };

        setMessages((prev) => {
          // Check if message already exists
          if (prev.some((m) => m.id === message.id)) {
            console.log("⏭️ Message already exists, skipping");
            return prev;
          }
          console.log("✅ Adding new message to state");
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

              // Show push notification
              if (document.hidden && Notification.permission === "granted") {
                new Notification(`${senderInfo.name}`, {
                  body:
                    newMsg.type === "IMAGE"
                      ? "📷 Đã gửi một ảnh"
                      : newMsg.content,
                  icon: senderInfo.avatar || "/default-avatar.png",
                  tag: newMsg.id,
                });
              } else if (!document.hidden) {
                toast.success(`Tin nhắn mới từ ${senderInfo.name}`, {
                  duration: 3000,
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
    };
  }, [selectedConversation?.id, session?.user?.id]);

  const loadConversations = async () => {
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

        setConversations(transformedConversations);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      setConversations([]);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (res.ok) {
        const response = await res.json();
        const messagesData = response.success ? response.data : [];

        // Transform messages to match our interface
        const transformedMessages = (messagesData || []).map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.senderId,
          senderName: msg.sender?.name || "Unknown",
          senderAvatar: msg.sender?.avatar,
          createdAt: msg.createdAt,
          type: msg.type || "TEXT",
          fileUrl: msg.fileUrl,
          fileName: msg.fileName,
        }));

        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh!");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước ảnh tối đa 5MB!");
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    try {
      const res = await fetch(`/api/messages/${messageId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });

      if (res.ok) {
        const response = await res.json();
        if (response.removed) {
          // Remove reaction locally (handled by realtime)
        } else {
          // Add reaction locally (handled by realtime)
        }
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
      toast.error("Không thể thả reaction");
    }
    setShowReactionPicker(null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || !selectedConversation) return;

    const messageContent = newMessage;
    setNewMessage(""); // Clear immediately for better UX
    setShowEmojiPicker(false);

    let imageUrl = null;
    let imageName = null;

    // Upload image if selected
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
        } else {
          alert("Không thể upload ảnh. Vui lòng thử lại!");
          setNewMessage(messageContent);
          setIsUploading(false);
          return;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Lỗi khi upload ảnh!");
        setNewMessage(messageContent);
        setIsUploading(false);
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
          }),
        }
      );

      if (res.ok) {
        const response = await res.json();
        const messageData = response.success ? response.data : response;

        // Transform message to match our interface
        const newMsg: Message = {
          id: messageData.id,
          content: messageData.content,
          senderId: messageData.senderId || session?.user?.id || "",
          senderName: messageData.sender?.name || session?.user?.name || "You",
          senderAvatar: messageData.sender?.avatar || session?.user?.image,
          createdAt: messageData.createdAt || new Date(),
          type: messageData.type || "TEXT",
          fileUrl: messageData.fileUrl,
          fileName: messageData.fileName,
        };

        // Add message to local state immediately for instant feedback
        setMessages((prev) => {
          // Check if already exists (prevent duplicates)
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Restore message on error
      setNewMessage(messageContent);
    }
  };

  const searchUsers = async (query: string) => {
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
  };

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

        setConversations([conversation, ...conversations]);
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

  const filteredConversations = (conversations || []).filter((conv) =>
    conv?.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
      {/* Sidebar */}
      <div className="w-16 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 gap-2 flex-shrink-0">
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

      {/* Conversation List */}
      <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
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

            {filteredConversations.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Không tìm thấy cuộc trò chuyện</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-14 border-b border-slate-800/50 flex items-center justify-between px-4 flex-shrink-0 bg-slate-900/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
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
                    {selectedConversation.isOnline ? (
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
                  className="w-9 h-9 text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                >
                  <Video className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-3">
              <div className="space-y-3 max-w-4xl mx-auto">
                {messages.length === 0 ? (
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
                          <Avatar className="w-7 h-7 flex-shrink-0">
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
                                "max-w-md px-3 py-2 rounded-2xl break-words",
                                isOwn
                                  ? "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-br-sm"
                                  : "bg-slate-800 text-white rounded-bl-sm"
                              )}
                            >
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
                                    className="max-w-[300px] max-h-[400px] rounded-lg hover:opacity-90 transition-opacity object-cover"
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

                            {/* Reaction button */}
                            <button
                              onClick={() =>
                                setShowReactionPicker(
                                  showReactionPicker === message.id
                                    ? null
                                    : message.id
                                )
                              }
                              className={cn(
                                "absolute top-0 bg-slate-700 hover:bg-slate-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity",
                                isOwn ? "-left-8" : "-right-8"
                              )}
                            >
                              <Smile className="w-4 h-4 text-slate-300" />
                            </button>

                            {/* Reaction picker popup */}
                            {showReactionPicker === message.id && (
                              <div
                                className={cn(
                                  "absolute top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 shadow-xl z-10 flex gap-1",
                                  isOwn ? "right-0" : "left-0"
                                )}
                              >
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

                          <span className="text-[10px] text-slate-500 px-1">
                            {message.createdAt
                              ? format(new Date(message.createdAt), "HH:mm")
                              : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t border-slate-800/50 p-3 bg-slate-900/50 backdrop-blur-sm flex-shrink-0">
              {/* Image Preview */}
              {imagePreview && (
                <div className="max-w-4xl mx-auto mb-3 relative inline-block">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-40 rounded-lg border-2 border-cyan-500"
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

                <div className="flex-1 relative">
                  <Input
                    placeholder={
                      isUploading ? "Đang upload ảnh..." : "Nhập tin nhắn..."
                    }
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
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
                      className="w-8 h-8 text-slate-400 hover:text-cyan-400 hover:bg-slate-700"
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
                    (!newMessage.trim() && !selectedImage) || isUploading
                  }
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
              <p className="text-xs text-slate-500 text-center mt-2">
                Nhấn Enter để gửi, Shift + Enter để xuống dòng
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-400">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                Chọn một cuộc trò chuyện
              </h3>
              <p>Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
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
