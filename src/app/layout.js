import './globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { getNotionDb } from '@/lib/notion'
import RootNav from './nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PRLabs',
  description: 'Digital tools empowering PR professionals',
}

export default async function RootLayout({ children }) {
  const { results } = await getNotionDb()

  return (
    <html lang="en" className="w-full h-full">
      <body className={inter.className + ' w-full h-full'}>
        <RootNav results={results}>{children}</RootNav>

        <Analytics />
      </body>
    </html>
  )
}
