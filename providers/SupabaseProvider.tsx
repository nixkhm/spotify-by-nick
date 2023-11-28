'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { Database } from '@/types_db'

interface SupabaseProviderProps {
  children: React.ReactNode
}

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  // Initialize state to hold the Supabase client using the createClientComponentClient function
  const [supabaseClient] = useState(() =>
    createClientComponentClient<Database>(),
  )

  // Wrap the children with the SessionContextProvider, passing the Supabase client as a prop
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}

export default SupabaseProvider
