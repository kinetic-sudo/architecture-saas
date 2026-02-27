// components/Navbar.tsx
import { Box, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { useAuth } from '@/routes/__root'
import { useState } from 'react'

export default function Navbar() {
  const { isSignedIn, userName, signIn, signOut, isAuthLoading } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAuthClick = async () => {
    setIsProcessing(true)
    
    try {
      if (isSignedIn) {
        console.log('🔄 Logging out...')
        const success = await signOut()
        if (success) {
          console.log('✅ Logged out successfully')
        }
      } else {
        console.log('🔄 Logging in...')
        const success = await signIn()
        if (success) {
          console.log('✅ Logged in successfully')
        } else {
          console.log('⚠️ Login did not complete')
        }
      }
    } catch (error) {
      console.error('❌ Auth action failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const isLoading = isAuthLoading || isProcessing

  return (
    <header className='navbar'>
      <nav className='inner'>
        <div className="left">
          <div className="brand">
            <Box className='logo'/>
            <span className='name'>Roomify</span>
          </div>
          <ul className='links'>
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Community</a>
            <a href="#">Enterprises</a>
          </ul>
        </div>
        <div className="actions">
          {isSignedIn ? (
            <>
              <span className='greeting'>
                {userName ? `Hi, ${userName}` : 'Signed In'}
              </span>
              <Button 
                size='sm' 
                className='btn' 
                onClick={handleAuthClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  'Log out'
                )}
              </Button>
            </>
          ) : (
            <> 
              <Button 
                size='sm' 
                onClick={handleAuthClick}
                variant='ghost'
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Log In'
                )}
              </Button>
              <a href="#upload" className='cta'>
                Get Started
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}