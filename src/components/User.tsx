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
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { Separator } from '@radix-ui/react-separator'
import { useCompletion } from 'ai/react';

const User = () => {
  const [response, setResponse] = useState<string[]>([])
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const { toast } = useToast()
  const params = useParams<{ username: string }>()

  const initialMessageString =
    `What song always gets stuck in your head ? || If your life had a theme song, what would it be ? || What's the most unexpected place you've met someone interesting ?`

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
      console.log(result.data.suggestions)
      const suggestions = result.data.suggestions.split('||')
      setResponse(suggestions)
      toast({
        title: 'Showing new suggestions',
        description: 'Suggestions updated successfully.',
      })
    } catch (error) {
      const suggestions = initialMessageString.split('||')
      setResponse(suggestions)
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError)
      toast({
        title: 'Fetched default suggested messages'
      })
    }
  }, [setResponse])

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
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{params.username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {form.formState.isSubmitting ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending
              </Button>
            ) : (
              <Button type="submit" disabled={form.formState.isSubmitting || !messageContent}>
                Send
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            className="my-4"
            disabled={isLoading}
          >
            {
              isLoading ?
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Suggesting...</>
                :
                <><span>Suggest Messages</span></>
            }
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {!response ? (
              <p >No suggestions available, please refresh.</p>
            ) : response.map((message, index) => (
              <Button
                key={index}
                variant="outline"
                className="mb-2"
                onClick={() => handleMessageClick(message)}
              >
                {message}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Personalised Ghost Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  )
}

export default User