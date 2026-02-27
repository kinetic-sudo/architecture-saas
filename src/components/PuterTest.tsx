// components/PuterTest.tsx
import { useState } from 'react'
import puter from "@heyputer/puter.js"
import { Button } from './ui/button'

export default function PuterTest() {
  const [result, setResult] = useState<string>('')

  const testPuter = async () => {
    console.log('=== PUTER TEST START ===')
    
    // Test 1: Check if Puter exists
    console.log('1. Puter object:', puter)
    console.log('2. Puter.auth:', puter?.auth)
    console.log('3. Window.puter:', (window as any).puter)
    
    // Test 2: Try to get current user
    try {
      const user = await puter.auth.getUser()
      console.log('4. Current user:', user)
      setResult(`User: ${JSON.stringify(user)}`)
    } catch (error) {
      console.log('4. No user (expected if not logged in):', error)
      setResult('No user logged in')
    }
    
    // Test 3: Try to sign in
    try {
      console.log('5. Attempting sign in...')
      const signInResult = await puter.auth.signIn()
      console.log('6. Sign in result:', signInResult)
      setResult(`Sign in success: ${JSON.stringify(signInResult)}`)
    } catch (error) {
      console.error('6. Sign in error:', error)
      setResult(`Error: ${error.message}`)
    }
    
    console.log('=== PUTER TEST END ===')
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
      <h3 className="font-bold mb-2">Puter Test</h3>
      <Button onClick={testPuter}>Test Puter Auth</Button>
      {result && (
        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded max-w-xs overflow-auto">
          {result}
        </pre>
      )}
    </div>
  )
}