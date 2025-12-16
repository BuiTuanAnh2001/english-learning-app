import { createClient } from '@supabase/supabase-js'

// Extract Supabase URL from DATABASE_URL
// Format: postgresql://postgres.PROJECT_REF:PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
const extractSupabaseConfig = () => {
  const dbUrl = process.env.DATABASE_URL || ''
  const match = dbUrl.match(/postgres\.([^:]+):/)
  const projectRef = match ? match[1] : ''
  
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || `https://${projectRef}.supabase.co`,
    // Note: For realtime to work, you need to add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env
    // You can find this in Supabase Dashboard > Settings > API
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  }
}

// Create supabase client only when needed (lazy initialization)
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    const config = extractSupabaseConfig()
    
    // Return null if no config available (during build)
    if (!config.anonKey || !config.url) {
      return null
    }
    
    supabaseInstance = createClient(config.url, config.anonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  }
  
  return supabaseInstance
}

// Legacy export for backwards compatibility
export const supabase = getSupabaseClient()

// Client-side supabase for use in components (Singleton pattern)
let browserClientInstance: ReturnType<typeof createClient> | null = null

export const createBrowserClient = () => {
  if (typeof window === 'undefined') {
    return null
  }
  
  // Return existing instance if available
  if (browserClientInstance) {
    return browserClientInstance
  }
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  if (!url || !anonKey) {
    console.warn('Supabase env vars not found')
    return null
  }
  
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
