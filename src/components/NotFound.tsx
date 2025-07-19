import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { UserX, Home, Search, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-stone-200 bg-white/70 backdrop-blur-sm shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-stone-100 to-stone-200 rounded-full flex items-center justify-center">
                <UserX className="h-12 w-12 text-stone-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                  404
                </h1>
                <h2 className="text-xl font-semibold text-stone-900">
                  Ghost User Not Found
                </h2>
                <p className="text-stone-600">
                  This user doesn&apos;t exist or has been removed from our platform.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-stone-700 to-stone-800 text-white shadow-sm hover:from-stone-800 hover:to-stone-900 transition-all">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline" className="w-full border-stone-300 text-stone-700 hover:bg-stone-50">
                  <Search className="h-4 w-4 mr-2" />
                  Create Your Account
                </Button>
              </Link>
            </div>
            
            <div className="pt-4 border-t border-stone-200">
              <p className="text-xs text-stone-500">
                Looking for someone? Make sure you have the correct username.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NotFound
