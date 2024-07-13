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
          <Card>
               <div className='flex-col justify-center items-center"'>
                    <CardHeader>
                         <CardTitle>{message.content}</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <CardDescription>Sent on {dayjs(message.createdAt).format('MMM D, YYYY')}</CardDescription>
                    </CardContent>
                    <CardFooter>
                         <AlertDialog>
                              <AlertDialogTrigger asChild>
                                   <Button variant="destructive">Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                   <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                             This action cannot be undone. This will permanently delete your
                                             account and remove your data from our servers.
                                        </AlertDialogDescription>
                                   </AlertDialogHeader>
                                   <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                                   </AlertDialogFooter>
                              </AlertDialogContent>
                         </AlertDialog>
                    </CardFooter>
               </div>
               {/* <div className="text-sm">
                    Sent on {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
               </div> */}
          </Card>
     )
}

export default MessageCard
