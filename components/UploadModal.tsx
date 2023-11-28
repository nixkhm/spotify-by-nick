'use client'

import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import uniqid from 'uniqid'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'

import useUploadModal from '@/hooks/useUploadModal'
import { useUser } from '@/hooks/useUser'
import Input from './Input'
import Button from './Button'
import Modal from './Modal'

const UploadModal = () => {
  const uploadModal = useUploadModal()
  const supabaseClient = useSupabaseClient()
  const router = useRouter()

  const { user } = useUser()
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  // Callback function to handle modal state changes.
  const onChange = (open: boolean) => {
    if (!open) {
      reset()
      uploadModal.onClose()
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    //submit to supabase
    try {
      setIsLoading(true)

      /* Files Uploaded in Modal */
      const songFile = values.song?.[0]
      const imageFile = values.image?.[0]

      /* All values are required */
      if (!imageFile || !songFile || !user) {
        toast.error('Missing Fields')
        return
      }

      /* Same UUID for Image and Song*/
      const uniqueId = uniqid()

      /* Upload Song to Bucket */
      const { data: songData, error: songError } = await supabaseClient.storage
        .from('songs')
        .upload(`song-${values.title}-${uniqueId}`, songFile, {
          cacheControl: '3600',
          upsert: false,
        })

      /* If Error, return Toast */
      if (songError) {
        setIsLoading(false)
        return toast.error('Failed Song Upload. Please try again')
      }

      /* Upload Image to Bucket */
      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from('images')
          .upload(`image-${values.title}-${uniqueId}`, imageFile, {
            cacheControl: '3600',
            upsert: false,
          })

      /* If Error, return Toast */
      if (imageError) {
        setIsLoading(false)
        return toast.error('Failed Image Upload. Please try again')
      }

      /* Adding Song/Image to Bucket*/
      const { error: supabaseError } = await supabaseClient
        .from('songs')
        .insert({
          user_id: user.id,
          title: values.title,
          artist: values.artist,
          image_path: imageData.path,
          song_path: songData.path,
        })

      if (supabaseError) {
        setIsLoading(false)
        return toast.error('Error Uploading. Please try again')
      }

      /* Upload was Successful */
      router.refresh()
      setIsLoading(false)
      toast.success('Song Added to Library')
      uploadModal.onClose()
    } catch (error) {
      toast.error('An Issue Occured. Please Try Again')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      title="Add Song to Library"
      description="Upload an Audio and Image File"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
      flex flex-col gap-y-4"
      >
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Title"
        />
        <Input
          id="Artist"
          disabled={isLoading}
          {...register('artist', { required: true })}
          placeholder="Artist"
        />
        <div>
          <div className="pb-1">Audio File (MP3)</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            {...register('song', { required: true })}
            accept=".mp3"
          />
        </div>
        <div>
          <div className="pb-1">Image File (JPEG / PNG)</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            {...register('image', { required: true })}
            accept="image/*"
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Add +
        </Button>
      </form>
    </Modal>
  )
}

export default UploadModal
