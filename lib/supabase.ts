import { createClient } from '@supabase/supabase-js'

// Extract Supabase URL from DATABASE_URL
// Format: postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
const extractSupabaseConfig = () => {
  const dbUrl = process.env.DATABASE_URL || ''
  const match = dbUrl.match(/postgres\.([^:]+):/)
  const projectRef = match ? match[1] : ''
  
  return {
    url: `https://${projectRef}.supabase.co`,
    // Note: For realtime to work, you need to add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env
    // You can find this in Supabase Dashboard > Settings > API
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  }
}

const config = extractSupabaseConfig()

export const supabase = createClient(config.url, config.anonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Client-side supabase for use in components (Singleton pattern)
let browserClientInstance: ReturnType<typeof createClient> | null = null

export const createBrowserClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('createBrowserClient can only be used in browser')
  }
  
  // Return existing instance if available
  if (browserClientInstance) {
    return browserClientInstance
  }
  
  const projectRef = 'vehatkcukaloprvqcejz'
  const url = `https://${projectRef}.supabase.co`
  // Phải hardcode hoặc dùng next.config.js để expose NEXT_PUBLIC_*
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlaGF0a2N1a2Fsb3BydnFjZWp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMzM5NTUsImV4cCI6MjA3OTgwOTk1NX0.jn_5NZQhpV65dh8wgIdELp7HPTs1C9RmT-GwjNIo4ds'
  
  console.log('✅ Supabase client created:', url)
  console.log('🔑 Using anon key:', anonKey.substring(0, 20) + '...')
  
  browserClientInstance = createClient(url, anonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  })
  
  return browserClientInstance
}
