import Navbar from '@/components/Navbar'
import PuterTest from '@/components/PuterTest'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })



function App() {
  return (
    <div className='home'>
      <Navbar />
      <PuterTest />
      <h1 className="text-3xl text-indigo-700 font-extrabold">
        Home
      </h1>
    </div>
  )
}

