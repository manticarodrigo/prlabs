import { currentUser, SignInButton } from '@clerk/nextjs'
import { ArrowRight } from 'lucide-react'
import invariant from 'tiny-invariant'

import { getJournalists } from '@/app/api/journalist/model'
import { getTeams } from '@/app/api/team/model'
import { JournalistSwitcher } from '@/components/journalist/switcher'
import { AppNav } from '@/components/nav/app-nav'
import { TeamModal } from '@/components/team/modal'
import { TeamSwitcher } from '@/components/team/switcher'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/user/user-menu'

interface Props {
  children: React.ReactNode
  searchParams: {
    team: string
  }
}

export default async function TeamLayout({ children }: Props) {
  const user = await currentUser()

  invariant(user, 'No user found.')

  const [teams, journalists] = await Promise.all([
    getTeams(user.id),
    getJournalists(),
  ])

  return (
    <>
      <header className="border-b">
        <div className="flex justify-between items-center px-4 py-2">
          <AppNav>
            <>
              <TeamSwitcher teams={teams} />
              <JournalistSwitcher journalists={journalists} />
            </>
          </AppNav>
          {user ? (
            <UserMenu
              user={{
                firstName: user.firstName,
                lastName: user.lastName,
                emailAddress: user.emailAddresses[0].emailAddress,
                profileImageUrl: user.profileImageUrl,
              }}
            />
          ) : (
            <SignInButton>
              <Button className="bg-violet-700">
                Go to app
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </SignInButton>
          )}
        </div>
      </header>
      <main className="w-full h-full min-h-0 overflow-auto">{children}</main>
      <TeamModal teams={teams} />
    </>
  )
}
