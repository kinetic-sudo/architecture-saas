import { HeadContent, createRootRoute, Outlet } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { createContext, useContext, useEffect, useState } from 'react'
import puter from '@heyputer/puter.js'  // ← Direct import

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
      <p className="text-muted-foreground mt-2">The page you're looking for doesn't exist.</p>
    </div>
  ),
})

export const AuthContext = createContext<authContext | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthContext.Provider')
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

  useEffect(() => {
    // Puter loads synchronously via index.html script tag
    // By the time React runs, window.puter is already available
    const checkPuter = () => {
      if (window.puter?.auth) {
        console.log('✅ Puter ready:', window.puter)
        setPuterReady(true)
        refreshAuth()
      } else {
        console.log('⏳ Waiting for puter...')
        setTimeout(checkPuter, 100)
      }
    }
    checkPuter()
  }, [])

  const refreshAuth = async (): Promise<boolean> => {
    try {
      const isSignedIn = puter.auth.isSignedIn()
      if (!isSignedIn) {
        setAuthState(DEFAULT_AUTH_STATE)
        return false
      }
      const user = await puter.auth.getUser()
      if (user) {
        setAuthState({
          isSignedIn: true,
          userName: user.username || user.email || 'User',
          userId: user.uuid || user.id || null,
        })
        return true
      }
      setAuthState(DEFAULT_AUTH_STATE)
      return false
    } catch (error) {
      console.error('❌ refreshAuth error:', error)
      setAuthState(DEFAULT_AUTH_STATE)
      return false
    }
  }

  const signIn = async (): Promise<boolean> => {
    setIsAuthLoading(true)
    try {
      await puter.auth.signIn()
      await new Promise(resolve => setTimeout(resolve, 500))
      return await refreshAuth()
    } catch (error: any) {
      console.error('❌ Sign in error:', error)
      return false
    } finally {
      setIsAuthLoading(false)
    }
  }

  const signOut = async (): Promise<boolean> => {
    setIsAuthLoading(true)
    try {
       puter.auth.signOut()
      setAuthState(DEFAULT_AUTH_STATE)
      return true
    } catch (error: any) {
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