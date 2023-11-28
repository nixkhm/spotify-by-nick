/*
  Component Name: Sidebar
  Purpose: Left option menu for Home/Search & Library
  Used In: layout.tsx
*/

'use client'

import { HiHome } from 'react-icons/hi'
import { BiSearch } from 'react-icons/bi'
import { FaGithub } from 'react-icons/fa'
import { twMerge } from 'tailwind-merge'
import { redirect, usePathname } from 'next/navigation'

import SidebarItem from './SidebarItem'
import Box from './Box'
import { useMemo } from 'react'
import Library from './Library'
import { Song } from '@/types'
import { AiFillHeart } from 'react-icons/ai'
import usePlayer from '@/hooks/usePlayer'

interface SidebarProps {
  songs: Song[]
  children: React.ReactNode
}

const Sidebar = ({ children, songs }: SidebarProps) => {
  const pathname = usePathname()
  const player = usePlayer()

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: 'Home',
        active: pathname === '/',
        href: '/',
      },
      {
        icon: BiSearch,
        label: 'Search',
        href: '/search',
        active: pathname === '/search',
      },
      {
        icon: AiFillHeart,
        label: 'Liked',
        href: '/liked',
        active: pathname === '/liked',
      },
      {
        icon: FaGithub,
        label: 'GitHub',
        href: 'https://github.com/nixkhm/spotify-by-nick',
        active: false,
        external: true,
      },
    ],
    [pathname],
  )

  return (
    <div
      className={twMerge(
        `flex 
        h-full
        `,
        player.activeId && 'h-[calc(100%-80px)]',
      )}
    >
      <div
        className="
          hidden 
          md:flex 
          flex-col 
          gap-y-2 
          bg-black 
          h-full 
          w-[300px] 
          p-2
        "
      >
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
                redirect={item.external}
              />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library songs={songs} />
        </Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">{children}</main>
    </div>
  )
}

export default Sidebar
