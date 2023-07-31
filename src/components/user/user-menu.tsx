'use client'

import { useClerk } from '@clerk/nextjs'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { UserAvatar } from './user-avatar'

export type User = {
  firstName?: string
  lastName?: string
  emailAddress: string
  profileImageUrl?: string
}

interface UserMenuProps {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const { signOut } = useClerk()

  let title = ''

  if (user.firstName) {
    title += user.firstName

    if (user.lastName) {
      title += ' ' + user.lastName
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <UserAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          {title ? (
            <>
              {title}
              <div className="text-xs font-light">{user.emailAddress}</div>
            </>
          ) : (
            user.emailAddress
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account">Account settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => signOut()}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
