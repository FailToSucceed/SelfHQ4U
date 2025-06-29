import { supabase } from './supabase'

export interface AuthError {
  message: string
}

export async function signUp(email: string, password: string, metadata?: {
  firstName?: string
  lastName?: string
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

  // If user is created and we have metadata, update the profile
  if (data.user && metadata) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: metadata.firstName,
        last_name: metadata.lastName,
        address: metadata.address
      })
      .eq('id', data.user.id)

    if (profileError) {
      console.error('Profile update error:', profileError)
    }
  }
  
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