import { Routes, Route } from 'react-router-dom'
import { createContext, useContext, useEffect, useState } from 'react'
import { Layout } from '@/routes/layout'
import Home from '@/routes/home'
import Visualizer from '@/routes/visualizer.$id'

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

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

const DEFAULT: AuthState = { isSignedIn: false, userName: null, userId: null }

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT)
  const [isAuthLoading, setIsAuthLoading] = useState(false)

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
      setAuthState(DEFAULT)
      return false
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (!window.puter?.auth) {
        console.error('❌ window.puter not found')
        return
      }
      console.log('✅ window.puter ready')
      refreshAuth()
    }, 300)
  }, [])

  const signIn = async (): Promise<boolean> => {
    if (!p()?.auth) return false
    setIsAuthLoading(true)
    try {
      await p().auth.signIn()
      await new Promise(r => setTimeout(r, 800))
      return await refreshAuth()
    } catch (e: any) {
      console.log('signIn cancelled:', e?.message)
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

export default function App() {
  return (
    <AuthProvider>
      <Layout>  {/* ← wrap everything in Layout */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visualizer/:id" element={<Visualizer />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}