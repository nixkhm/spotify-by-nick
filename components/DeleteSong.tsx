import { Song } from '@/types'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import usePlayer from '@/hooks/usePlayer'
import useDeleteModal from '@/hooks/useDeleteModal'
import useSelectedSong from '@/hooks/useSelectedSong'

interface DeleteSongProps {
  song: Song
}

const DeleteSong: React.FC<DeleteSongProps> = ({ song }) => {
  const player = usePlayer()
  const deleteModal = useDeleteModal()
  const setSelectedSong = useSelectedSong((state) => state.setSelectedSong)

  const handleDelete = () => {
    setSelectedSong(song)
    player.reset()
    deleteModal.onOpen()
  }

  return <IoMdCloseCircleOutline onClick={handleDelete} size={26} />
}

export default DeleteSong
