import { Box } from 'lucide-react'
import { Button } from './ui/button'
import { useAuth } from '@/routes/__root'

export default function Navbar() {
  const { isSignedIn, userName, signIn, signOut } = useAuth()

  const handleAuthClick = async () => {
    if(isSignedIn) {
      try {
        await signOut()
      } catch (e) {
        console.log(`puter failed to signIn user: ${e}`)
      }
      return ;
    } 
    try {
      await signIn()
    } catch (e) {
      console.log(`login failed: ${e}`)
    }
  }


  return (
    <header className='navbar'>
      <nav className='inner'>
        <div className="left">
          <div className="brand">
            <Box className='logo'/>
            <span className='name'>
              Roomify
            </span>
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
            <Button size='sm' className='btn' onClick={handleAuthClick}>
              Log out
            </Button>
            </>
          ) : (
            <> 
            <Button size='sm' onClick={handleAuthClick}
            variant='ghost'
            >
              Log In
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
