import { User } from '@clerk/nextjs/dist/types/server'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function UserAvatar({ user }: { user: User }) {
  let initials = ''

  if (user) {
    if (user.firstName) {
      initials += user.firstName[0]

      if (user.lastName) {
        initials += user.lastName[0]
      } else {
        initials += user.firstName[1]
      }
    } else {
      initials += user.emailAddresses[0][0]
      initials += user.emailAddresses[0][1]
    }
  }

  return (
    <Avatar className="w-8 h-8">
      <AvatarImage src={user.profileImageUrl} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
