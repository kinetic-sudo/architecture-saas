import { useAuth } from '@/App'
import { PROGRESS_INTERVAL_MS, PROGRESS_STEP, REDIRECT_DELAY_MS } from '@/lib/constants'
import { CheckCircle2, ImageIcon, UploadIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

type UploadProps = {
  onComplete?: (data: string) => void
}


const Upload: React.FC<UploadProps> = ({ onComplete }) => {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)

  const intervalRef = useRef<number | null>(null)
  const { isSignedIn } = useAuth()

  const clearProgressInterval = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      clearProgressInterval()
    }
  }, [])

  const processFile = (selectedFile: File) => {
    if (!isSignedIn) return

    setFile(selectedFile)
    setProgress(0)
    clearProgressInterval()

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result !== 'string') return

      const result = reader.result
      const base64 = result.includes('base64,') ? result.split('base64,')[1] : result

      console.log('upload document:', base64)


      let currentProgress = 0

      intervalRef.current = window.setInterval(() => {
        currentProgress = Math.min(100, currentProgress + PROGRESS_STEP)
        setProgress(currentProgress)

        if (currentProgress >= 100) {
          clearProgressInterval()

          if (onComplete) {
            window.setTimeout(() => {
              onComplete(base64)
            }, REDIRECT_DELAY_MS)
          }
        }
      }, PROGRESS_INTERVAL_MS)
    }

    reader.readAsDataURL(selectedFile)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) return
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (!isSignedIn) return
    setIsDragging(true)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (!isSignedIn) return
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (!isSignedIn) return
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (!isSignedIn) return
    setIsDragging(false)

    const droppedFile = event.dataTransfer.files?.[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }

  return (
    <div className="upload">
      {!file ? (
        <div
          className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="drop-input"
            accept=".jpg,.jpeg,.png"
            disabled={!isSignedIn}
            onChange={handleFileChange}
          />
          <div className="drop-content">
            <div className="drop-icon">
              <UploadIcon size={20} />
            </div>
            <p>
              {isSignedIn
                ? 'Click to upload or just drag and drop'
                : 'Sign in or sign up with puter to upload'}
            </p>
            <p className="help">Maximum file size 50 MB</p>
          </div>
        </div>
      ) : (
        <div className="upload-status">
          <div className="status-content">
            <div className="status-icon">
              {progress === 100 ? <CheckCircle2 className="check" /> : <ImageIcon className="image" />}
            </div>

            <h3>{file.name}</h3>

            <div className="progress">
              <div className="bar" style={{ width: `${progress}%` }} />

              <p className="status-text">
                {progress < 100 ? 'Ananlyzing floor...' : 'Redircting...'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Upload