import { currentUser, SignInButton } from '@clerk/nextjs'
import { User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { UserMenu } from '@/components/user/user-menu'

export async function AppHeader() {
  const user = await currentUser()

  return (
    <header className="flex justify-between items-center border-b p-2">
      <Link href="/" className="text-lg font-bold">
        <Image src="/logo.svg" width={123} height={32} alt="PR Labs Logo" />
      </Link>
      {user ? (
        <UserMenu user={user} />
      ) : (
        <SignInButton>
          <button className="flex items-center font-medium">
            <User className="mr-2 w-4 h-4" />
            Sign in
          </button>
        </SignInButton>
      )}
    </header>
  )
}
