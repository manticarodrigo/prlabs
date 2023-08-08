import '@/app/globals.css'

import { ClerkProvider, currentUser } from '@clerk/nextjs'
import { GoogleTagManagerBody, GoogleTagManagerHead } from '@thgh/next-gtm'
import { Analytics } from '@vercel/analytics/react'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import invariant from 'tiny-invariant'

import { getJournalists } from '@/app/api/journalist/model'
import { getTeams } from '@/app/api/team/model'
import { TeamModal } from '@/components/team/modal'
import { ProgressBar } from '@/components/ui/progress'
import { Toaster } from '@/components/ui/toaster'
import { TrpcProvider } from '@/lib/trpc'

import { ProtectedLayoutHeader } from './header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PRLabs',
  description: 'Digital tools empowering PR professionals',
}

export const runtime = 'edge'

interface Props {
  children: React.ReactNode
}

export default async function ProtectedLayout({ children }: Props) {
  const user = await currentUser()

  invariant(user, 'No user found.')

  const [teams, journalists] = await Promise.all([
    getTeams(user.id),
    getJournalists(),
  ])

  return (
    <html lang="en" className="w-full h-full overflow-hidden">
      <head>{GoogleTagManagerHead}</head>
      <body className={inter.className + ' w-full h-full flex flex-col'}>
        <TrpcProvider>
          <ClerkProvider>
            <ProtectedLayoutHeader
              user={{
                firstName: user.firstName,
                lastName: user.lastName,
                emailAddress: user.emailAddresses[0].emailAddress,
                profileImageUrl: user.profileImageUrl,
              }}
              teams={teams}
              journalists={journalists}
            />
            <main className="w-full h-full overflow-auto">{children}</main>
            <TeamModal teams={teams} />
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
