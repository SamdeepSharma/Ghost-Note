/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, Loader2, Sparkles, ArrowLeft, CheckCircle, XCircle } from "lucide-react"

const page = () => {
     const [username, setUsername] = useState('')
     const [usernameMessage, setUsernameMessage] = useState('')
     const [isCheckingUsername, setIsCheckingUsername] = useState(false)
     const [showPass, setShowPass] = useState(false)
     const debounced = useDebounceCallback(setUsername, 300)
     const { toast } = useToast()
     const router = useRouter()
     //zod implementation
     const form = useForm<z.infer<typeof signUpSchema>>({
          resolver: zodResolver(signUpSchema),
          defaultValues: {
               username: '',
               email: '',
               password: ''
          }
     })
     const { formState } = form;
     useEffect(() => {
          const checkUsernameUnique = async () => {
               if (username) {
                    setIsCheckingUsername(true)
                    setUsernameMessage('')
                    try {
                         const response = await axios.get(`/api/check-username-unique?username=${username}`)
                         setUsernameMessage(response.data.message)
                    } catch (error) {
                         const axiosError = error as AxiosError<ApiResponse>
                         setUsernameMessage(axiosError.response?.data.message || "Error checking username")
                    } finally {
                         setIsCheckingUsername(false)
                    }
               }
          }
          checkUsernameUnique()
     }, [username])
     const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
          try {
               const response = await axios.post<ApiResponse>('/api/sign-up', data)
               toast({
                    title: 'Success',
                    description: response.data.message
               })
               router.replace(`/verify/${username}`)
          } catch (error) {
               const axiosError = error as AxiosError<ApiResponse>
               let errorMessage = axiosError.response?.data.message
               toast({
                    title: 'Sign-up failed.',
                    description: errorMessage,
                    variant: 'destructive'
               })
          }
     }
     return (
          <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center p-4">
               <div className="w-full max-w-md">
                    <Card className="border-stone-200 bg-white/70 backdrop-blur-sm shadow-lg">
                         <CardHeader className="space-y-6 pb-6">
                              <div className="text-center">
                                   <Link 
                                        href={"/"} 
                                        className="inline-flex items-center gap-2 text-2xl font-bold text-stone-900 hover:text-stone-700 transition-colors"
                                   >
                                        <Sparkles className="h-6 w-6 text-stone-600" />
                                        Ghost Note
                                   </Link>
                                   <p className="mt-2 text-stone-600">Join the community and start receiving anonymous messages!</p>
                              </div>
                         </CardHeader>
                         
                         <CardContent className="space-y-6">
                              <Form {...form}>
                                   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                             name="username"
                                             control={form.control}
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel className="text-stone-700 font-medium">Username</FormLabel>
                                                       <FormControl>
                                                            <Input 
                                                                 placeholder="Choose a unique username" 
                                                                 className="border-stone-300 focus:border-stone-500 focus:ring-stone-500"
                                                                 {...field} 
                                                                 onChange={(e) => {
                                                                      field.onChange(e)
                                                                      debounced(e.target.value)
                                                                 }} 
                                                            />
                                                       </FormControl>
                                                       {isCheckingUsername && (
                                                            <div className="flex items-center gap-2 text-sm text-stone-600">
                                                                 <Loader2 className="h-4 w-4 animate-spin" />
                                                                 Checking username...
                                                            </div>
                                                       )}
                                                       {usernameMessage && !isCheckingUsername && (
                                                            <div className={`flex items-center gap-2 text-sm font-medium ${
                                                                 usernameMessage === 'Valid username' 
                                                                      ? 'text-green-600' 
                                                                      : 'text-red-600'
                                                            }`}>
                                                                 {usernameMessage === 'Valid username' ? (
                                                                      <CheckCircle className="h-4 w-4" />
                                                                 ) : (
                                                                      <XCircle className="h-4 w-4" />
                                                                 )}
                                                                 {usernameMessage}
                                                            </div>
                                                       )}
                                                  </FormItem>
                                             )}
                                        />
                                        <FormField
                                             name="email"
                                             control={form.control}
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel className="text-stone-700 font-medium">Email</FormLabel>
                                                       <FormControl>
                                                            <Input 
                                                                 type="email" 
                                                                 placeholder="Enter your email address" 
                                                                 className="border-stone-300 focus:border-stone-500 focus:ring-stone-500"
                                                                 {...field} 
                                                            />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                        <FormField
                                             name="password"
                                             control={form.control}
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel className="text-stone-700 font-medium">Password</FormLabel>
                                                       <div className="relative">
                                                            <FormControl>
                                                                 <Input 
                                                                      type={`${showPass ? "text" : "password"}`} 
                                                                      placeholder="Create a strong password" 
                                                                      className="border-stone-300 focus:border-stone-500 focus:ring-stone-500 pr-12"
                                                                      {...field} 
                                                                 />
                                                            </FormControl>
                                                            <Button 
                                                                 type="button" 
                                                                 variant="ghost"
                                                                 size="sm"
                                                                 className="absolute right-1 top-1 h-8 w-8 p-0 text-stone-500 hover:text-stone-700" 
                                                                 onClick={() => { setShowPass(!showPass) }}
                                                            >
                                                                 {showPass ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />}
                                                            </Button>
                                                       </div>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                        <Button 
                                             type="submit" 
                                             disabled={formState.isSubmitting}
                                             className="w-full bg-gradient-to-r from-stone-700 to-stone-800 text-white shadow-sm hover:from-stone-800 hover:to-stone-900 transition-all"
                                        >
                                             {formState.isSubmitting ? (
                                                  <>
                                                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                       Creating account...
                                                  </>
                                             ) : (
                                                  'Create account'
                                             )}
                                        </Button>
                                   </form>
                              </Form>
                              
                              <div className="pt-4 border-t border-stone-200">
                                   <div className="text-center">
                                        <p className="text-sm text-stone-600">
                                             Already have an account?{' '}
                                             <Link href={'/sign-in'} className="font-medium text-stone-700 hover:text-stone-900 transition-colors">
                                                  Sign in
                                             </Link>
                                        </p>
                                   </div>
                              </div>
                         </CardContent>
                    </Card>
                    
                    <div className="mt-6 text-center">
                         <Link 
                              href="/" 
                              className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-800 transition-colors"
                         >
                              <ArrowLeft className="h-4 w-4" />
                              Back to home
                         </Link>
                    </div>
               </div>
          </div>
     );
}
export default page