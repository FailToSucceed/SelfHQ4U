import { supabase } from './supabase'

export interface AuthError {
  message: string
}

export async function signUp(email: string, password: string, metadata?: {
  firstName?: string
  lastName?: string
  username?: string
  address?: string
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })
  
  if (error) {
    throw new Error(error.message)
  }

  // Profile will be automatically created by the database trigger
  // with the username from metadata
  
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}