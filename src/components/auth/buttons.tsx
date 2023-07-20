'use client'

import Link from 'next/link'
import { signIn, signOut } from 'next-auth/react'

import { Button } from '@/components/ui/button'

export const LoginButton = () => {
  return (
    <Button style={{ marginRight: 10 }} onClick={() => signIn()}>
      Sign in
    </Button>
  )
}

export const RegisterButton = () => {
  return (
    <Button asChild>
      <Link href="/register" style={{ marginRight: 10 }}>
        Register
      </Link>
    </Button>
  )
}

export const LogoutButton = () => {
  return (
    <Button style={{ marginRight: 10 }} onClick={() => signOut()}>
      Sign Out
    </Button>
  )
}

export const ProfileButton = () => {
  return (
    <Button asChild>
      <Link href="/profile">Profile</Link>
    </Button>
  )
}
