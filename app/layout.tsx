import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import SupabaseProvider from '@/providers/SupabaseProvider'
import UserProvider from '@/providers/UserProvider'
import ModalProvider from '@/providers/ModalProvider'
import ToastProvider from '@/providers/ToastProvider'
import getSongsByUserId from '@/actions/getSongsByUserId'
import Player from '@/components/Player'
import Head from 'next/head'

const font = Figtree({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotify by Nick',
  description: 'Spotify Music Player Clone',
}

export const revalidate = 0

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userSongs = await getSongsByUserId()
  return (
    <html lang="en">
      <body className={font.className}>
        <Head>
          <link rel="icon" href="./favicon.ico" />
        </Head>
        <ToastProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <Sidebar songs={userSongs}>{children}</Sidebar>
            <Player />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}

/* TODO: 
  Tier 1:
    GitHub Link
    Adding to Library (in general)
    Adding mp3 and png to Repo
    Deployment

  Tier 2:
    Account Page:
      Supabase Full Name
      Profile Picture
      Displaying both next to "Uploaded by"
    Track Seeker:
      (Research)
    Deleting Songs:
      Only Songs uploaded by that user
      'x' icon in the Sidebar next to <MediaItem />
*/
