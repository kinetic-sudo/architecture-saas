import { ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import { Button } from '@/components/ui/button'

export function meta(){
  return [
    { title: 'Roomify - Your Space Manager' },
    { name: 'description', content: 'Manage your spaces with Roomify' },
  ]
}

export default function Home() {
  return (
    <div className="home">
      <Navbar />
     <section className='hero'>
      <div className="announce">
        <div className="dot">
          <div className="pulse"></div>
        </div>
        <p>Introducing Roomify - Your Space Manager</p>
      </div>
        <h1>Build beautiful spaces at the speed of thought with roomify</h1>
        <p className="subtitle">
          Roomify is an first Ai-first design enviroment
          that helps you visulize, render, ship archetural projects faster than ever.
        </p>
        <div className="actions">
          <a href="/upload" className='cta'>
            Start Building <ArrowRight className='icon' />
          </a>
          <Button variant='outline' size='lg' className='demo'>
            Watch Demo
          </Button>
        </div>
     </section>
    </div>
  )
}