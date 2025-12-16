"use client";

import { createBrowserClient } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function TestRealtimePage() {
  const [status, setStatus] = useState<string>("Initializing...");
  const [messages, setMessages] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (log: string) => {
    console.log(log);
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${log}`]);
  };

  useEffect(() => {
    addLog("🚀 Starting Supabase Realtime test...");
    const supabase = createBrowserClient();

    addLog("📡 Creating channel...");
    const channel = supabase
      .channel("test-realtime-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Message",
        },
        (payload) => {
          addLog(`✅ Received realtime event: ${payload.eventType}`);
          console.log("Full payload:", payload);
          setMessages((prev) => [...prev, payload]);
        }
      )
      .subscribe((status, err) => {
        addLog(`📊 Subscription status changed to: ${status}`);
        if (err) {
          addLog(`❌ Error: ${err.message}`);
          console.error("Subscription error:", err);
        }
        setStatus(status);
      });

    // Test connection
    addLog("🔍 Testing Supabase connection...");
    supabase
      .from("Message")
      .select("id")
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          addLog(`❌ Query error: ${error.message}`);
        } else {
          addLog(`✅ Query successful, found ${data?.length || 0} messages`);
        }
      });

    return () => {
      addLog("🔌 Cleaning up subscription...");
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Supabase Realtime Test</h1>
          <p className="text-slate-400">
            Testing realtime connection and Message table subscription
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                status === "SUBSCRIBED"
                  ? "bg-green-500"
                  : status === "CHANNEL_ERROR"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            />
            <span className="font-mono">{status}</span>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Activity Logs ({logs.length})
          </h2>
          <div className="bg-slate-900 rounded p-4 max-h-64 overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="font-mono text-sm text-slate-300 mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Realtime Messages ({messages.length})
          </h2>
          <div className="bg-slate-900 rounded p-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-slate-400 text-center py-4">
                Waiting for realtime messages...
                <br />
                <span className="text-sm">
                  Try sending a message in the chat page
                </span>
              </p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="mb-4 pb-4 border-b border-slate-700">
                  <div className="font-mono text-xs text-slate-400 mb-2">
                    Event: {msg.eventType} | Table: {msg.table}
                  </div>
                  <pre className="text-xs bg-slate-950 p-3 rounded overflow-x-auto">
                    {JSON.stringify(msg.new || msg.old, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h3 className="font-semibold mb-2">💡 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300">
            <li>Check if connection status shows SUBSCRIBED (green)</li>
            <li>
              If shows CHANNEL_ERROR, run the SQL script in{" "}
              <code className="bg-slate-800 px-2 py-1 rounded">
                check-realtime.sql
              </code>
            </li>
            <li>Send a message in the chat page</li>
            <li>Watch for realtime events appearing here</li>
            <li>Check browser console for detailed logs (F12 → Console tab)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
