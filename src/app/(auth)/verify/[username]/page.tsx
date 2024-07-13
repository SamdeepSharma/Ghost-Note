'use client'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

const VerifyAccount = () => {
     const router = useRouter()
     const params = useParams<{ username: string }>()
     const { toast } = useToast()

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
               console.log('Error verifying user', error)
               const axiosError = error as AxiosError<ApiResponse>
               toast({
                    title: 'OTP Verification failed',
                    description: axiosError.response?.data.message,
                    variant: 'destructive'
               })
          }
     }

     return (
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
               <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                         <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify Your Account</h1>
                         <p className="mb-4">Please check your email.</p>
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
                              <Button type="submit" disabled={formState.isSubmitting}>
                                   {
                                        formState.isSubmitting ?
                                             <>
                                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />verifying
                                             </>
                                             : ('Verify')
                                   }
                              </Button>
                         </form>
                    </Form>
               </div>
          </div>
     )
}

export default VerifyAccount
