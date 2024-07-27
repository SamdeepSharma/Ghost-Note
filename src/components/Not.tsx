import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Not = () => {

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-auto bg-stone-200 bg-opacity-50">
      <div className="max-w-2xl text-center">
        <span role="img" aria-label="coffin" className="text-8xl">💀</span>
        <h1 className="text-5xl font-bold mt-4">Not accepting messages.</h1>
        <p className="text-2xl mt-4 mb-6 font-normal">Sorry, it looks like this ghost user is not currently accepting messages.</p>
        <Link href={"/"}>
              <Button className='md:w-auto p-4'>Home</Button>
        </Link>
      </div>
    </div>
  )
}

export default Not
