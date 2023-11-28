import { Song } from '@/types'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/* Returns an array of Song objects that have been liked by User */

const getLikedSongs = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data, error } = await supabase
    .from('liked_songs')
    .select('*, songs(*)')
    .eq('user_id', session?.user?.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.log(error)
    return []
  }

  if (!data) return []

  return data.map((userData) => ({
    ...userData.songs,
  }))
}

export default getLikedSongs
