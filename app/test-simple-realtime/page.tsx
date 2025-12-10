'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function SimpleRealtimeTest() {
  const [logs, setLogs] = useState<string[]>([])
  const [status, setStatus] = useState('Connecting...')

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${time}] ${msg}`])
    console.log(msg)
  }

  useEffect(() => {
    addLog('🚀 Starting simple test...')
    
    const supabase = createClient(
      'https://vehatkcukaloprvqcejz.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlaGF0a2N1a2Fsb3BydnFjZWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMzM5NTUsImV4cCI6MjA3OTgwOTk1NX0.jn_5NZQhpV65dh8wgIdELp7HPTs1C9RmT-GwjNIo4ds',
      {
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      }
    )

    addLog('🔌 Subscribing to Message table...')

    const channel = supabase
      .channel('simple-test')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'Message'
      }, (payload) => {
        addLog('🎉🎉🎉 RECEIVED EVENT!')
        addLog('Event: ' + payload.eventType)
        addLog('Payload: ' + JSON.stringify(payload, null, 2))
        setStatus('✅ REALTIME WORKING!')
      })
      .subscribe((status) => {
        addLog('Status: ' + status)
        setStatus(status)
      })

    return () => {
      addLog('Cleaning up...')
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🧪 Simple Realtime Test</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Status</h2>
          <div className="text-3xl font-mono">{status}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Keep this page open</li>
            <li>Open chat app in another tab</li>
            <li>Send a message</li>
            <li>Come back here to see if event received</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Logs</h2>
          <div className="bg-black rounded p-4 font-mono text-sm space-y-1 h-96 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
