'use client'

import useAuthModal from '@/hooks/useAuthModal'
import { useUser } from '@/hooks/useUser'
import { useSessionContext } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'

interface LikeButtonProps {
  songId: string
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const [isLiked, setIsLiked] = useState(false)

  const router = useRouter()
  const authModal = useAuthModal()

  const { user } = useUser()
  const { supabaseClient } = useSessionContext()

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen()
    }

    if (isLiked) {
      const { error } = await supabaseClient
        .from('liked_songs')
        .delete()
        .eq('user_id', user.id)
        .eq('song_id', songId)

      if (error) {
        toast.error(error.message)
      } else {
        setIsLiked(false)
        toast.error('Removed from Liked Songs')
      }
    } else {
      const { error } = await supabaseClient.from('liked_songs').insert({
        song_id: songId,
        user_id: user.id,
      })

      if (error) {
        toast.error(error.message)
      } else {
        setIsLiked(true)
        toast.success('Added to Liked Songs')
      }
    }

    router.refresh()
  }

  useEffect(() => {
    if (!user?.id) return

    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from('liked_songs')
        .select('*')
        .eq('user_id', user.id)
        .eq('song_id', songId)
        .single()

      if (!error && data) setIsLiked(true)
    }

    fetchData()
  }, [songId, supabaseClient, user?.id])

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart

  return (
    <button
      className="
    hover:opacity-75
    transition"
    >
      <Icon
        color={isLiked ? '2E5A88' : 'white'}
        size={25}
        onClick={handleLike}
      />
    </button>
  )
}

export default LikeButton
