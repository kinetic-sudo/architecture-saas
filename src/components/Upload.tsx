import { useAuth } from '@/App'
import { UploadIcon } from 'lucide-react'
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
                <div className='drop-content'>
                    <div className="drop-icon">
                        <UploadIcon size={20} />
                    </div>
                    <p>
                        {isSignedIn ? (
                            "Click to upload or just drag and drop"
                        ) : (
                            "Sign in or sign up with puter to upload"
                        )}
                    </p>
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