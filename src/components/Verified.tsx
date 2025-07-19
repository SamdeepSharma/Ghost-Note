import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, ArrowRight, Home } from 'lucide-react'

const Verified = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-stone-200 bg-white/70 backdrop-blur-sm shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                  Account Verified
                </h1>
                <p className="text-stone-600">
                  Your account has already been verified and is ready to use.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full bg-gradient-to-r from-stone-700 to-stone-800 text-white shadow-sm hover:from-stone-800 hover:to-stone-900 transition-all">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full border-stone-300 text-stone-700 hover:bg-stone-50">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Verified
