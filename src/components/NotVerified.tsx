'use client'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Mail } from 'lucide-react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

const VerifyAccount = () => {
     const router = useRouter()
     const params = useParams<{ username: string }>()
     const { toast } = useToast()
     const [time, setTime] = useState(59)
     const [disable, setDisable] = useState(true)
     const [loading, setLoading] = useState(false)

     useEffect(() => {
          // Function to update the countdown every second
          const intervalId = setInterval(() => {
               setTime((prevTime) => {
                    if (prevTime <= 1) {
                         setDisable(false)
                         clearInterval(intervalId);
                         return 0;
                    }
                    return prevTime - 1;
               });
          }, 1000);
          return () => clearInterval(intervalId);
     }, [])

     const minutes = Math.floor(time / 60);
     const seconds = time % 60;

     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
     const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

     //zod implementation
     const form = useForm<z.infer<typeof verifySchema>>({
          resolver: zodResolver(verifySchema)
     })

     const { formState } = form;

     const onSubmit = async (data: z.infer<typeof verifySchema>) => {
          try {
               const response = await axios.post('/api/verify-code', {
                    username: params.username,
                    code: data.code
               })

               toast({
                    title: 'Success',
                    description: response.data.message
               })
               router.replace('/sign-in')
          } catch (error) {
               const axiosError = error as AxiosError<ApiResponse>
               toast({
                    title: 'Verification failed',
                    description: axiosError.response?.data.message,
                    variant: 'destructive'
               })
          }
     }

     const handleClick = async () => {
          setLoading(true)
          setDisable(true)
          try {
               const res = await axios.post<ApiResponse>("/api/resend-code", {
                    username: params.username
               })
               if(!res){
                    toast({
                         title: 'Failed to resend verification code',
                         variant: 'destructive'
                    })
               }
               toast({
                    title: 'Verification code resent successfully',
                    description: 'Please check your mail'
               })
          } catch (error) {
               const axiosError = error as AxiosError<ApiResponse>
               toast({
                    title: 'Failed to resend verification code',
                    description: axiosError.response?.data.message,
                    variant: 'destructive'
               })
          } finally {
               setLoading(false)
          }
     }

     return (
          <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center p-6">
               <div className="w-full max-w-md">
                    <Card className="border-stone-200 bg-white/70 backdrop-blur-sm shadow-lg">
                         <CardContent className="p-8 space-y-6">
                              <div className="text-center space-y-4">
                                   <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                        <Mail className="h-12 w-12 text-blue-600" />
                                   </div>
                                   <div className="space-y-2">
                                        <h1 className="text-2xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                             Verify Your Account
                                        </h1>
                                        <p className="text-stone-600">Please check your email for the verification code.</p>
                                   </div>
                              </div>
                    <Form {...form}>
                         <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
                              <FormField
                                   name="code"
                                   control={form.control}
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel>Verification Code</FormLabel>
                                             <FormControl>
                                                  <InputOTP maxLength={6} {...field}>
                                                       <InputOTPGroup>
                                                            <InputOTPSlot index={0} />
                                                            <InputOTPSlot index={1} />
                                                            <InputOTPSlot index={2} />
                                                            <InputOTPSlot index={3} />
                                                            <InputOTPSlot index={4} />
                                                            <InputOTPSlot index={5} />
                                                       </InputOTPGroup>
                                                  </InputOTP>
                                             </FormControl>
                                             <FormDescription>
                                                  Please enter the one-time password sent to your email.
                                             </FormDescription>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />
                              <Button 
                                   type="submit" 
                                   disabled={formState.isSubmitting}
                                   className="w-full bg-gradient-to-r from-stone-700 to-stone-800 text-white shadow-sm hover:from-stone-800 hover:to-stone-900 transition-all"
                              >
                                   {
                                        formState.isSubmitting ?
                                             <>
                                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                  Verifying...
                                             </>
                                             : 'Verify Account'
                                   }
                              </Button>

                              <div className="space-y-4 pt-4 border-t border-stone-200">
                                   <div className="text-center">
                                        <p className="text-sm text-stone-600">
                                             Didn&apos;t receive the code? Please wait{' '}
                                             <span className="font-mono font-medium text-stone-800">
                                                  {`${formattedMinutes}:${formattedSeconds}`}
                                             </span>
                                        </p>
                                   </div>

                                   <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={handleClick} 
                                        disabled={disable}
                                        className="w-full border-stone-300 text-stone-700 hover:bg-stone-50"
                                   >
                                        {loading ? (
                                             <>
                                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                  Sending...
                                             </>
                                        ) : (
                                             'Resend Code'
                                        )}
                                   </Button>
                              </div>
                         </form>
                    </Form>
                         </CardContent>
                    </Card>
               </div>
          </div>
     )
}

export default VerifyAccount