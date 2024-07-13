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
import { useRouter } from 'next/router'

const Dashboard = () => {
     const [messages, setMessages] = useState<Message[]>([])
     const [isLoading, setIsLoading] = useState(false)
     const [isSwitchLoading, setIsSwitchLoading] = useState(false)
     const { toast } = useToast()
     const router = useRouter()

     const handleDeleteMessages = (messageId: string) => {
          messages.filter((message) => message._id !== messageId)
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
               const response = await axios.get<ApiResponse>('/api/get-messages')
               setMessages(response.data.messages || [])
               if(refresh){
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

     useEffect(()=>{
          if(!session || !session.user) return;
          fetchMessages()
          fetchAcceptMessage()
     }, [session, setValue, fetchMessages, fetchAcceptMessage])

     // handle switch change
     const handleSwitchChange = async () =>{
          try {
               const response = await axios.post<ApiResponse>('/api/accept-messages',{
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

     if(!session || !session.user){
          signOut()
          router.replace('/sign-in')
     }

     return (
          <div className='flex justify-center items-center flex-wrap bg-slate-400'>

          </div>
     )
}

export default Dashboard