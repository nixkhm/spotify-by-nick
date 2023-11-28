import { create } from 'zustand'

interface UploadModalStore {
  isOpen: boolean // Indicates whether the authentication modal is open or closed.
  onOpen: () => void // Function to open the authentication modal.
  onClose: () => void // Function to close the authentication modal.
}

const useUploadModal = create<UploadModalStore>((set) => ({
  isOpen: false, // Initial state: modal is closed.
  onOpen: () => set({ isOpen: true }), // Set modal state to open.
  onClose: () => set({ isOpen: false }), // Set modal state to closed.
}))

export default useUploadModal
