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
            <div>
                No file
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