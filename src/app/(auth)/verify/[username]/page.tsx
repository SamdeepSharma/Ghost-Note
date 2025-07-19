/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import NotFound from '@/components/NotFound'
import { useToast } from '@/components/ui/use-toast'
import Verified from '@/components/Verified'
import NotVerified from '@/components/NotVerified'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import { LoaderPinwheel, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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

                    if (response.data.message === 'User already verified') {
                         toast({
                              title: "Ghost User is already Verified"
                         })
                         setUserStatus('verified')
                    } else if (response.data.message === 'User not verified') {
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
          return (
               <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center p-6">
                    <div className="w-full max-w-md">
                         <Card className="border-stone-200 bg-white/70 backdrop-blur-sm shadow-lg">
                              <CardContent className="p-8 text-center space-y-6">
                                   <div className="space-y-4">
                                        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                                             <AlertTriangle className="h-12 w-12 text-red-600" />
                                        </div>
                                        <div className="space-y-2">
                                             <h1 className="text-2xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                                  Verification Error
                                             </h1>
                                             <p className="text-stone-600">
                                                  An unexpected error occurred while checking your verification status.
                                             </p>
                                        </div>
                                   </div>
                                   
                                   <div className="space-y-3">
                                        <Button 
                                             onClick={() => window.location.reload()}
                                             className="w-full bg-gradient-to-r from-stone-700 to-stone-800 text-white shadow-sm hover:from-stone-800 hover:to-stone-900 transition-all"
                                        >
                                             <RefreshCw className="h-4 w-4 mr-2" />
                                             Try Again
                                        </Button>
                                        <Link href="/sign-in">
                                             <Button variant="outline" className="w-full border-stone-300 text-stone-700 hover:bg-stone-50">
                                                  <ArrowLeft className="h-4 w-4 mr-2" />
                                                  Back to Sign In
                                             </Button>
                                        </Link>
                                   </div>
                              </CardContent>
                         </Card>
                    </div>
               </div>
          )
     } else {
          return (
               <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center p-6">
                    <div className="w-full max-w-md">
                         <Card className="border-stone-200 bg-white/70 backdrop-blur-sm shadow-lg">
                              <CardContent className="p-8 text-center space-y-6">
                                   <div className="space-y-4">
                                        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-stone-100 to-stone-200 rounded-full flex items-center justify-center">
                                             <LoaderPinwheel className="h-12 w-12 text-stone-600 animate-spin" />
                                        </div>
                                        <div className="space-y-2">
                                             <h1 className="text-2xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                                  Checking Verification
                                             </h1>
                                             <p className="text-stone-600">
                                                  Verifying @{params.username}&apos;s account status...
                                             </p>
                                        </div>
                                   </div>
                              </CardContent>
                         </Card>
                    </div>
               </div>
          )
     }
}

export default Verify
