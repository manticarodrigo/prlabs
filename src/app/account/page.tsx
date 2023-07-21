import { UserProfile } from '@clerk/nextjs'

export default function ProfilePage() {
  return (
    <main className="flex justify-center items-center p-8 w-full min-h-full">
      <UserProfile />
    </main>
  )
}
