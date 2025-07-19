/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import axios, { AxiosError } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from './ui/use-toast'
import { useParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod';
import { messageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { useCompletion } from 'ai/react';

const User = () => {
  const [response, setResponse] = useState<string[]>([])
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const { toast } = useToast()
  const params = useParams<{ username: string }>()

  const initialMessageString =
    `What song always gets stuck in your head? || If your life had a theme song, what would it be? || What's the most unexpected place you've met someone interesting? || What's a small thing that always makes you smile? || If you could instantly master any skill, what would it be? || What's your favorite way to spend a rainy day?`

  const {
    complete,
    isLoading,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });


  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    try {
      complete('');
      const result = await axios.post('/api/suggest-messages')
      
      const suggestions = result.data.suggestions.split('||')
      setResponse(suggestions)
      toast({
        title: '✨ Fresh AI Suggestions',
        description: 'New creative messages generated for you!',
      })
    } catch (error) {
      console.error("❌ Frontend: API call failed", error);
      const suggestions = initialMessageString.split('||')
      setResponse(suggestions)
      const axiosError = error as AxiosError<ApiResponse>;

      
      // Check if it's an API limit error or other error
      const isLimitError = axiosError.response?.status === 429 || 
                          axiosError.response?.data?.message?.includes('limit') ||
                          axiosError.response?.data?.message?.includes('quota');
      
      toast({
        title: isLimitError ? '🤖 Using Curated Suggestions' : '📝 Using Default Messages',
        description: isLimitError 
          ? 'AI limit reached. Here are some hand-picked messages for you!'
          : 'Using our curated collection of engaging questions.',
        variant: isLimitError ? 'default' : 'default'
      })
    }
  }, [setResponse, complete, toast, initialMessageString])

  useEffect(() => {
    fetchMessages(true)
  }, [fetchMessages])

  const messageContent = form.watch('content');
  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const result = await axios.post('/api/send-message', { username: params.username, ...data })
      if (!result) {
        toast({
          title: 'Message not sent!',
          description: 'Error sending message to this user',
          variant: 'destructive'
        })
      }
      toast({
        title: 'Message sent successfully',
        description: `Ghost message successfully sent to ${params.username}`
      })
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Message not sent!',
        description: axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-stone-100 to-stone-200 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-10 w-10 text-stone-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
            Ghost Profile
          </h1>
          <p className="text-stone-600 text-lg">Send an anonymous message to <span className="font-semibold text-stone-800">@{params.username}</span></p>
          <div className="flex items-center justify-center gap-2 text-sm text-stone-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Messages are completely anonymous</span>
          </div>
        </div>
              <Card className="border-stone-200 bg-white/70 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-stone-100 to-stone-200 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-stone-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-900">Send Anonymous Message</h3>
                <p className="text-sm text-stone-600">Your identity will remain completely hidden</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-stone-700 font-medium">Your Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your anonymous message here... Share your thoughts, ask a question, or send some encouragement!"
                          className="resize-none border-stone-300 focus:border-stone-500 focus:ring-stone-500 min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between items-center text-xs text-stone-500">
                        <span>Your message will be delivered instantly</span>
                        <span>{messageContent?.length || 0}/500</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
                <div className="flex justify-center">
                  {form.formState.isSubmitting ? (
                    <Button disabled className="bg-stone-400 px-8">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Message...
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={form.formState.isSubmitting || !messageContent}
                      className="bg-gradient-to-r from-stone-700 to-stone-800 text-white shadow-sm hover:from-stone-800 hover:to-stone-900 transition-all px-8"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Anonymous Message
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-stone-900">AI Message Suggestions</h3>
                <p className="text-sm text-stone-600">Get creative ideas for your message</p>
              </div>
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
              variant="outline"
              className="border-stone-300 text-stone-700 hover:bg-stone-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span>Get New Ideas</span>
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-stone-600">Click on any suggestion below to use it in your message.</p>
        </div>
        
        <Card className="border-stone-200 bg-white/70 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-stone-900">Creative Suggestions</h3>
              <div className="px-2 py-1 bg-stone-100 rounded-full">
                <span className="text-xs font-medium text-stone-600">{response?.length || 0} ideas</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {!response ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-stone-400 mx-auto mb-3" />
                <p className="text-stone-600">Loading suggestions...</p>
              </div>
            ) : response.map((message, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto p-4 border-stone-200 bg-white/50 hover:bg-stone-50 hover:border-stone-300 transition-all group"
                onClick={() => handleMessageClick(message)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-stone-100 to-stone-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-stone-600">{index + 1}</span>
                  </div>
                  <span className="text-sm leading-relaxed">{message}</span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card className="border-stone-200 bg-gradient-to-r from-stone-50 to-white shadow-sm">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-stone-100 to-stone-200 rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-stone-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-stone-900">Get Your Own Ghost Message Board</h3>
              <p className="text-stone-600">Create an account to receive anonymous messages from friends and others</p>
            </div>
          </div>
          <div className="space-y-3">
            <Link href={'/sign-up'}>
              <Button className="bg-gradient-to-r from-stone-700 to-stone-800 text-white shadow-sm hover:from-stone-800 hover:to-stone-900 transition-all px-8">
                <Sparkles className="mr-2 h-4 w-4" />
                Create Your Account
              </Button>
            </Link>
            <p className="text-xs text-stone-500">Join hundreds of users sharing anonymous thoughts</p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export default User