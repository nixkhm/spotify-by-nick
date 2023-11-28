import { FaPlay } from 'react-icons/fa'

const PlayButton = () => {
  return (
    <button
      className="
    transition 
        opacity-0 
        rounded-full 
        flex 
        items-center 
        justify-center 
        bg-blue-500 
        drop-shadow-md 
        translate
        p-3
        translate-y-1/4
        group-hover:opacity-100 
        group-hover:translate-y-0
        hover:scale-105"
    >
      <FaPlay className="text-black" />
    </button>
  )
}

export default PlayButton
