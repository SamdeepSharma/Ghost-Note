'use client'
import React from 'react'
import {
     Card,
     CardContent,
     CardDescription,
     CardFooter,
     CardHeader,
     CardTitle,
} from "@/components/ui/card"
import dayjs from 'dayjs';
import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogCancel,
     AlertDialogContent,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
     AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { Message } from '@/models/User'
import { useToast } from './ui/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

type MessageCardProps = {
     message: Message;
     onMessageDelete: (messageId: any) => void;
}

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    } 
  };
     return (
          <Card className='h-full flex flex-col'>
               <div className='flex flex-col justify-between h-full'>
                    <div className='flex-1'>
                         <CardHeader className='pb-1'>
                              <CardTitle className='text-lg leading-tight'>{message.content}</CardTitle>
                         </CardHeader>
                         <CardContent className='pb-1'>
                              <CardDescription className='text-sm'>Sent on {dayjs(message.createdAt).format('MMM D, YYYY')}</CardDescription>
                         </CardContent>
                    </div>
                    <div className='mt-auto p-3 px-6'>
                         <AlertDialog>
                              <AlertDialogTrigger asChild>
                                   <Button variant="destructive" size="sm" className='text-xs'>Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className='max-w-sm'>
                                   <AlertDialogHeader>
                                        <AlertDialogTitle className='text-base'>Delete Message?</AlertDialogTitle>
                                        <AlertDialogDescription className='text-sm'>
                                             This action cannot be undone. This will permanently delete this
                                             message from your inbox.
                                        </AlertDialogDescription>
                                   </AlertDialogHeader>
                                   <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                                   </AlertDialogFooter>
                              </AlertDialogContent>
                         </AlertDialog>
                    </div>
               </div>
          </Card>
     )
}

export default MessageCard
