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
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { LoaderPinwheel, RefreshCcw } from 'lucide-react'
import MessageCard from '@/components/MessageCard'

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
          return <div className='bg-stone-200 bg-opacity-50 h-[89vh] w-full flex flex-col justify-center items-center'>
               <h1 className='mb-6 text-5xl font-bold'>Ghost Note</h1>
               <p className='text-xl text-center mb-6'>Please sign in again if the process is taking longer than expected.</p>
               <LoaderPinwheel className='h-12 w-12 animate-spin' />
          </div>
     }

     const { username } = session?.user as User
     // if(window)
     // {const baseUrl = `${window.location.protocol}//${window.location.hostname}`
     // const profileUrl = `${baseUrl}/u/${username}`}
     const baseUrl = `${process.env.NEXT_PUBLIC_SITE_BASE_URL}`
     const profileUrl = `${baseUrl}/u/${username}`
     const copyToClipboard = () => {
          navigator.clipboard.writeText(profileUrl)
          toast({
               title: 'Copied to clipboard'
          })
     }

     return (
          <div className='py-12 md:px-8 lg:px-40 px-4 bg-stone-200 bg-opacity-50 rounded w-full h-screen overflow-auto'>
               <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
               <div className='mb-4'>
                    <h2 className="text-lg font-semibold mb-2">Copy your unique link</h2>
                    <div className="flex items-center">
                         <input type="text" value={profileUrl} disabled className="input input-bordered w-full p-2 mr-2" />
                         <Button onClick={copyToClipboard}>Copy</Button>
                    </div>
                    <div className='flex items-center mt-4'>
                         <Switch
                              {...register('acceptMessages')}
                              checked={acceptMessages}
                              onCheckedChange={handleSwitchChange}
                              disabled={isSwitchLoading}
                         />
                         <span className="ml-2">
                              Accept Messages: {acceptMessages ? 'On' : 'Off'}
                         </span>
                    </div>
               </div>
               <Separator />
               <Button
                    className="mt-4"
                    variant="outline"
                    onClick={(e) => {
                         e.preventDefault();
                         fetchMessages(true);
                    }}
               >
                         <RefreshCcw className={`h-4 w-4 ${isLoading? 'animate-spin': ''}`} />
               </Button>
               <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {messages.length > 0 ? (
                         messages.map((message: Message) => (
                              <MessageCard
                                   key={Number(message._id)}
                                   message={message}
                                   onMessageDelete={handleDeleteMessage}
                              />
                         ))
                    ) : (
                         <p>No messages to display.</p>
                    )}
               </div>
          </div>
     )
}

export default Dashboard