"use client";

import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

interface RealtimeContextType {
  isConnected: boolean;
  sendMessage: (conversationId: string, content: string) => void;
  subscribeToConversation: (
    conversationId: string,
    callback: (message: any) => void
  ) => () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(
  undefined
);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Update user status to ONLINE
    const updateUserStatus = async () => {
      await fetch("/api/user/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ONLINE" }),
      });
    };

    updateUserStatus();
    setIsConnected(true);

    // Update status to OFFLINE on unload
    const handleBeforeUnload = async () => {
      await fetch("/api/user/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "OFFLINE" }),
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [session]);

  const sendMessage = async (conversationId: string, content: string) => {
    if (!session?.user?.id) return;

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const message = await res.json();

        // Broadcast message via Supabase realtime
        await supabase.from("Message").insert({
          id: message.id,
          conversationId,
          senderId: session.user.id,
          content,
          type: "TEXT",
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const subscribeToConversation = (
    conversationId: string,
    callback: (message: any) => void
  ) => {
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `conversationId=eq.${conversationId}`,
        },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return (
    <RealtimeContext.Provider
      value={{
        isConnected,
        sendMessage,
        subscribeToConversation,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within RealtimeProvider");
  }
  return context;
}
