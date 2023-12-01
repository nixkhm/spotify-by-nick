// Modify useSelectedSong to include setSelectedSong
import { create } from 'zustand'
import { Song } from '@/types'

interface State {
  selectedSong: Song | null
  setSelectedSong: (song: Song) => void
}

const useSelectedSong = create<State>((set) => ({
  selectedSong: null,
  setSelectedSong: (song: Song) => set({ selectedSong: song }),
}))

export default useSelectedSong
