import { Box, Home, Menu, X } from 'lucide-react'
import { Button } from './ui/button'

export default function Navbar() {
  const isSignedIn = false
  const userName = 'kinetic'
  const handleAuthClick =  async () => {

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
