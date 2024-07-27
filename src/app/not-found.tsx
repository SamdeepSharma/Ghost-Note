import React from 'react'
import Link from 'next/link'
import { Button } from '../components/ui/button'
import {Globe2} from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-auto bg-stone-200">
      <Globe2 className='text-gray-800 h-28 w-28' />
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl font-bold mt-4">Oops! Looks like you&apos;re lost in cyberspace.</h1>
        <h2 className="text-3xl mt-4">404</h2>
        <p className="text-xl mt-4 mb-6 font-normal">The page you&apos;re searching for seems to have vanished into the digital abyss.</p>
        <p>Don&apos;t panic! You can always return to safety.</p>
        <Link href={"/"}>
          <Button className='md:w-auto p-4 mt-4'>Go to Home</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
