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
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-opacity-50">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white bg-opacity-50 rounded-lg shadow-md">
        <div className="text-center">
        <Link href={"/"}><h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Ghost Note</h1></Link>
          <p className="mb-4">Sign-in to start your anonymous adventure.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="email or username" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <div className="flex justify-center items-center">
                  <FormControl>
                    <Input type={`${showPass? "text":"password"}`} placeholder="password" {...field} />
                  </FormControl>
                    { showPass? <Button type="button" className="mx-2" onClick={()=>{setShowPass(false)}}><EyeIcon className="h-5 w-5"/></Button> 
                    : <Button type="button" className="mx-2" onClick={()=> {setShowPass(true)}}> <EyeOffIcon className="h-5 w-5"/></Button>}
                    </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={formState.isSubmitting}>
              {
                formState.isSubmitting ?
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in
                  </>
                  : ('Sign in')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>Not a member?{'  '}
            <Link href={'/sign-up'} className="text-blue-600 hover:text-blue-800">Sign-up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default page