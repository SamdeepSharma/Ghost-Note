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
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, ArrowLeft, Mail, Shield, CheckCircle, Lock, Eye, EyeOff } from "lucide-react"
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
     const [showPassword, setShowPassword] = useState(false)
     const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
               } else {
                    toast({
                         title: 'Error',
                         description: response.data.message || 'Failed to send OTP',
                         variant: 'destructive'
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

     const getStepNumber = (step: Step) => {
          const steps = ['email', 'otp', 'password', 'success']
          return steps.indexOf(step) + 1
     }

     const getStepIcon = (step: Step) => {
          switch (step) {
               case 'email': return <Mail className="h-4 w-4" />
               case 'otp': return <Shield className="h-4 w-4" />
               case 'password': return <Lock className="h-4 w-4" />
               case 'success': return <CheckCircle className="h-4 w-4" />
               default: return <Mail className="h-4 w-4" />
          }
     }

     const getStepTitle = () => {
          switch (currentStep) {
               case 'email':
                    return 'Reset Your Password'
               case 'otp':
                    return 'Verify Your Email'
               case 'password':
                    return 'Set New Password'
               case 'success':
                    return 'Password Reset Complete!'
               default:
                    return 'Reset Your Password'
          }
     }

     const getStepDescription = () => {
          switch (currentStep) {
               case 'email':
                    return 'Enter your email address to receive a secure reset code.'
               case 'otp':
                    return 'Enter the 6-digit code sent to your email address.'
               case 'password':
                    return 'Create a strong new password for your account.'
               case 'success':
                    return 'Your password has been successfully reset. You can now sign in with your new password.'
               default:
                    return 'Enter your email address to receive a secure reset code.'
          }
     }

     const renderProgressBar = () => (
          <div className="mb-8">
               <div className="flex items-center justify-between mb-4">
                    {['email', 'otp', 'password', 'success'].map((step, index) => (
                         <div key={step} className="flex items-center">
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                                   getStepNumber(currentStep) > index + 1
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : getStepNumber(currentStep) === index + 1
                                        ? 'bg-stone-700 border-stone-700 text-white'
                                        : 'bg-white border-stone-300 text-stone-400'
                              }`}>
                                   {getStepNumber(currentStep) > index + 1 ? (
                                        <CheckCircle className="h-4 w-4" />
                                   ) : (
                                        getStepIcon(step as Step)
                                   )}
                              </div>
                              {index < 3 && (
                                   <div className={`w-12 h-0.5 mx-2 transition-all ${
                                        getStepNumber(currentStep) > index + 1
                                             ? 'bg-green-500'
                                             : 'bg-stone-200'
                                   }`} />
                              )}
                         </div>
                    ))}
               </div>
               <div className="flex justify-between text-xs text-stone-500">
                    <span>Enter Email</span>
                    <span>Verify Code</span>
                    <span>New Password</span>
                    <span>Complete</span>
               </div>
          </div>
     )

     const renderEmailStep = () => (
          <Form {...emailForm}>
               <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                    <FormField
                         name="email"
                         control={emailForm.control}
                         render={({ field }) => (
                              <FormItem>
                                   <FormLabel className="text-stone-700 font-medium">Email Address</FormLabel>
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
                    <Button 
                         type="submit" 
                         disabled={emailForm.formState.isSubmitting} 
                         className="w-full bg-gradient-to-r from-stone-700 to-stone-800 text-white shadow-sm hover:from-stone-800 hover:to-stone-900 transition-all"
                    >
                         {emailForm.formState.isSubmitting ? (
                              <>
                                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                   Sending Code...
                              </>
                         ) : (
                              'Send Reset Code'
                         )}
                    </Button>
               </form>
          </Form>
     )

     const renderOtpStep = () => (
          <Form {...otpForm}>
               <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                         <p className="text-sm text-stone-600 mb-2">Code sent to:</p>
                         <p className="font-medium text-stone-900">{email}</p>
                    </div>
                    <FormField
                         name="otp"
                         control={otpForm.control}
                         render={({ field }) => (
                              <FormItem>
                                   <FormLabel className="text-stone-700 font-medium">Verification Code</FormLabel>
                                   <FormControl>
                                        <Input 
                                             type="text" 
                                             placeholder="Enter 6-digit code" 
                                             maxLength={6} 
                                             className="border-stone-300 focus:border-stone-500 focus:ring-stone-500 text-center text-lg tracking-widest"
                                             {...field} 
                                        />
                                   </FormControl>
                                   <FormMessage />
                              </FormItem>
                         )}
                    />
                    <Button 
                         type="submit" 
                         disabled={otpForm.formState.isSubmitting} 
                         className="w-full bg-gradient-to-r from-stone-700 to-stone-800 text-white shadow-sm hover:from-stone-800 hover:to-stone-900 transition-all"
                    >
                         {otpForm.formState.isSubmitting ? (
                              <>
                                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                   Verifying...
                              </>
                         ) : (
                              'Verify Code'
                         )}
                    </Button>
                    <Button 
                         type="button" 
                         variant="outline" 
                         onClick={() => setCurrentStep('email')}
                         className="w-full border-stone-300 text-stone-700 hover:bg-stone-50"
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
                         name="newPassword"
                         control={passwordForm.control}
                         render={({ field }) => (
                              <FormItem>
                                   <FormLabel className="text-stone-700 font-medium">New Password</FormLabel>
                                   <div className="relative">
                                        <FormControl>
                                             <Input 
                                                  type={showPassword ? "text" : "password"}
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
                                             onClick={() => setShowPassword(!showPassword)}
                                        >
                                             {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        </Button>
                                   </div>
                                   <FormMessage />
                              </FormItem>
                         )}
                    />
                    <FormField
                         name="confirmPassword"
                         control={passwordForm.control}
                         render={({ field }) => (
                              <FormItem>
                                   <FormLabel className="text-stone-700 font-medium">Confirm Password</FormLabel>
                                   <div className="relative">
                                        <FormControl>
                                             <Input 
                                                  type={showConfirmPassword ? "text" : "password"}
                                                  placeholder="Confirm your new password" 
                                                  className="border-stone-300 focus:border-stone-500 focus:ring-stone-500 pr-12"
                                                  {...field} 
                                             />
                                        </FormControl>
                                        <Button 
                                             type="button" 
                                             variant="ghost"
                                             size="sm"
                                             className="absolute right-1 top-1 h-8 w-8 p-0 text-stone-500 hover:text-stone-700" 
                                             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                             {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        </Button>
                                   </div>
                                   <FormMessage />
                              </FormItem>
                         )}
                    />
                    <Button 
                         type="submit" 
                         disabled={passwordForm.formState.isSubmitting} 
                         className="w-full bg-gradient-to-r from-stone-700 to-stone-800 text-white shadow-sm hover:from-stone-800 hover:to-stone-900 transition-all"
                    >
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
                         className="w-full border-stone-300 text-stone-700 hover:bg-stone-50"
                    >
                         Back to Code
                    </Button>
               </form>
          </Form>
     )

     const renderSuccessStep = () => (
          <div className="space-y-6 text-center">
               <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                         <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
               </div>
               <div>
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">Password Reset Complete!</h3>
                    <p className="text-stone-600 pb-2">Your password has been successfully reset. You can now sign in with your new password.</p>
               </div>
               <Link href="/sign-in">
                    <Button className="w-full bg-gradient-to-r from-stone-700 to-stone-800 text-white shadow-sm hover:from-stone-800 hover:to-stone-900 transition-all">
                         Sign In Now
                    </Button>
               </Link>
          </div>
     )

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
                                   <h2 className="mt-4 text-xl font-semibold text-stone-900">{getStepTitle()}</h2>
                                   <p className="mt-2 text-sm text-stone-600">{getStepDescription()}</p>
                              </div>
                              {renderProgressBar()}
                         </CardHeader>
                         
                         <CardContent className="space-y-6">
                              {currentStep === 'email' && renderEmailStep()}
                              {currentStep === 'otp' && renderOtpStep()}
                              {currentStep === 'password' && renderPasswordStep()}
                              {currentStep === 'success' && renderSuccessStep()}
                         </CardContent>
                    </Card>
                    
                    <div className="mt-6 text-center">
                         <Link 
                              href="/sign-in" 
                              className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-800 transition-colors"
                         >
                              <ArrowLeft className="h-4 w-4" />
                              Back to sign in
                         </Link>
                    </div>
               </div>
          </div>
     )
}

export default ForgotPasswordPage