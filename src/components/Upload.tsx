import { useAuth } from '@/App'
import { CheckCircle2, ImageIcon, UploadIcon } from 'lucide-react'
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
                    <p className='help'>Maximum file size 50 MB</p>
                </div>
            </div>
        ) : (
            <div className='upload-status'>
                <div className="status-content">
                    <div className="status-icon">
                        {progress === 100 ? ( 
                            <CheckCircle2 className='check' />

                        ) : (
                            <ImageIcon className='image'/>
                        )}
                    </div>

                    <h3>{file.name}</h3>

                    <div className="progress">
                        <div className="bar" style={{width: `${progress}%`}} />

                        <p className='status-text'></p>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default Upload