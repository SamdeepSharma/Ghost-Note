/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"

const page = () => {
     const { data: session } = useSession()
     if (session) {
       return (
         <>
           Signed in as {session.user.email} <br />
           <button className='bg-orange-500 m-3 px-3 py-1 rounded' onClick={() => signOut()}>Sign out</button>
         </>
       )
     }
     return (
       <>
         Not signed in <br />
         <button className='bg-orange-500 m-3 px-3 py-1 rounded' onClick={() => signIn()}>Sign in</button>
       </>
     )
   
}

export default page
