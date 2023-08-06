import { UserProfile } from '@clerk/nextjs'

export default function ProfilePage() {
  return (
    <main className="flex flex-col items-center p-8 w-full h-full overflow-auto">
      <UserProfile />
    </main>
  )
}
