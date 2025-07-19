'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Shield, Eye, Send, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-r from-stone-200/20 to-stone-300/20"></div>
          <div className="relative mx-auto max-w-7xl text-center">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4 inline-flex items-center gap-2 px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4" />
                Anonymous Messaging Platform
              </Badge>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-stone-900 md:text-6xl lg:text-7xl">
              Share Your Thoughts
              <span className="block bg-gradient-to-r from-stone-600 to-stone-800 bg-clip-text text-transparent">
                Without Fear
              </span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-lg text-stone-600 md:text-xl">
              Ghost Note lets you receive honest, anonymous feedback from friends, colleagues, and anyone who knows your username. 
              Your identity stays protected while you get genuine insights.
            </p>
            
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="group bg-gradient-to-r from-stone-700 to-stone-800 px-8 py-3 text-white shadow-lg transition-all hover:from-stone-800 hover:to-stone-900 hover:shadow-xl">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" size="lg" className="px-8 py-3 border-stone-300 text-stone-700 hover:bg-stone-50">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl">
                Why Choose Ghost Note?
              </h2>
              <p className="mx-auto max-w-2xl text-stone-600">
                Experience the power of anonymous feedback with our secure and user-friendly platform
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="group border-stone-200 bg-white/50 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 group-hover:bg-stone-200">
                  <Shield className="h-6 w-6 text-stone-700" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-stone-900">Complete Anonymity</h3>
                <p className="text-stone-600">
                  Your identity is completely protected. Senders remain anonymous while you receive honest feedback.
                </p>
              </Card>
              
              <Card className="group border-stone-200 bg-white/50 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 group-hover:bg-stone-200">
                  <Eye className="h-6 w-6 text-stone-700" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-stone-900">Easy to Use</h3>
                <p className="text-stone-600">
                  Simple setup with a unique username. Share your link and start receiving messages instantly.
                </p>
              </Card>
              
              <Card className="group border-stone-200 bg-white/50 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 group-hover:bg-stone-200">
                  <Send className="h-6 w-6 text-stone-700" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-stone-900">Instant Delivery</h3>
                <p className="text-stone-600">
                  Messages are delivered instantly to your dashboard. Read, manage, and respond to feedback in real-time.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="px-4 py-16 md:py-24 bg-gradient-to-r from-stone-50 to-stone-100">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl">
                What People Are Saying
              </h2>
              <p className="mx-auto max-w-2xl text-stone-600">
                Real anonymous messages from our community
              </p>
            </div>
            
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="h-full border-stone-200 bg-white/70 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        Anonymous
                      </Badge>
                      <MessageSquare className="h-4 w-4 text-stone-400" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="mb-3 text-sm leading-relaxed text-stone-700">
                      &ldquo;Your energy is absolutely magnetic! Every time you walk into a room, people can&apos;t help but smile. You have this incredible way of making everyone feel seen and heard.&rdquo;
                    </p>
                    <p className="text-xs text-stone-500">
                      Received 2 hours ago
                    </p>
                  </CardContent>
                </Card>

                <Card className="h-full border-stone-200 bg-white/70 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        Anonymous
                      </Badge>
                      <MessageSquare className="h-4 w-4 text-stone-400" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="mb-3 text-sm leading-relaxed text-stone-700">
                      &ldquo;You&apos;re literally the most attractive person I&apos;ve ever seen. I can&apos;t stop thinking about you. Your confidence and style are absolutely mesmerizing.&rdquo;
                    </p>
                    <p className="text-xs text-stone-500">
                      Received 1 day ago
                    </p>
                  </CardContent>
                </Card>

                <Card className="h-full border-stone-200 bg-white/70 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        Anonymous
                      </Badge>
                      <MessageSquare className="h-4 w-4 text-stone-400" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="mb-3 text-sm leading-relaxed text-stone-700">
                    &ldquo;I&apos;ve been crushing on you for months but was too shy to say anything. Your smile literally makes my day. I hope you know how beautiful you are inside and out.&rdquo;
                    </p>
                    <p className="text-xs text-stone-500">
                      Received 3 days ago
                    </p>
                  </CardContent>
                </Card>

                <Card className="h-full border-stone-200 bg-white/70 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        Anonymous
                      </Badge>
                      <MessageSquare className="h-4 w-4 text-stone-400" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="mb-3 text-sm leading-relaxed text-stone-700">
                      &ldquo;Your sense of humor is absolutely brilliant! You always know exactly what to say to make people laugh. You&apos;re the kind of person everyone wants to be around.&rdquo;
                    </p>
                    <p className="text-xs text-stone-500">
                      Received 1 week ago
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Card className="border-stone-200 bg-gradient-to-r from-stone-50 to-white p-8 shadow-sm">
              <h2 className="mb-4 text-3xl font-bold text-stone-900 md:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mb-8 text-lg text-stone-600">
                Join hundreds of users who are already receiving honest, anonymous feedback
              </p>
              <Link href="/sign-up">
                <Button size="lg" className="bg-gradient-to-r from-stone-700 to-stone-800 px-8 py-3 text-white shadow-lg transition-all hover:from-stone-800 hover:to-stone-900 hover:shadow-xl">
                  Create Your Ghost Note
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-stone-600">
                © 2025 Ghost Note. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="https://www.instagram.com/samdeep_.s/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-500 transition-colors hover:text-stone-700"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a 
                href="https://www.github.com/SamdeepSharma/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-500 transition-colors hover:text-stone-700"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/samdeep-sharma-20894b283/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-500 transition-colors hover:text-stone-700"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.3,0.9c1.5,-0.6 3.1,-0.9 4.7,-0.9c1.6,0 3.2,0.3 4.7,0.9c1.5,0.6 2.8,1.5 3.8,2.6c1,1.1 1.9,2.3 2.6,3.8c0.7,1.5 0.9,3 0.9,4.7c0,1.7 -0.3,3.2 -0.9,4.7c-0.6,1.5 -1.5,2.8 -2.6,3.8c-1.1,1 -2.3,1.9 -3.8,2.6c-1.5,0.7 -3.1,0.9 -4.7,0.9c-1.6,0 -3.2,-0.3 -4.7,-0.9c-1.5,-0.6 -2.8,-1.5 -3.8,-2.6c-1,-1.1 -1.9,-2.3 -2.6,-3.8c-0.7,-1.5 -0.9,-3.1 -0.9,-4.7c0,-1.6 0.3,-3.2 0.9,-4.7c0.6,-1.5 1.5,-2.8 2.6,-3.8c1.1,-1 2.3,-1.9 3.8,-2.6Zm-0.3,7.1c0.6,0 1.1,-0.2 1.5,-0.5c0.4,-0.3 0.5,-0.8 0.5,-1.3c0,-0.5 -0.2,-0.9 -0.6,-1.2c-0.4,-0.3 -0.8,-0.5 -1.4,-0.5c-0.6,0 -1.1,0.2 -1.4,0.5c-0.3,0.3 -0.6,0.7 -0.6,1.2c0,0.5 0.2,0.9 0.5,1.3c0.3,0.4 0.9,0.5 1.5,0.5Zm1.5,10l0,-8.5l-3,0l0,8.5l3,0Zm11,0l0,-4.5c0,-1.4 -0.3,-2.5 -0.9,-3.3c-0.6,-0.8 -1.5,-1.2 -2.6,-1.2c-0.6,0 -1.1,0.2 -1.5,0.5c-0.4,0.3 -0.8,0.8 -0.9,1.3l-0.1,-1.3l-3,0l0.1,2l0,6.5l3,0l0,-4.5c0,-0.6 0.1,-1.1 0.4,-1.5c0.3,-0.4 0.6,-0.5 1.1,-0.5c0.5,0 0.9,0.2 1.1,0.5c0.2,0.3 0.4,0.8 0.4,1.5l0,4.5l2.9,0Z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a
                href="mailto:sharmasamdeep1@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-500 transition-colors hover:text-stone-700"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4ZM20 6V7.236L12 11.764L4 7.236V6H20ZM4 8.764L12 13.292L20 8.764V18H4V8.764Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}