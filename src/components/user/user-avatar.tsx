import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { User } from './user-menu'

interface UserAvatarProps {
  user: User
}

export function UserAvatar({ user }: UserAvatarProps) {
  let initials = ''

  if (user.firstName) {
    initials += user.firstName[0]

    if (user.lastName) {
      initials += user.lastName[0]
    } else {
      initials += user.firstName[1]
    }
  } else {
    initials += user.emailAddress[0]
    initials += user.emailAddress[1]
  }

  return (
    <Avatar className="w-8 h-8">
      <AvatarImage src={user.profileImageUrl} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
