import { currentUser, SignInButton } from '@clerk/nextjs'
import { ArrowRight } from 'lucide-react'

import { getTeams } from '@/app/api/team/model'
import { AppNav } from '@/components/nav/app-nav'
import TeamSwitcher from '@/components/team/switcher'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/user/user-menu'

export default async function TeamLayout({ children }) {
  const user = await currentUser()
  const teams = await getTeams(user.id)

  return (
    <>
      <header className="border-b">
        <div className="flex justify-between items-center px-4 py-2">
          <AppNav teams={teams}>
            <TeamSwitcher teams={teams} />
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
    </>
  )
}
