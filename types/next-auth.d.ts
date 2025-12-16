import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      username?: string | null
      avatar?: string | null
      image?: string | null
      bio?: string | null
      phone?: string | null
      location?: string | null
      notificationsEnabled?: boolean
      darkModeEnabled?: boolean
      onlineStatusVisible?: boolean
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    username?: string | null
    avatar?: string | null
    bio?: string | null
    phone?: string | null
    location?: string | null
    notificationsEnabled?: boolean
    darkModeEnabled?: boolean
    onlineStatusVisible?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    avatar?: string | null
    username?: string | null
  }
}
