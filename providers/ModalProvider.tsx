'use client'

import AuthModal from '@/components/AuthModal'
import UploadModal from '@/components/UploadModal'
import { useEffect, useState } from 'react'

const ModalProvider = () => {
  // State to track if the component is mounted.
  const [isMounted, setIsMounted] = useState(false)

  // Effect to set isMounted to true after component mounting.
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // If the component is not mounted, render nothing.
  if (!isMounted) {
    return null
  }

  // Render the AuthModal component within the modal provider.
  return (
    <>
      <AuthModal />
      <UploadModal />
    </>
  )
}

export default ModalProvider
