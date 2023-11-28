import { Subscription, UserDetails } from '@/types'
import { User } from '@supabase/auth-helpers-nextjs'
import {
  useSessionContext,
  useUser as useSupaUser,
} from '@supabase/auth-helpers-react'
import { createContext, useContext, useEffect, useState } from 'react'

type UserContextType = {
  accessToken: string | null
  user: User | null
  userDetails: UserDetails | null
  isLoading: boolean
  subscription: Subscription | null
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export interface Props {
  [propName: string]: any
}

export const MyUserContextProvider = (props: Props) => {
  /* Destructure session, isLoadingUser, and supabaseClient from the useSessionContext hook */
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext()

  /* Use the useSupaUser hook to get the authenticated user */
  const user = useSupaUser()
  /* Extract the access token from the session or default to null */
  const accessToken = session?.access_token ?? null

  /* State to track loading status of user data */
  const [isLoadingData, setIsLoadingData] = useState(false)
  /* State to store user details */
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  /* State to store subscription details */
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  /* Function to fetch user details from the "users" table */
  const getUserDetails = () => supabase.from('users').select('*').single()

  useEffect(() => {
    /* Check if user is authenticated and data is not already being loaded */
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsLoadingData(true)

      /* Execute both data fetching promises concurrently */
      Promise.allSettled([getUserDetails()]).then((results) => {
        const userDetailsPromise = results[0]

        /* Check if user details were fetched successfully */
        if (userDetailsPromise.status === 'fulfilled') {
          setUserDetails(userDetailsPromise.value.data as UserDetails)
        }

        setIsLoadingData(false)
      })
    } else if (!user && isLoadingUser && isLoadingData) {
      /* Handle the case when the user is not authenticated but is in the process of loading */
      setUserDetails(null)
      setSubscription(null)
    }
  }, [user, isLoadingUser])

  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription,
  }

  return <UserContext.Provider value={value} {...props} />
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a MyUserContextProvider')
  }

  return context
}

export const useUserDetails = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(
      'useUserDetails must be used within a MyUserContextProvider',
    )
  }

  const { userDetails } = context
  return userDetails
}
