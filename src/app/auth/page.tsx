import { getServerSession } from 'next-auth/next'

import {
  LoginButton,
  LogoutButton,
  ProfileButton,
  RegisterButton,
} from '@/components/auth/buttons'
import { authOptions } from '@/lib/auth'

import { SessionClientComponent } from './client'

export const runtime = 'nodejs'

export default async function Auth() {
  const session = await getServerSession(authOptions)

  return (
    <main className="flex flex-col justify-center items-center w-full h-full min-h-0">
      <h1>Server Session</h1>
      <pre>{JSON.stringify(session)}</pre>
      <SessionClientComponent />
      <a href="/api/auth/session">See api session</a>
      <div>
        <LoginButton />
        <RegisterButton />
        <LogoutButton />
        <ProfileButton />
      </div>
    </main>
  )
}
