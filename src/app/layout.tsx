import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { ClerkProvider } from '@clerk/nextjs'
import prisma from '@/lib/prisma'
import RootNav from './nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PRLabs',
  description: 'Digital tools empowering PR professionals',
}

export default async function RootLayout({ children }) {
  const authors = await prisma.author.findMany({})

  return (
    <ClerkProvider>
      <html lang="en" className="w-full h-full overflow-hidden">
        <body className={inter.className + ' w-full h-full'}>
          <RootNav authors={authors}>{children}</RootNav>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
