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
        title: 'TanStack Start Starter',
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

  const refreshAuth = async () => {
    try {
      const user = await getCurrentUser()
      setAuthState({
        isSignedIn: !!user,
        userName: user?.username || null,
        userId: user?.uuid || null
      })

      return !!user;

    } catch {
      setAuthState(DEFAULT_AUTH_STATE)
      return false
    }
  }

  useEffect(() => {
    refreshAuth()
  }, [])

  const signIn = async () => {
    await puterSignIn();
    return refreshAuth()
  }

  const signOut = async () => {
     puterSignOut();
    return refreshAuth()
  }
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <main className='min-h-screen bg-background text-foreground relative z-10'>
        <AuthContext.Provider
          value={{
            isSignedIn: authState.isSignedIn,
            userName: authState.userName,
            userId: authState.userId,
            refreshAuth,
            signIn,
            signOut,
          }}
        >
          <Outlet />
        </AuthContext.Provider>
      </main>
    </html>
  )
}


