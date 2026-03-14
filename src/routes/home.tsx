import { ArrowRight, ArrowUpRight, Clock, Layers } from 'lucide-react'
import Navbar from '../components/Navbar'
import { Button } from '@/components/ui/button'
import Upload from '@/components/Upload'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { createProject } from '@/lib/puter.action'

export function meta(){
  return [
    { title: 'Roomify - Your Space Manager' },
    { name: 'description', content: 'Manage your spaces with Roomify' },
  ]
}

const UPLOAD_BASE64_STORAGE_KEY = 'roomify:last-upload-base64'
const UPLOAD_FILENAME_STORAGE_KEY = 'roomify:last-upload-filename'

export default function Home() {
  const navigate = useNavigate()
  const [project, setProject] = useState<DesignItem[]>([])

  // Clear any stale upload data so the Upload component doesn't
  // rehydrate and immediately redirect away from the homepage.
  useEffect(() => {
    window.sessionStorage.removeItem(UPLOAD_BASE64_STORAGE_KEY)
    window.sessionStorage.removeItem(UPLOAD_FILENAME_STORAGE_KEY)
  }, [])

  const handleUploadOnComplete = async (base64Image: string) => {
    const newId = Date.now().toString()
    const name = `Residence ${newId}`
    const newItem = {
      id: newId, name, sourceImage: base64Image, renderedImage: undefined,
      timestamp: Date.now()
    }

    const saved = await createProject({ item: newItem, visibility: 'private' })

    if(!saved) {
      console.error('failed to create project')
      return false
    } 

    setProject((prev) => [saved, ...prev])

    navigate(`/visualizer/${newId}`,  {
      state: {
       initialImage: saved.sourceImage,
       initialRendered: saved.renderedImage || null,
       name
      }
    }
    )
  }

  return (
    <div className="home">
      <Navbar />
      {/* Hero Section */}
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
          <Button variant='secondary' size='lg' className='demo'>
            Watch Demo
          </Button>
        </div>
        <div className="upload-shell" id='upload'>
          <div className="grid-overlay" />
          <div className="upload-card">
              <div className="upload-head">
                <div className="upload-icon">
                  <Layers className='icon' />
                </div>
                <h3>
                  Upload your floor plan
                </h3>
                <p>
                  Support JPEG, PNG, formats upto 10MB.
                </p>
              </div>
              <Upload onComplete={handleUploadOnComplete}  />
            </div>
        </div>
     </section>
     {/* Features Section */}
     <section className="projects">
              <div className="section-inner">
                  <div className="section-head">
                      <div className="copy">
                          <h2>Projects</h2>
                          <p>Your latest work and shared community projects, all in one place.</p>
                      </div>
                  </div>
        <div className="projects-grid">
          {project.map(({id, name, renderedImage, sourceImage, timestamp}) => (
                          <div key={id} className="project-card group">
                              <div className="preview">
                                  <img src={renderedImage || sourceImage} alt="Project" />
                                  <div className="badge">
                                    <span>Community</span>
                                  </div>
                              </div>
                             <div className="card-body">
                              <div>
                                <h3>{name}</h3>
                                <div className="meta">
                                  <Clock size={12}/>
                                  <span>{new Date(timestamp).toLocaleDateString()}</span>
                                  <span>By kinetic (Aka Pratyush)</span>
                                </div>
                              </div>
                              <div className="arrow">
                                <ArrowUpRight size={18} />
                              </div>
                             </div>
                          </div>
          ))}
                  </div>
      </div>
     </section>
    </div>
  )
}