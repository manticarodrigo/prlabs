import './globals.css'

import { ClerkProvider, UserButton } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/react'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

import { Toaster } from '@/components/ui/toaster'

import { ProgressBar } from '../components/ui/progress'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PRLabs',
  description: 'Digital tools empowering PR professionals',
}

export const runtime = 'edge'

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className="w-full h-full overflow-hidden">
      <body className={inter.className + ' w-full h-full flex flex-col'}>
        <ClerkProvider>
          <header className="flex justify-between items-center border-b p-2">
            <Link href="/" className="text-lg font-bold">
              <Image
                src="/logo.svg"
                width={123}
                height={32}
                alt="PR Labs Logo"
              />
            </Link>
            <div className="flex items-center">
              <span className="ml-2 w-8 h-8">
                <UserButton afterSignOutUrl="/" />
              </span>
            </div>
          </header>
          <div className="w-full h-full min-h-0 overflow-auto">{children}</div>
          <Toaster />
          <ProgressBar />
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  )
}
