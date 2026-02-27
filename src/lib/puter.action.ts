// lib/puter.action.ts
import puter from "@heyputer/puter.js";

export const signIn = async () => {
  try {
    console.log('📝 Calling puter.auth.signIn()...')
    const result = await puter.auth.signIn()
    console.log('✅ Puter signIn result:', result)
    return result
  } catch (error) {
    console.error('❌ Puter signIn error:', error)
    throw error
  }
}

export const signOut = async () => {
  try {
    console.log('📝 Calling puter.auth.signOut()...')
    await puter.auth.signOut()
    console.log('✅ Puter signOut completed')
    return true
  } catch (error) {
    console.error('❌ Puter signOut error:', error)
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    const user = await puter.auth.getUser()
    console.log('👤 Current user:', user)
    return user
  } catch (error) {
    console.log('ℹ️ No user signed in')
    return null
  }
}