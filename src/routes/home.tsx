import Navbar from '../components/Navbar'

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
      <main>
        <h1 className="text-3xl text-indigo-700 font-extrabold">Home</h1>
      </main>
    </div>
  )
}