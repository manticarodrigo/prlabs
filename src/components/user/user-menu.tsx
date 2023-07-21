'use client'

import { useClerk } from '@clerk/nextjs'
import Link from 'next/link'

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
  } else {
    title += user.emailAddress
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/customer/list">Customer profiles</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/customer/create">Add new customer</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
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
