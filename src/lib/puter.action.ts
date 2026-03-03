import { puter } from '@heyputer/puter.js'  // ✅ named export

export const signIn = async () => {
  return await puter.auth.signIn()
}

export const signOut = async () => {
   puter.auth.signOut()
  return true
}

export const getCurrentUser = async () => {
  return await puter.auth.getUser()
}