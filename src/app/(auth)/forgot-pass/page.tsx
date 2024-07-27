/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { forgotPasswordSchema } from "@/schemas/forgotPasswordSchema"
import { useState } from "react"
import { ApiResponse } from "@/types/ApiResponse"
import axios, { AxiosError } from "axios"

const page = () => {
     const { toast } = useToast()
     const [render, setRender] = useState(false)

     //zod implementation
     const form = useForm<z.infer<typeof forgotPasswordSchema>>({
          resolver: zodResolver(forgotPasswordSchema),
          defaultValues: {
               email: '',
          }
     })

     const { formState } = form;

     const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
          try {
               const response = await axios.post<ApiResponse>("/api/forgot-password", data)
               console.log(response)
               if (!response) {
                    toast({
                         title: 'Reset password failed',
                         description: 'Please try again.',
                         variant: 'destructive'
                    })
               }
               toast({
                    title: 'Reset password successful',
                    description: 'Please check your mail.'
               })
               setRender(true)
          } catch (error) {
               const axiosError = error as AxiosError<ApiResponse>
               console.log(axiosError)
               if (axiosError.response?.status == 404) {
                    toast({
                         title: "User not found!",
                         variant: "destructive"
                    })
               }
               toast({
                    title: 'Error',
                    description: axiosError.response?.data.message,
                    variant: 'destructive'
               })

          }
     }

     return (
          <div className="flex justify-center items-center h-screen overflow-auto bg-gray-100 bg-opacity-50">
               <div className="flex justify-center items-center h-screen overflow-auto bg-gray-100 bg-opacity-50">
                    <div className="w-full max-w-lg p-8 space-y-8 bg-white bg-opacity-50 rounded-lg shadow-md">
                         <div className="text-center">
                              <Link href={"/"}><h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Ghost Note</h1></Link>
                              <p className="mb-4">Please enter your email address to reset password.</p>
                         </div>
                         <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                   <FormField
                                        name="email"
                                        control={form.control}
                                        render={({ field }) => (
                                             <FormItem>
                                                  <FormLabel>Email</FormLabel>
                                                  <FormControl>
                                                       <Input type="email" placeholder="email" {...field} />
                                                  </FormControl>
                                                  <FormMessage />
                                             </FormItem>
                                        )}
                                   />
                                   <Button type="submit" disabled={render}>
                                        {
                                             render ? ('Sent') : formState.isSubmitting ?
                                                  <>
                                                       <Loader2 className="h-4 w-4 animate-spin" />
                                                  </>
                                                  : ('Reset password')
                                        }
                                   </Button>
                                   {render &&
                                        <>
                                             <FormItem>
                                                  <FormLabel>Password reset successful. Please check your mail for new password.</FormLabel>
                                             </FormItem>
                                             <Link href={"/sign-in"}>
                                                  <Button type="button" className="mt-4">Sign In</Button>
                                             </Link>
                                        </>
                                   }
                              </form>
                         </Form>
                    </div>
               </div>
          </div>
     );
}

export default page