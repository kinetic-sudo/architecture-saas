import { useAuth } from '@/App'
import React,{useState} from 'react'

const Upload = () => {

    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [progress, setIsProgress] = useState(0)

    const { isSignedIn } = useAuth()

  return (
    <div className='upload'>
        {!file ? (
            <div className={`dropzone ${isDragging ? "is-dragging" : ""}`}>
                <input type="file" 
                className='drop-input' 
                accept='.jpg,.jpeg,.png' 
                disabled={!isSignedIn}
                />
                <div className=''>

                </div>
            </div>
        ) : (
            <div>
                File
            </div>
        )}
    </div>
  )
}

export default Upload