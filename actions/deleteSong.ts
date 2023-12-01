// deleteSong.ts
import { Song } from '@/types';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

/* Deletes a song (Only the user can delete their own songs) */
const deleteSong = async (song: Song, client: SupabaseClient) => {

 const { error } = await client
  .from('songs')
  .delete()
  .eq('id', song.id);

  if (error) {
    console.error(error);
    throw error;
  }
};

export default deleteSong;
