'use client'

import '@/app/globals.css'

import { Route } from 'next'
import { useParams } from 'next/navigation'

import { JournalistSwitcher } from '@/components/journalist/switcher'
import { AppNav } from '@/components/nav/app-nav'
import { TeamSwitcher } from '@/components/team/switcher'
import { User, UserMenu } from '@/components/user/user-menu'
import { Author, Team } from '@/lib/drizzle'

interface Props {
  user: User
  teams: Team[]
  journalists: Author[]
}

export function ProtectedLayoutHeader({ user, teams, journalists }: Props) {
  const params = useParams()
  return (
    <header className="border-b">
      <div className="flex justify-between items-center px-4 py-2">
        <AppNav
          links={[
            {
              title: 'Teams',
              href: '/teams',
              matches: '/teams',
            },
            ...(typeof params.team === 'string'
              ? [
                  {
                    title: 'Journalists',
                    href: `/teams/${params.team}/journalists` as Route,
                    matches: `/teams/${params.team}/journalists`,
                  },
                ]
              : []),
          ]}
        >
          <>
            <TeamSwitcher teams={teams} />
            <JournalistSwitcher journalists={journalists} />
          </>
        </AppNav>
        <UserMenu user={user} />
      </div>
    </header>
  )
}
