import { generate3DView } from '@/lib/ai.action'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { Box, Download, RefreshCcw, Share2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { timeStamp } from 'console'

const VisualizerId = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userId } = useOutletContext<AuthContext>()

  const hasIntialGenerated = useRef(false)
  const [project, setProject] = useState< DesignItem | null >(null)
  const [isProjectLoading, setIsProjectLoading] = useState(true)

  const [isProcessing, setIsProcessing] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)

  const handleBack = () => navigate('/')

  const runGeneration = async (item: DesignItem) => {
    if (!id || !item.sourceImage ) return;

    try {
        setIsProcessing(true)
        const result = await generate3DView({sourceImage: item.sourceImage})

        if(result.renderedImage) {
            setCurrentImage(result.renderedImage)
            
           const updatedItem = {
              ...item,
              renderedImage: result.renderedImage,
              renderedPath: result.renderedPath,
              timeStamp: Date.now(),
              ownerID: item.ownerId ?? userId ?? null,
              isPublic: item.isPublic ?? false
           }
        }
    } catch (error) {
        console.error('generation failed:', error)
    } finally {
        setIsProcessing(false)
    }
  } 

  useEffect(() => {
    if(!initialImage || hasIntialGenerated.current) return;

    if(initialRender) {
        setCurrentImage(initialRender);
        hasIntialGenerated.current = true
        return;
    }

    hasIntialGenerated.current = true
    runGeneration()
  }, [initialImage, initialRender])
  

  return (
      <div className="visualizer">
        <nav className='topbar'>
            <div className='brand'>
              <Box className='logo'/>
              <span className='name'>Roomify</span>
            </div>
            <Button variant='ghost' size='sm' onClick={handleBack} className='exit'>
                <X className='icon'/>Exit Editor
            </Button>
        </nav>
        
        <section className='content'>
            <div className='panel'>
            <div className="panel-header">
                <div className="panel-meta">
                    <p>Project</p>
                    <h2>{'Untitled Project'}</h2>
                    <p className='note'>Created by you</p>
                </div>
                <div className="panel-actions">
                    <Button
                     size='sm'
                     onClick={() => {}}
                     className='export'
                     disabled={!currentImage}
                    > 
                    <Download className='w-4 mr-2 h-2'/> Export
                    </Button>
                    <Button 
                     size='sm'
                     onClick={() => {}}
                     className='share'
                    >
                        <Share2 className='w-4 mr-2 h-2' /> Share
                    </Button>
                </div>
            </div>

            <div className={`render-area ${isProcessing ? 'is-processing' :'' }`}>
                {currentImage ? (
                    <img src={currentImage} alt='AI render' className='render-img'/>
                ) : (
                    <div className='render-placeholder'>
                        {initialImage && (
                            <img src={initialImage} alt="Origninal" className='render-fallback' />
                        )}
                    </div>
                )}

                {isProcessing && (
                    <div className='render-overlay'>
                        <div className="rendering-card">
                            <RefreshCcw className='spinner'/>
                            <span className='title'>Rendering...</span>
                            <span className='subtitle'>Generating Your Visualizaton...</span>
                        </div>
                    </div>
                )}
            </div>

            </div>
        </section>
      </div>
  )
}

export default VisualizerId
