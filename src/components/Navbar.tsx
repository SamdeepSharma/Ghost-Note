'use client'
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useRouter } from 'next/navigation'
import { MessageSquare, LogOut, LogIn, Sparkles, User as UserIcon } from 'lucide-react'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user as User
  const router = useRouter()

  return (
    <nav className='sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-sm shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4'>
        <Link 
          className='flex items-center gap-2 text-xl font-bold text-stone-900 transition-colors hover:text-stone-700' 
          href={"/"}
        >
          <Sparkles className='h-6 w-6 text-stone-600' />
          Ghost Note
        </Link>
        
        {session ? (
          <div className='flex items-center gap-4'>
            <div className='hidden md:flex items-center gap-2'>
              <UserIcon className='h-4 w-4 text-stone-500' />
              <span className='text-sm text-stone-600'>
                Welcome, <span className='font-medium text-stone-900'>{user?.username || user?.email}</span>
              </span>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className='flex items-center gap-2 border-stone-300 text-stone-700 hover:bg-stone-50'>
                <MessageSquare className='h-4 w-4' />
                Dashboard
              </Button>
            </Link>
            <Button 
              size="sm" 
              variant="ghost"
              className='flex items-center gap-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100' 
              onClick={() => {
                signOut()
                router.replace('/sign-in')
              }}
            >
              <LogOut className='h-4 w-4' />
              <span className='hidden sm:inline'>Sign out</span>
            </Button>
          </div>
        ) : (
          <div className='flex items-center gap-3'>
            <Link href={"/sign-in"}>
              <Button 
                size="sm" 
                variant="outline"
                className='flex items-center gap-2 border-stone-300 text-stone-700 hover:bg-stone-50'
              >
                <LogIn className='h-4 w-4' />
                Sign in
              </Button>
            </Link>
            <Link href={"/sign-up"}>
              <Button 
                size="sm"
                className='flex items-center gap-2 bg-gradient-to-r from-stone-700 to-stone-800 text-white shadow-sm hover:from-stone-800 hover:to-stone-900'
              >
                <Sparkles className='h-4 w-4' />
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
