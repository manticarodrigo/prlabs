import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { GoogleTagManagerBody, GoogleTagManagerHead } from '@thgh/next-gtm'
import { Analytics } from '@vercel/analytics/react'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ProgressBar } from '@/components/ui/progress'
import { Toaster } from '@/components/ui/toaster'
import { TrpcProvider } from '@/util/trpc'

import { AppHeader } from './header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PRLabs',
  description: 'Digital tools empowering PR professionals',
}

export const runtime = 'edge'

export default function AppLayout({ children }) {
  return (
    <html lang="en" className="w-full h-full overflow-hidden">
      <head>{GoogleTagManagerHead}</head>
      <body className={inter.className + ' w-full h-full flex flex-col'}>
        <TrpcProvider>
          <ClerkProvider>
            <AppHeader />
            <div className="w-full h-full min-h-0 overflow-auto">
              <div className="container w-full h-full min-h-0">{children}</div>
            </div>
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
