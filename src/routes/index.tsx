import Navbar from '@/components/Navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })



function App() {
  return (
    <div className='home'>
      <Navbar />
      <h1 className="text-3xl text-indigo-700 font-extrabold">
        Home
      </h1>
    </div>
  )
}

