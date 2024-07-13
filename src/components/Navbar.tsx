'use client'
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User
  const router = useRouter()

  return (
    <div className='flex flex-col md:flex-row justify-between items-center shadow-md py-4 px-8 md:py-6 md:px-24'>
      <Link className='text-xl font-bold mb-4 md:mb-0' href={"/"}>Ghost Note</Link>
      {
        session ?
          <>
            <span className=''>Welcome {user?.username || user?.email}</span>
            <Button className='w-full md:w-auto' onClick={() => {
              signOut()
              router.replace('/sign-in')
            }}>Sign out</Button>
          </>
          :
          <>
            <Link href={"/sign-in"}>
              <Button className='w-full md:w-auto'>Sign in</Button>
            </Link></>
      }
    </div>
  )
}

export default Navbar
