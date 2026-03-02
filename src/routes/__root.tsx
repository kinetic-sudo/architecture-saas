// routes/__root.tsx
import { HeadContent, createRootRoute, Outlet } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { createContext, useContext, useEffect, useState } from 'react'
import puter from '@heyputer/puter.js' // ✅ USE NPM PACKAGE

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Roomify - Your Space Manager' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
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
  userId: null,
}

function RootDocument() {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE)
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [puterReady, setPuterReady] = useState(false)

  // Initialize Puter
  useEffect(() => {
    const initPuter = async () => {
      try {
        console.log('🚀 Initializing Puter...')
        
        // Check if Puter is available
        if (!puter || !puter.auth) {
          console.error('❌ Puter module not available')
          return
        }

        // Initialize Puter (if it has an init method)
        if (typeof puter.init === 'function') {
          await puter.init()
          console.log('✅ Puter initialized')
        }

        setPuterReady(true)
        console.log('✅ Puter ready')
        
        // Check initial auth state
        await refreshAuth()
      } catch (error) {
        console.error('❌ Error initializing Puter:', error)
      }
    }

    initPuter()
  }, [])

  const refreshAuth = async (): Promise<boolean> => {
    if (!puter || !puter.auth) {
      console.log('⚠️ Puter not available')
      return false
    }

    try {
      // Check if user is signed in
      const isSignedIn = puter.auth.isSignedIn ? puter.auth.isSignedIn() : false
      console.log('🔍 isSignedIn:', isSignedIn)

      if (!isSignedIn) {
        setAuthState(DEFAULT_AUTH_STATE)
        return false
      }

      // Get user data
      const user = await puter.auth.getUser()
      console.log('👤 Got user:', user)

      if (user) {
        setAuthState({
          isSignedIn: true,
          userName: (user as any).username || (user as any).email || 'User',
          userId: (user as any).uuid || (user as any).id || null,
        })
        return true
      }

      setAuthState(DEFAULT_AUTH_STATE)
      return false
    } catch (error) {
      console.error('❌ Error refreshing auth:', error)
      setAuthState(DEFAULT_AUTH_STATE)
      return false
    }
  }

  const signIn = async (): Promise<boolean> => {
    if (!puterReady) {
      console.error('❌ Puter not ready')
      alert('Puter is initializing. Please wait a moment and try again.')
      return false
    }

    if (!puter || !puter.auth) {
      console.error('❌ Puter not available')
      return false
    }

    setIsAuthLoading(true)
    try {
      console.log('🔐 Starting Puter sign in...')
      
      // Sign in with Puter
      const result = await puter.auth.signIn()
      console.log('✅ Sign in result:', result)

      // Wait for session to be established
      await new Promise(resolve => setTimeout(resolve, 500))

      // Refresh auth state
      const success = await refreshAuth()
      console.log('🔄 Auth refresh:', success)

      if (success) {
        console.log('✅ Successfully signed in!')
      }

      return success
    } catch (error: any) {
      console.error('❌ Sign in error:', error)
      alert(`Sign in failed: ${error.message || 'Unknown error'}`)
      return false
    } finally {
      setIsAuthLoading(false)
    }
  }

  const signOut = async (): Promise<boolean> => {
    if (!puter || !puter.auth) {
      console.error('❌ Puter not available')
      return false
    }

    setIsAuthLoading(true)
    try {
      console.log('🚪 Starting sign out...')
      await puter.auth.signOut()
      console.log('✅ Signed out')

      setAuthState(DEFAULT_AUTH_STATE)
      return true
    } catch (error: any) {
      console.error('❌ Sign out error:', error)
      return false
    } finally {
      setIsAuthLoading(false)
    }
  }

  console.log('🎨 Render state:', { puterReady, authState, isAuthLoading })

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <main className='min-h-screen bg-background text-foreground relative z-10'>
          {!puterReady && (
            <div className="fixed top-4 left-4 bg-yellow-100 border border-yellow-300 px-4 py-2 rounded text-sm z-50">
              ⏳ Initializing Puter...
            </div>
          )}

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