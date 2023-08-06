import '@/app/globals.css'

import { ClerkProvider, currentUser } from '@clerk/nextjs'
import { GoogleTagManagerBody, GoogleTagManagerHead } from '@thgh/next-gtm'
import { Analytics } from '@vercel/analytics/react'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import invariant from 'tiny-invariant'

import { getJournalists } from '@/app/api/journalist/model'
import { getTeams } from '@/app/api/team/model'
import { JournalistSwitcher } from '@/components/journalist/switcher'
import { AppNav } from '@/components/nav/app-nav'
import { TeamModal } from '@/components/team/modal'
import { TeamSwitcher } from '@/components/team/switcher'
import { ProgressBar } from '@/components/ui/progress'
import { Toaster } from '@/components/ui/toaster'
import { UserMenu } from '@/components/user/user-menu'
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

export default async function TeamLayout({ children }: Props) {
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
            <header className="border-b">
              <div className="flex justify-between items-center px-4 py-2">
                <AppNav
                  links={[
                    {
                      title: 'Teams',
                      href: '/teams',
                      matches: '/teams',
                    },
                    {
                      title: 'Journalists',
                      href: '/',
                      matches: '/',
                    },
                  ]}
                >
                  <>
                    <TeamSwitcher teams={teams} />
                    <JournalistSwitcher journalists={journalists} />
                  </>
                </AppNav>
                <UserMenu
                  user={{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailAddress: user.emailAddresses[0].emailAddress,
                    profileImageUrl: user.profileImageUrl,
                  }}
                />
              </div>
            </header>
            <main className="w-full h-full min-h-0 overflow-auto">
              {children}
            </main>
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
