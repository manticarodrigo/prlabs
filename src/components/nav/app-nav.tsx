import { DesktopNav } from './desktop-nav'
import { MobileNav } from './mobile-nav'

export const links = [
  {
    title: 'Journalists',
    href: '/journalist/search',
    matches: '/journalist',
  },
  {
    title: 'Clients',
    href: '/client/list',
    matches: '/client',
  },
  {
    title: 'Topics',
    href: '/topic/search',
    matches: '/topic',
  },
  {
    title: 'Conferences',
    href: '/conference/list',
    matches: '/conference',
  },
]

export function AppNav() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  )
}
