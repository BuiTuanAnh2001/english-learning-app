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

// Client-side supabase for use in components
export const createBrowserClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('createBrowserClient can only be used in browser')
  }
  
  const projectRef = 'vehatkcukaloprvqcejz' // From your DATABASE_URL
  const url = `https://${projectRef}.supabase.co`
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  return createClient(url, anonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  })
}
