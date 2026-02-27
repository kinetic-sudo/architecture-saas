// routes/__root.tsx
import { HeadContent, createRootRoute, Outlet } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, signIn as puterSignIn, signOut as puterSignOut } from '@/lib/puter.action'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Roomify - Your Space Manager',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-muted-foreground mt-2">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
    </div>
  ),
})

export const AuthContext = createContext<authContext | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthContext.Provider')
  }
  return context
}

const DEFAULT_AUTH_STATE: AuthState = {
  isSignedIn: false,
  userName: null,
  userId: null
}

function RootDocument() {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE)
  const [isAuthLoading, setIsAuthLoading] = useState(false)

  const refreshAuth = async () => {
    try {
      const user = await getCurrentUser()
      
      if (user) {
        setAuthState({
          isSignedIn: true,
          userName: (user as any)?.username || (user as any)?.email || 'User',
          userId: (user as any)?.uuid || (user as any)?.id || null,
        })
        return true
      } else {
        setAuthState(DEFAULT_AUTH_STATE)
        return false
      }
    } catch (error) {
      console.error('Error refreshing auth:', error)
      setAuthState(DEFAULT_AUTH_STATE)
      return false
    }
  }

  // Check auth on mount
  useEffect(() => {
    refreshAuth()
  }, [])

  const signIn = async () => {
    setIsAuthLoading(true)
    try {
      console.log('🔐 Starting Puter sign in...')
      await puterSignIn()
      console.log('✅ Puter sign in successful')
      
      // Wait a bit for Puter to set up the session
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const success = await refreshAuth()
      console.log('🔄 Auth refresh result:', success)
      return success
    } catch (error) {
      console.error('❌ Sign in error:', error)
      return false
    } finally {
      setIsAuthLoading(false)
    }
  }

  const signOut = async () => {
    setIsAuthLoading(true)
    try {
      console.log('🚪 Starting Puter sign out...')
      await puterSignOut()
      console.log('✅ Puter sign out successful')
      
      setAuthState(DEFAULT_AUTH_STATE)
      return true
    } catch (error) {
      console.error('❌ Sign out error:', error)
      return false
    } finally {
      setIsAuthLoading(false)
    }
  }

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <main className='min-h-screen bg-background text-foreground relative z-10'>
          <AuthContext.Provider
            value={{
              isSignedIn: authState.isSignedIn,
              userName: authState.userName,
              userId: authState.userId,
              isAuthLoading,
              refreshAuth,
              signIn,
              signOut,
            }}
          >
            <Outlet />
          </AuthContext.Provider>
        </main>
      </body>
    </html>
  )
}