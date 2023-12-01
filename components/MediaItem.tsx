'use client'

import Image from 'next/image'

import useLoadImage from '@/hooks/useLoadImage'
import { Song } from '@/types'
import { useUserDetails } from '@/hooks/useUser'
import { useState } from 'react'
import DeleteSong from './DeleteSong'
import useSelectedSong from '@/hooks/useSelectedSong'

interface MediaItemProps {
  data: Song
  inSideBar?: boolean
  onClick?: (id: string) => void
  showUploadedBy?: boolean
  showDelete?: boolean
}

const MediaItem: React.FC<MediaItemProps> = ({
  data,
  onClick,
  showUploadedBy,
  showDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const imageUrl = useLoadImage(data)
  const userDetails = useUserDetails()

  let uploadName

  if (userDetails?.id === data.user_id) uploadName = 'me'
  else uploadName = 'Another User'

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id)
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div className="flow-root">
      <div
        onClick={handleClick}
        className={`
          flex 
          items-center 
          gap-x-3 
          cursor-pointer 
          hover:bg-neutral-800/50 
          w-full 
          p-2 
          rounded-md
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`
            relative 
            rounded-md 
            min-h-[48px] 
            min-w-[48px] 
            overflow-hidden
          `}
        >
          <Image
            fill
            src={imageUrl || '/images/music-placeholder.png'}
            alt="MediaItem"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-y-1 overflow-hidden">
          <p className="text-white truncate">{data.title}</p>
          <p className="text-neutral-400 text-sm truncate">
            {data.artist}
            {showUploadedBy ? `- Uploaded by ${uploadName}` : ''}
          </p>
        </div>
        {isHovered && showDelete && <DeleteSong song={data} key={data.id} />}
      </div>
    </div>
  )
}

export default MediaItem
