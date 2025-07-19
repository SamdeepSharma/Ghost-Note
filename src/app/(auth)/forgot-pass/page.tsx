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
import { forgotPasswordSchema, otpVerificationSchema, resetPasswordSchema } from "@/schemas/forgotPasswordSchema"
import { useState, useEffect } from "react"
import { ApiResponse } from "@/types/ApiResponse"
import axios, { AxiosError } from "axios"

type Step = 'email' | 'otp' | 'password' | 'success'

const ForgotPasswordPage = () => {
     const { toast } = useToast()
     const [currentStep, setCurrentStep] = useState<Step>('email')
     const [email, setEmail] = useState('')
     const [otp, setOtp] = useState('')

     // Email form
     const emailForm = useForm<z.infer<typeof forgotPasswordSchema>>({
          resolver: zodResolver(forgotPasswordSchema),
          defaultValues: {
               email: '',
          }
     })

     // OTP form
     const otpForm = useForm<z.infer<typeof otpVerificationSchema>>({
          resolver: zodResolver(otpVerificationSchema),
          defaultValues: {
               email: '',
               otp: '',
          }
     })

     // Password form
     const passwordForm = useForm<z.infer<typeof resetPasswordSchema>>({
          resolver: zodResolver(resetPasswordSchema),
          defaultValues: {
               email: '',
               otp: '',
               newPassword: '',
               confirmPassword: '',
          }
     })

     // Update form values when state changes
     useEffect(() => {
          if (email) {
               otpForm.setValue('email', email)
               passwordForm.setValue('email', email)
          }
     }, [email, otpForm, passwordForm])

     useEffect(() => {
          if (otp) {
               passwordForm.setValue('otp', otp)
          }
     }, [otp, passwordForm])

     const onEmailSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
          try {
               const response = await axios.post<ApiResponse>("/api/forgot-password", data)
               if (response.data.success) {
                    setEmail(data.email)
                    setCurrentStep('otp')
                    toast({
                         title: 'OTP Sent',
                         description: 'Please check your email for the OTP.',
                    })
               }
          } catch (error) {
               const axiosError = error as AxiosError<ApiResponse>
               if (axiosError.response?.status === 404) {
                    toast({
                         title: "User not found!",
                         description: "No account found with this email address.",
                         variant: "destructive"
                    })
               } else {
                    toast({
                         title: 'Error',
                         description: axiosError.response?.data.message || 'Failed to send OTP',
                         variant: 'destructive'
                    })
               }
          }
     }

     const onOtpSubmit = async (data: z.infer<typeof otpVerificationSchema>) => {
          try {
               const response = await axios.post<ApiResponse>("/api/verify-otp", {
                    email: email,
                    otp: data.otp
               })
               if (response.data.success) {
                    setOtp(data.otp)
                    setCurrentStep('password')
                    toast({
                         title: 'OTP Verified',
                         description: 'Please enter your new password.',
                    })
               }
          } catch (error) {
               const axiosError = error as AxiosError<ApiResponse>
               toast({
                    title: 'Error',
                    description: axiosError.response?.data.message || 'Failed to verify OTP',
                    variant: 'destructive'
               })
          }
     }

     const onPasswordSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
          try {
               const response = await axios.post<ApiResponse>("/api/reset-password", {
                    email: email,
                    otp: otp,
                    newPassword: data.newPassword
               })
               if (response.data.success) {
                    setCurrentStep('success')
                    toast({
                         title: 'Password Reset Successful',
                         description: 'Your password has been reset successfully.',
                    })
               }
          } catch (error) {
               const axiosError = error as AxiosError<ApiResponse>
               toast({
                    title: 'Error',
                    description: axiosError.response?.data.message || 'Failed to reset password',
                    variant: 'destructive'
               })
          }
     }

     const renderEmailStep = () => (
          <Form {...emailForm}>
               <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                    <FormField
                         name="email"
                         control={emailForm.control}
                         render={({ field }) => (
                              <FormItem>
                                   <FormLabel>Email</FormLabel>
                                   <FormControl>
                                        <Input type="email" placeholder="Enter your email" {...field} />
                                   </FormControl>
                                   <FormMessage />
                              </FormItem>
                         )}
                    />
                    <Button type="submit" disabled={emailForm.formState.isSubmitting} className="w-full">
                         {emailForm.formState.isSubmitting ? (
                              <>
                                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                   Sending OTP...
                              </>
                         ) : (
                              'Send OTP'
                         )}
                    </Button>
               </form>
          </Form>
     )

     const renderOtpStep = () => (
          <Form {...otpForm}>
               <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                                         <FormField
                          name="email"
                          control={otpForm.control}
                          render={({ field }) => (
                               <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                         <Input type="email" disabled {...field} value={email} />
                                    </FormControl>
                                    <FormMessage />
                               </FormItem>
                          )}
                     />
                    <FormField
                         name="otp"
                         control={otpForm.control}
                         render={({ field }) => (
                              <FormItem>
                                   <FormLabel>OTP</FormLabel>
                                   <FormControl>
                                        <Input type="text" placeholder="Enter 6-digit OTP" maxLength={6} {...field} />
                                   </FormControl>
                                   <FormMessage />
                              </FormItem>
                         )}
                    />
                    <Button type="submit" disabled={otpForm.formState.isSubmitting} className="w-full">
                         {otpForm.formState.isSubmitting ? (
                              <>
                                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                   Verifying...
                              </>
                         ) : (
                              'Verify OTP'
                         )}
                    </Button>
                    <Button 
                         type="button" 
                         variant="outline" 
                         onClick={() => setCurrentStep('email')}
                         className="w-full"
                    >
                         Back to Email
                    </Button>
               </form>
          </Form>
     )

     const renderPasswordStep = () => (
          <Form {...passwordForm}>
               <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                                         <FormField
                          name="email"
                          control={passwordForm.control}
                          render={({ field }) => (
                               <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                         <Input type="email" disabled {...field} value={email} />
                                    </FormControl>
                                    <FormMessage />
                               </FormItem>
                          )}
                     />
                                         <FormField
                          name="otp"
                          control={passwordForm.control}
                          render={({ field }) => (
                               <FormItem>
                                    <FormLabel>OTP</FormLabel>
                                    <FormControl>
                                         <Input type="text" disabled {...field} value={otp} />
                                    </FormControl>
                                    <FormMessage />
                               </FormItem>
                          )}
                     />
                    <FormField
                         name="newPassword"
                         control={passwordForm.control}
                         render={({ field }) => (
                              <FormItem>
                                   <FormLabel>New Password</FormLabel>
                                   <FormControl>
                                        <Input type="password" placeholder="Enter new password" {...field} />
                                   </FormControl>
                                   <FormMessage />
                              </FormItem>
                         )}
                    />
                    <FormField
                         name="confirmPassword"
                         control={passwordForm.control}
                         render={({ field }) => (
                              <FormItem>
                                   <FormLabel>Confirm Password</FormLabel>
                                   <FormControl>
                                        <Input type="password" placeholder="Confirm new password" {...field} />
                                   </FormControl>
                                   <FormMessage />
                              </FormItem>
                         )}
                    />
                    <Button type="submit" disabled={passwordForm.formState.isSubmitting} className="w-full">
                         {passwordForm.formState.isSubmitting ? (
                              <>
                                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                   Resetting Password...
                              </>
                         ) : (
                              'Reset Password'
                         )}
                    </Button>
                    <Button 
                         type="button" 
                         variant="outline" 
                         onClick={() => setCurrentStep('otp')}
                         className="w-full"
                    >
                         Back to OTP
                    </Button>
               </form>
          </Form>
     )

     const renderSuccessStep = () => (
          <div className="space-y-6 text-center">
               <div className="text-green-600">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">Password Reset Successful!</h3>
                    <p className="text-gray-600">Your password has been reset successfully. You can now sign in with your new password.</p>
               </div>
               <Link href="/sign-in">
                    <Button className="w-full">Sign In</Button>
               </Link>
          </div>
     )

     const getStepTitle = () => {
          switch (currentStep) {
               case 'email':
                    return 'Reset Password'
               case 'otp':
                    return 'Enter OTP'
               case 'password':
                    return 'Set New Password'
               case 'success':
                    return 'Success'
               default:
                    return 'Reset Password'
          }
     }

     const getStepDescription = () => {
          switch (currentStep) {
               case 'email':
                    return 'Enter your email address to receive a password reset OTP.'
               case 'otp':
                    return 'Enter the 6-digit OTP sent to your email.'
               case 'password':
                    return 'Enter your new password.'
               case 'success':
                    return ''
               default:
                    return 'Enter your email address to receive a password reset OTP.'
          }
     }

     return (
          <div className="flex justify-center items-center min-h-screen overflow-auto bg-gray-100 bg-opacity-50">
               <div className="w-full max-w-lg p-8 space-y-8 bg-white bg-opacity-50 rounded-lg shadow-md">
                    <div className="text-center">
                         <Link href={"/"}>
                              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Ghost Note</h1>
                         </Link>
                         <h2 className="text-2xl font-semibold mb-2">{getStepTitle()}</h2>
                         {getStepDescription() && (
                              <p className="text-gray-600 mb-4">{getStepDescription()}</p>
                         )}
                    </div>
                    
                    {currentStep === 'email' && renderEmailStep()}
                    {currentStep === 'otp' && renderOtpStep()}
                    {currentStep === 'password' && renderPasswordStep()}
                    {currentStep === 'success' && renderSuccessStep()}
               </div>
          </div>
     )
}

export default ForgotPasswordPage