/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { Message } from '@/models/User'
import { zodResolver } from '@hookform/resolvers/zod'
import { signOut, useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { useToast } from '@/components/ui/use-toast'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'

import { Switch } from '@/components/ui/switch'
import { LoaderPinwheel, RefreshCcw, BarChart3, Copy, Link as LinkIcon, MessageSquare, Settings, Bell, BellOff } from 'lucide-react'
import Link from 'next/link'
import MessageCard from '@/components/MessageCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const Dashboard = () => {
     const [messages, setMessages] = useState<Message[]>([])
     const [isLoading, setIsLoading] = useState(false)
     const [isSwitchLoading, setIsSwitchLoading] = useState(false)
     const { toast } = useToast()

     const handleDeleteMessage = (messageId: string) => {
          messages.filter((message) => message._id !== messageId)
          fetchMessages(true);
     }

     const { data: session } = useSession()
     const form = useForm({
          resolver: zodResolver(AcceptMessageSchema)
     })

     const { register, setValue, watch } = form
     const acceptMessages = watch('acceptMessages')
     const fetchAcceptMessage = useCallback(async () => {
          setIsSwitchLoading(true)
          try {
               const response = await axios.get<ApiResponse>('/api/accept-messages')
               setValue('acceptMessages', response.data.isAcceptingMessages)
          } catch (error) {
               const axiosError = error as AxiosError<ApiResponse>
               toast({
                    title: 'Error',
                    description: axiosError.response?.data.message || 'Failed to fetch message settings',
                    variant: 'destructive'
               })
          } finally {
               setIsSwitchLoading(false)
          }
     }, [setValue])

     const fetchMessages = useCallback(async (refresh: boolean = false) => {
          setIsLoading(false)
          setIsSwitchLoading(false)
          try {
               const response = await axios.get('/api/get-messages')
               setMessages(response.data.message || [])
               if (refresh) {
                    toast({
                         title: 'Refreshed',
                         description: 'Showing latest messages'
                    })
               }
          } catch (error) {
               const axiosError = error as AxiosError<ApiResponse>
               toast({
                    title: 'Unable to refresh',
                    description: axiosError.response?.data.message,
                    variant: 'destructive'
               })
          } finally {
               setIsLoading(false)
               setIsSwitchLoading(false)
          }
     }, [setIsLoading, setMessages])

     useEffect(() => {
          fetchMessages()
          fetchAcceptMessage()
     }, [session, setValue, fetchMessages, fetchAcceptMessage])

     // handle switch change
     const handleSwitchChange = async () => {
          try {
               const response = await axios.post<ApiResponse>('/api/accept-messages', {
                    acceptMessages: !acceptMessages
               })
               setValue('acceptMessages', !acceptMessages)
               toast({
                    title: response.data.message
               }) 
          } catch (error) {
               const axiosError = error as AxiosError<ApiResponse>
               toast({
                    title: 'Error',
                    description: axiosError.response?.data.message,
                    variant: 'destructive'
               })
          }
     }

     if (!session || !session.user) {
          return (
               <div className='min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex flex-col justify-center items-center p-8'>
                    <div className='text-center space-y-6'>
                         <div className='relative'>
                              <h1 className='text-6xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent'>
                                   Ghost Note
                              </h1>
                              <div className='absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse'></div>
                         </div>
                         <p className='text-xl text-stone-600 max-w-md'>
                              Please sign in again if the process is taking longer than expected.
                         </p>
                         <div className='flex justify-center'>
                              <LoaderPinwheel className='h-12 w-12 animate-spin text-stone-600' />
                         </div>
                    </div>
               </div>
          )
     }

     const { username } = session?.user as User
     const baseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}` : 'http://localhost:3000')
     const profileUrl = `${baseUrl}/u/${username}`
     const copyToClipboard = () => {
          navigator.clipboard.writeText(profileUrl)
          toast({
               title: 'Copied to clipboard'
          })
     }

     return (
          <div className='min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 p-6'>
               <div className='max-w-7xl mx-auto space-y-8'>
                    {/* Header */}
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                         <div>
                              <h1 className='text-4xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent'>
                                   Dashboard
                              </h1>
                              <p className='text-stone-600 mt-1'>Welcome back, @{username}</p>
                         </div>
                         <div className='flex items-center gap-3'>
                              <Badge variant="secondary" className='flex items-center gap-1'>
                                   <MessageSquare className='h-3 w-3' />
                                   {messages.length} messages
                              </Badge>
                              <Link href="/analytics">
                                   <Button variant="outline" size="sm">
                                        <BarChart3 className='h-4 w-4 mr-2' />
                                        Analytics
                                   </Button>
                              </Link>
                         </div>
                    </div>

                    {/* Stats Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                         <Card className='bg-white/70 backdrop-blur-sm border-stone-200'>
                              <CardHeader className='pb-3'>
                                   <CardTitle className='text-sm font-medium text-stone-600 flex items-center gap-2'>
                                        <LinkIcon className='h-4 w-4' />
                                        Profile Link
                                   </CardTitle>
                              </CardHeader>
                              <CardContent>
                                   <div className='flex items-center gap-2'>
                                        <input 
                                             type="text" 
                                             value={profileUrl} 
                                             disabled 
                                             className="flex-1 px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-md text-stone-600" 
                                        />
                                        <Button 
                                             size="sm" 
                                             onClick={copyToClipboard}
                                             className='shrink-0'
                                        >
                                             <Copy className='h-4 w-4' />
                                        </Button>
                                   </div>
                              </CardContent>
                         </Card>

                         <Card className='bg-white/70 backdrop-blur-sm border-stone-200'>
                              <CardHeader className='pb-3'>
                                   <CardTitle className='text-sm font-medium text-stone-600 flex items-center gap-2'>
                                        <Settings className='h-4 w-4' />
                                        Message Settings
                                   </CardTitle>
                              </CardHeader>
                              <CardContent>
                                   <div className='flex items-center justify-between'>
                                        <span className='text-sm text-stone-600'>Accept Messages</span>
                                        <div className='flex items-center gap-2'>
                                             {acceptMessages ? (
                                                  <Bell className='h-4 w-4 text-green-600' />
                                             ) : (
                                                  <BellOff className='h-4 w-4 text-red-600' />
                                             )}
                                             <Switch
                                                  {...register('acceptMessages')}
                                                  checked={acceptMessages}
                                                  onCheckedChange={handleSwitchChange}
                                                  disabled={isSwitchLoading}
                                             />
                                        </div>
                                   </div>
                              </CardContent>
                         </Card>

                         <Card className='bg-white/70 backdrop-blur-sm border-stone-200'>
                              <CardHeader className='pb-3'>
                                   <CardTitle className='text-sm font-medium text-stone-600 flex items-center gap-2'>
                                        <RefreshCcw className='h-4 w-4' />
                                        Actions
                                   </CardTitle>
                              </CardHeader>
                              <CardContent>
                                   <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                             e.preventDefault();
                                             fetchMessages(true);
                                        }}
                                        className='w-full'
                                        disabled={isLoading}
                                   >
                                        <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                        Refresh Messages
                                   </Button>
                              </CardContent>
                         </Card>
                    </div>

                    {/* Messages Section */}
                    <div className='space-y-4'>
                         <div className='flex items-center justify-between'>
                              <h2 className='text-2xl font-semibold text-stone-800'>Messages</h2>
                              <Badge variant="outline" className='text-stone-600'>
                                   {messages.length} total
                              </Badge>
                         </div>
                         
                         {messages.length > 0 ? (
                              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                                   {messages.map((message: Message) => (
                                        <MessageCard
                                             key={Number(message._id)}
                                             message={message}
                                             onMessageDelete={handleDeleteMessage}
                                        />
                                   ))}
                              </div>
                         ) : (
                              <Card className='bg-white/70 backdrop-blur-sm border-stone-200'>
                                   <CardContent className='py-12 text-center'>
                                        <MessageSquare className='h-12 w-12 text-stone-400 mx-auto mb-4' />
                                        <h3 className='text-lg font-medium text-stone-600 mb-2'>No messages yet</h3>
                                        <p className='text-stone-500 text-sm'>
                                             Share your profile link to start receiving anonymous messages
                                        </p>
                                   </CardContent>
                              </Card>
                         )}
                    </div>
               </div>
          </div>
     )
}

export default Dashboard