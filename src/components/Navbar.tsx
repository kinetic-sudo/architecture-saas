import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import { Box, Home, Menu, X } from 'lucide-react'

export default function Navbar() {
  const handleAuthClick =  async () => {

  }

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
          <ul className='links'>
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Community</a>
            <a href="#">Enterprises</a>
          </ul>
        </div>
        <div className="actions">
          <button onClick={handleAuthClick}>

          </button>
        </div>
      </nav>
    </header>
    </>
  )
}
