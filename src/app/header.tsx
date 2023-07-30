import { currentUser, SignInButton } from '@clerk/nextjs'
import { User } from 'lucide-react'

import { AppNav } from '@/components/nav/app-nav'
import { UserMenu } from '@/components/user/user-menu'
import { db, eq, schema } from '@/lib/drizzle'

export async function AppHeader() {
  const user = await currentUser()
  const teams =
    user &&
    (await db.query.customer.findMany({
      where: eq(schema.customer.userId, user.id),
    }))

  return (
    <header className="border-b">
      <div className="container flex justify-between items-center p-2">
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
            <button className="flex items-center font-medium">
              <User className="mr-2 w-4 h-4" />
              Sign in
            </button>
          </SignInButton>
        )}
      </div>
    </header>
  )
}
