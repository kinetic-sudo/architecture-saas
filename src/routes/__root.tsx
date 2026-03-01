import { HeadContent, createRootRoute, Outlet } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { createContext, useContext, useEffect, useState } from 'react'

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
    // REMOVE scripts property - it's causing the 401 error
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

// Declare puter on window
declare global {
  interface Window {
    puter: any
  }
}

function RootDocument() {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE)
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [puterReady, setPuterReady] = useState(false)

  // Load Puter script dynamically
  useEffect(() => {
    console.log('📦 Loading Puter script...')
    
    // Check if already loaded
    if (window.puter) {
      console.log('✅ Puter already loaded')
      setPuterReady(true)
      return
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://js.puter.com/v2/"]')
    if (existingScript) {
      console.log('⏳ Puter script already in DOM, waiting...')
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (window.puter) {
          console.log('✅ Puter loaded from existing script')
          setPuterReady(true)
          clearInterval(checkInterval)
        }
      }, 100)
      return () => clearInterval(checkInterval)
    }

    // Create and inject script
    const script = document.createElement('script')
    script.src = 'https://js.puter.com/v2/'
    script.async = true
    
    script.onload = () => {
      console.log('✅ Puter script loaded successfully')
      // Wait a bit for Puter to initialize
      setTimeout(() => {
        if (window.puter) {
          console.log('✅ Puter object available:', window.puter)
          setPuterReady(true)
        } else {
          console.error('❌ Puter loaded but window.puter not found')
        }
      }, 100)
    }
    
    script.onerror = (error) => {
      console.error('❌ Failed to load Puter script:', error)
    }
    
    document.head.appendChild(script)
    console.log('📝 Puter script injected into DOM')

    // Cleanup
    return () => {
      const scriptToRemove = document.querySelector('script[src="https://js.puter.com/v2/"]')
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove)
      }
    }
  }, [])

  const refreshAuth = async () => {
    if (!window.puter) {
      console.log('⚠️ Puter not ready yet')
      return false
    }

    try {
      // Use isSignedIn() first to check
      const isSignedIn = window.puter.auth.isSignedIn()
      console.log('🔍 isSignedIn():', isSignedIn)
      
      if (!isSignedIn) {
        console.log('ℹ️ User not signed in')
        setAuthState(DEFAULT_AUTH_STATE)
        return false
      }

      const user = await window.puter.auth.getUser()
      console.log('👤 Got user:', user)
      
      if (user) {
        setAuthState({
          isSignedIn: true,
          userName: user.username || user.email || 'User',
          userId: user.uuid || user.id || null,
        })
        return true
      } else {
        setAuthState(DEFAULT_AUTH_STATE)
        return false
      }
    } catch (error) {
      console.error('❌ Error refreshing auth:', error)
      setAuthState(DEFAULT_AUTH_STATE)
      return false
    }
  }

  // Check auth when Puter is ready
  useEffect(() => {
    if (puterReady) {
      console.log('🔄 Puter ready, checking auth...')
      refreshAuth()
    }
  }, [puterReady])

  const signIn = async () => {
    if (!window.puter) {
      console.error('❌ Puter not loaded')
      alert('Puter is not loaded yet. Please wait and try again.')
      return false
    }

    setIsAuthLoading(true)
    try {
      console.log('🔐 Starting Puter sign in...')
      console.log('📞 Calling window.puter.auth.signIn()...')
      
      // Call signIn - it will open a popup
      const result = await window.puter.auth.signIn()
      console.log('✅ Puter sign in result:', result)
      
      // Wait a moment for session to be established
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Refresh auth state
      const success = await refreshAuth()
      console.log('🔄 Auth refresh result:', success)
      
      if (success) {
        alert('Successfully signed in!')
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

  const signOut = async () => {
    if (!window.puter) {
      console.error('❌ Puter not loaded')
      return false
    }

    setIsAuthLoading(true)
    try {
      console.log('🚪 Starting Puter sign out...')
      await window.puter.auth.signOut()
      console.log('✅ Puter sign out successful')
      
      setAuthState(DEFAULT_AUTH_STATE)
      alert('Successfully signed out!')
      return true
    } catch (error: any) {
      console.error('❌ Sign out error:', error)
      alert(`Sign out failed: ${error.message || 'Unknown error'}`)
      return false
    } finally {
      setIsAuthLoading(false)
    }
  }

  console.log('🎨 Rendering with:', { puterReady, authState })

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <main className='min-h-screen bg-background text-foreground relative z-10'>
          {!puterReady && (
            <div className="fixed top-4 left-4 bg-yellow-100 border border-yellow-300 px-4 py-2 rounded text-sm z-50">
              ⏳ Loading Puter...
            </div>
          )}
          
          {puterReady && (
            <div className="fixed top-4 left-4 bg-green-100 border border-green-300 px-4 py-2 rounded text-sm z-50">
              ✅ Puter Ready
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