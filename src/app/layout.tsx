import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { GoogleTagManagerBody, GoogleTagManagerHead } from '@thgh/next-gtm'
import { Analytics } from '@vercel/analytics/react'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'

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
