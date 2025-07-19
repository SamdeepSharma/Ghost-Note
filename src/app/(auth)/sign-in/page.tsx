/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, Loader2, Sparkles, ArrowLeft } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { useState } from "react"

const page = () => {
  const { toast } = useToast()
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const { formState } = form;

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const response = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })
      if (response?.error) {
        if (response.error == 'CredentialsSignin') {
          toast({
            title: 'Sign-in failed',
            description: 'Incorrect credentials!',
            variant: 'destructive'
          })
        } else {
          toast({
            title: 'Sign-in failed',
            description: response.error,
            variant: 'destructive'
          })
        }

      }
      if (response?.url) {
        router.replace(`/dashboard`)
        toast({
          title: 'Sign-in successful',
          description: ''
        })
      }
    } catch (error) {
      toast({
        title: 'Sign-in failed',
        description: 'Please try again.',
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
              <p className="mt-2 text-stone-600">Welcome back! Sign in to continue your anonymous journey.</p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  name="identifier"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-stone-700 font-medium">Email or Username</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="Enter your email or username" 
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
                            placeholder="Enter your password" 
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
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <div className="text-center">
                <p className="text-sm text-stone-600">
                  Don&apos;t have an account?{' '}
                  <Link href={'/sign-up'} className="font-medium text-stone-700 hover:text-stone-900 transition-colors">
                    Sign up
                  </Link>
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-stone-600">
                  <Link href={'/forgot-pass'} className="font-medium text-stone-700 hover:text-stone-900 transition-colors">
                    Forgot your password?
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