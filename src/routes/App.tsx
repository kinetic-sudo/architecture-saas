import { Routes, Route } from 'react-router-dom'
import { createContext, useContext, useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
// import HomePage from '@/pages/HomePage' // your existing page

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthState {
  isSignedIn: boolean
  userName: string | null
  userId: string | null
}

type AuthContextType = {
  isSignedIn: boolean
  userName: string | null
  userId: string | null
  isAuthLoading: boolean
  signIn: () => Promise<boolean>
  signOut: () => Promise<boolean>
  refreshAuth: () => Promise<boolean>
}

declare global {
  interface Window { puter: any }
}

// ─── Auth Context ─────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

const DEFAULT: AuthState = { isSignedIn: false, userName: null, userId: null }

// ─── Auth Provider ────────────────────────────────────────────────────────────

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT)
  const [isAuthLoading, setIsAuthLoading] = useState(false)

  // window.puter is already available — loaded by index.html script tag
  const p = () => window.puter

  const refreshAuth = async (): Promise<boolean> => {
    try {
      if (!p()?.auth) return false
      const signedIn = p().auth.isSignedIn()
      if (!signedIn) { setAuthState(DEFAULT); return false }
      const user = await p().auth.getUser()
      if (user) {
        setAuthState({
          isSignedIn: true,
          userName: user.username || user.email || 'User',
          userId: user.uuid || user.id || null,
        })
        return true
      }
      setAuthState(DEFAULT)
      return false
    } catch (e) {
      console.error('refreshAuth error:', e)
      setAuthState(DEFAULT)
      return false
    }
  }

  useEffect(() => {
    // puter is on window already — just check auth state on mount
    const check = async () => {
      if (!window.puter?.auth) {
        console.error('❌ window.puter not found — check index.html script tag')
        return
      }
      console.log('✅ window.puter ready')
      await refreshAuth()
    }
    check()
  }, [])

  const signIn = async (): Promise<boolean> => {
    setIsAuthLoading(true)
    try {
      console.log('🔐 puter.auth.signIn()...')
      await p().auth.signIn()
      await new Promise(r => setTimeout(r, 500))
      return await refreshAuth()
    } catch (e: any) {
      console.error('signIn error:', e)
      return false
    } finally {
      setIsAuthLoading(false)
    }
  }

  const signOut = async (): Promise<boolean> => {
    setIsAuthLoading(true)
    try {
      await p().auth.signOut()
      setAuthState(DEFAULT)
      return true
    } catch (e: any) {
      console.error('signOut error:', e)
      return false
    } finally {
      setIsAuthLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{
      ...authState, isAuthLoading, signIn, signOut, refreshAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        {/* add more routes here */}
      </Routes>
    </AuthProvider>
  )
}