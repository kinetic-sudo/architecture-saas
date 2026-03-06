import React,{useState} from 'react'

const Upload = () => {

    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)

  return (
    <div className='upload'>

    </div>
  )
}

export default Upload