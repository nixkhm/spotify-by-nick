'use client'

import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Button from './Button'
import Modal from './Modal'
import useDeleteModal from '@/hooks/useDeleteModal'
import deleteSong from '@/actions/deleteSong'
import usePlayer from '@/hooks/usePlayer'
import useSelectedSong from '@/hooks/useSelectedSong'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const DeleteModal = () => {
  const deleteModal = useDeleteModal()
  const player = usePlayer()
  const selectedSong = useSelectedSong((state) => state.selectedSong)

  const supabaseClient = useSupabaseClient()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const handleBack = () => {
    deleteModal.onClose()
  }

  const handleDelete = async () => {
    try {
      if (selectedSong) {
        setIsLoading(true)
        await deleteSong(selectedSong, supabaseClient)
      }
    } catch (error) {
      console.error('Error deleting song:', error)
      setIsLoading(false)
    } finally {
      toast.error('Song Deleted from Library')
      setIsLoading(false)
      player.reset()
      deleteModal.onClose()
      router.refresh()
    }
  }

  return (
    <Modal
      title="Are you sure you want to delete this song?"
      description="(This action cannot be undone)"
      isOpen={deleteModal.isOpen}
    >
      <div
        className="
      flex flex-row gap-y-4 gap-x-4 p-2"
      >
        <Button disabled={isLoading} type="submit" onClick={handleBack}>
          Back
        </Button>
        <Button disabled={isLoading} type="submit" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </Modal>
  )
}

export default DeleteModal
