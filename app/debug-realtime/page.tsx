'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase'

export default function RealtimeDebugPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [tableNames, setTableNames] = useState<string[]>([])
  const [status, setStatus] = useState<string>('Not connected')

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(message)
  }

  useEffect(() => {
    addLog('🚀 Starting Realtime Debug...')
    const supabase = createBrowserClient()

    // Test cả 2 table names
    const testTableNames = ['Message', 'message']
    setTableNames(testTableNames)

    const channels: any[] = []

    testTableNames.forEach((tableName, index) => {
      addLog(`🔌 Testing table: "${tableName}"`)

      const channel = supabase
        .channel(`debug-${tableName}-${index}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: tableName
        }, (payload: any) => {
          addLog(`✅ RECEIVED EVENT from "${tableName}":`)
          addLog(JSON.stringify(payload, null, 2))
        })
        .subscribe((subscribeStatus) => {
          addLog(`📡 "${tableName}" status: ${subscribeStatus}`)
          if (subscribeStatus === 'SUBSCRIBED') {
            setStatus(prev => `${prev}\n✅ ${tableName}: SUBSCRIBED`)
          } else if (subscribeStatus === 'CHANNEL_ERROR') {
            setStatus(prev => `${prev}\n❌ ${tableName}: ERROR`)
          }
        })

      channels.push(channel)
    })

    // Cleanup
    return () => {
      addLog('🧹 Cleaning up channels...')
      channels.forEach(ch => supabase.removeChannel(ch))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Supabase Realtime Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {status}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Testing Table Names</h2>
          <div className="flex gap-2">
            {tableNames.map(name => (
              <span key={name} className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Event Logs</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="mb-1">{log}</div>
            ))}
            {logs.length === 0 && (
              <div className="text-gray-500">Waiting for events...</div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">⚠️ Instructions</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Keep this page open</li>
            <li>Open the chat app in another tab</li>
            <li>Send a message in a conversation</li>
            <li>Come back here and check if any events were received</li>
            <li>If you see &quot;✅ RECEIVED EVENT&quot;, realtime is working!</li>
          </ol>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">🔧 Common Issues</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>No SUBSCRIBED status:</strong> Check NEXT_PUBLIC_SUPABASE_ANON_KEY in .env
            </li>
            <li>
              <strong>SUBSCRIBED but no events:</strong> Enable Realtime in Supabase Dashboard → Database → Replication
            </li>
            <li>
              <strong>Wrong table name:</strong> Check which table name shows events
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
