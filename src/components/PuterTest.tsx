// components/PuterTest.tsx - SIMPLIFIED VERSION
import { useState } from 'react'
import puter from "@heyputer/puter.js"

export default function PuterTest() {
  const [result, setResult] = useState<string>('')

  console.log('🎨 PuterTest component rendering')

  const testPuter = () => {
    console.log('🔘 testPuter function called')
    alert('Test button clicked!')
    
    console.log('=== PUTER TEST START ===')
    console.log('1. Puter object:', puter)
    console.log('2. Puter.auth:', puter?.auth)
    console.log('3. Window.puter:', (window as any).puter)
    console.log('=== PUTER TEST END ===')
    
    setResult('Check console logs')
  }

  return (
    <div 
      className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg border z-[9999]"
      style={{ zIndex: 99999 }}
    >
      <h3 className="font-bold mb-2">Puter Test (Red Box)</h3>
      <button 
        onClick={testPuter}
        className="bg-white text-black px-4 py-2 rounded font-bold"
      >
        CLICK ME
      </button>
      {result && (
        <div className="mt-2 text-sm bg-white text-black p-2 rounded">
          {result}
        </div>
      )}
    </div>
  )
}