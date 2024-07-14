/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Not from '@/components/Not'
import User from '@/components/User'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import NotFound from '@/components/NotFound'
import { useToast } from '@/components/ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import { LoaderPinwheel } from 'lucide-react'

const UserPage = () => {
     const params = useParams<{ username: string }>()
     const router = useRouter()
     const { toast } = useToast()
     const [userStatus, setUserStatus] = useState<'accepting' | 'notAccepting' | 'notFound' | 'error' | null>(null)

     useEffect(() => {
          const check = async () => {
               try {
                    const response = await axios.get<ApiResponse>(`/api/send-message?username=${params.username}`)
                    console.log(response)
                    if (!response) {
                         toast({
                              title: 'Error',
                              description: 'Error checking user status',
                              variant: "destructive"
                         })
                         setUserStatus('error')
                    }

                    if (response.data.message === 'User is accepting messages') {
                         toast({
                              title: "User is accepting messages"
                         })
                         setUserStatus('accepting')
                    } else if (response.data.message === 'User is not accepting messages') {
                         toast({
                              title: "User is not accepting messages"
                         })
                         setUserStatus('notAccepting')
                    } else {
                         toast({
                              title: "User not found!",
                              variant: "destructive"
                         })
                         setUserStatus('notFound')
                    }

               } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    console.log(axiosError)
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

     if (userStatus === 'accepting') {
          return <User />
     } else if (userStatus === 'notAccepting') {
          return <Not />
     } else if (userStatus === 'notFound') {
          return <NotFound />
     } else if (userStatus === 'error') {
          return <div>Error checking user status</div>
     } else {
          return <div className='bg-stone-200 h-screen w-full flex flex-col justify-center items-center'>
               <h1 className='mb-6 text-5xl font-bold animate-ping'>Ghost Note</h1>
               <LoaderPinwheel className='h-12 w-12 animate-spin' />
          </div>
     }
}

export default UserPage
