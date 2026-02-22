import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import { Box, Home, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
    <header className='navbar'>
      <nav className='inner'>
        <div className="left">
          <div className="brand">
            <Box className='logo'/>
            <span className='name'>
              Roomify
            </span>
          </div>
        </div>
      </nav>
    </header>
    </>
  )
}
