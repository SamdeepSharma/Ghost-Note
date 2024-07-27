import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { VerifiedIcon } from 'lucide-react'

const Verified = () => {

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-auto bg-stone-200 bg-opacity-50">
        <VerifiedIcon className='h-28 w-28'/>
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mt-4">User Verified</h1>
        <p className="text-2xl mt-4 mb-6 font-normal">Your account has already been verified.</p>
        <Link href={"/dashboard"}>
              <Button className='md:w-auto p-4'>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

export default Verified
