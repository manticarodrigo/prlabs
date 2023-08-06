import '@/app/globals.css'

import { ClerkProvider, SignInButton } from '@clerk/nextjs'
import { GoogleTagManagerBody, GoogleTagManagerHead } from '@thgh/next-gtm'
import { Analytics } from '@vercel/analytics/react'
import { ArrowRight } from 'lucide-react'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { AppNav } from '@/components/nav/app-nav'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress'
import { Toaster } from '@/components/ui/toaster'
import { TrpcProvider } from '@/lib/trpc'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PRLabs',
  description: 'Digital tools empowering PR professionals',
}

export const runtime = 'edge'

interface Props {
  children: React.ReactNode
}

export default function AppLayout({ children }: Props) {
  return (
    <html lang="en" className="w-full h-full overflow-hidden">
      <head>{GoogleTagManagerHead}</head>
      <body className={inter.className + ' w-full h-full flex flex-col'}>
        <TrpcProvider>
          <ClerkProvider>
            <header className="border-b">
              <div className="lg:container px-2">
                <div className="flex justify-between items-center p-2">
                  <AppNav
                    links={[
                      {
                        title: 'Get started',
                        href: '/teams',
                        matches: '/teams',
                      },
                      {
                        title: 'Privacy policy',
                        href: '/privacy',
                        matches: '/privacy-policy',
                      },
                    ]}
                  />
                  <SignInButton>
                    <Button className="bg-violet-700">
                      Go to app
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </SignInButton>
                </div>
              </div>
            </header>
            {children}
            <Toaster />
            <ProgressBar />
            <Analytics />
          </ClerkProvider>
        </TrpcProvider>
        {GoogleTagManagerBody}
      </body>
    </html>
  )
}
