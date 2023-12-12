'use client'

import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react'
import Modal from './Modal'
import { useRouter } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import useAuthModal from '@/hooks/useAuthModal'
import { useEffect } from 'react'
import modal_logo from '../public/images/modal_logo.png'
import Button from './Button'

/*
  Component Name: AuthModal
  Purpose: Signing into App
  Used In: ModalProvider.tsx
*/

const AuthModal = () => {
  // Access Supabase client and router from Next.js.
  const supabaseClient = useSupabaseClient()
  const router = useRouter()

  // Get session information using the session context.
  const { session } = useSessionContext()

  // Retrieve state and functions from the custom useAuthModal hook.
  const { onOpen, onClose, isOpen } = useAuthModal()

  // Effect to refresh the page and close the modal when a session is present.
  useEffect(() => {
    if (session) {
      router.refresh()
      onClose()
    }
  }, [session, router, onClose])

  // Callback function to handle modal state changes.
  const onChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  useEffect(() => {
    if (!session) onOpen()
  }, [session])

  return (
    <Modal
      title="Spotify (by Nick)"
      description="Login or Create an Account"
      isOpen={isOpen}
      onChange={onChange}
      hasImage
      image={modal_logo}
    >
      <Auth
        theme="dark"
        magicLink
        providers={['github']}
        supabaseClient={supabaseClient}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#2E5A88',
                brandAccent: '#808080',
              },
            },
          },
        }}
      />
      <div className="p-3 mb-5">
        <Button onClick={() => onClose()}>Close & Browse Music</Button>
      </div>
    </Modal>
  )
}

export default AuthModal
