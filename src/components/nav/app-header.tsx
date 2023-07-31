import { currentUser, SignInButton } from '@clerk/nextjs'
import { ArrowRight } from 'lucide-react'

import { getTeams } from '@/app/api/team/model'
import { AppNav } from '@/components/nav/app-nav'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/user/user-menu'

export async function AppHeader() {
  const user = await currentUser()
  const teams = await getTeams(user.id)

  return (
    <div className="flex justify-between items-center p-2">
      <AppNav teams={teams} />
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
  )
}
