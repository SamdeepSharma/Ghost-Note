/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import NotFound from '@/components/NotFound'
import { useToast } from '@/components/ui/use-toast'
import Verified from '@/components/Verified'
import NotVerified from '@/components/NotVerified'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { LoaderPinwheel } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Verify = () => {
     const params = useParams<{ username: string }>()
     const {toast} = useToast()
     const [userStatus, setUserStatus] = useState<'verified' | 'notVerified' | 'notFound' | 'error' | null>(null)
   useEffect(() => {
          const check = async () => {
               try {
                    const response = await axios.get<ApiResponse>(`/api/verify?username=${params.username}`)
                    if (!response) {
                         toast({
                              title: 'Error',
                              description: 'Error checking verification status',
                              variant: "destructive"
                         })
                         setUserStatus('error')
                    }

                    if (response.data.message === 'User already Verified') {
                         toast({
                              title: "Ghost User is already Verified"
                         })
                         setUserStatus('verified')
                    } else if (response.data.message === 'User not Verified') {
                         toast({
                              title: "Please verify your account",
                              description: "Please check your mail"
                         })
                         setUserStatus('notVerified')
                    } else {
                         toast({
                              title: "User not found!",
                              variant: "destructive"
                         })
                         setUserStatus('notFound')
                    }

               } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    if (axiosError.response?.status == 404) {
                         toast({
                              title: "User not found!",
                              variant: "destructive"
                         })
                         setUserStatus('notFound')
                    } else {
                         toast({
                              title: 'Error',
                              variant: "destructive"
                         })
                         setUserStatus('error')
                    }
               }
          }
          check()
     }, [params.username])

     if (userStatus === 'verified') {
          return <Verified />
     } else if (userStatus === 'notVerified') {
          return <NotVerified />
     } else if (userStatus === 'notFound') {
          return <NotFound />
     } else if (userStatus === 'error') {
          return <div className='bg-stone-200 h-screen w-full flex flex-col justify-center items-center'>
          <h1 className='mb-6 text-5xl font-bold'>Ghost Note</h1>
          <p className='text-2xl'>Some unexpected error occurred. Please reload this page.</p>
     </div>
     } else {
          return <div className='bg-stone-200 h-screen w-full flex flex-col justify-center items-center'>
               <h1 className='mb-6 text-5xl font-bold'>Ghost Note</h1>
               <LoaderPinwheel className='h-12 w-12 animate-spin' />
          </div>
     }
}

export default Verify
