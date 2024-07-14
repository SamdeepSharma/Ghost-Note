'use client'
import content from "@/data/messages.json"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-100 text-black">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Ghost Note - Where your identity remains a secret.
          </p>
        </section>
        <Carousel plugins={[Autoplay({ delay: 2500 })]} className="w-full max-w-xs">
          <CarouselContent>
            {
              content.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="bg-stone-200">
                      <CardHeader>
                        {message.title}
                      </CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-3xl font-semibold">{message.content}</span>
                      </CardContent>
                      <CardFooter>
                        {message.received}
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

      </main>

      <footer className="text-center p-4 md:p-6 bg-black text-white">
        Copyright © 2024 Ghost-Note | All rights reserved.
      </footer>
    </>
  );
}