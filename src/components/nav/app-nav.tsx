'use client'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'

import TeamSwitcher from '@/components/team/switcher'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Team } from '@/lib/drizzle'
import { cn } from '@/lib/utils'

export const links = [
  {
    title: 'Teams',
    href: '/teams',
    matches: '/teams',
  },
  {
    title: 'Journalists',
    href: '/journalist/search',
    matches: '/journalist',
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

interface Props {
  teams: Team[]
}

export function AppNav({ teams }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <div className="mr-4 hidden md:flex items-center space-x-6">
        <Link href="/" className="text-lg font-bold">
          <Image src="/logo.svg" width={93} height={24} alt="PRLabs logo" />
        </Link>
        <TeamSwitcher teams={teams} />
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname.startsWith(link.matches)
                  ? 'text-foreground'
                  : 'text-foreground/60',
              )}
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <Menu className="mr-2 h-6 w-6" />
            <Image src="/logo.svg" width={93} height={24} alt="PRLabs logo" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0 h-full">
          <MobileLink
            href="/"
            className="flex items-center"
            onOpenChange={setOpen}
          >
            <Image src="/logo.svg" width={93} height={24} alt="PRLabs logo" />
          </MobileLink>
          <ScrollArea className="my-4 h-full min-h-0">
            <div className="flex flex-col space-y-3">
              {links.map(
                (item) =>
                  item.href && (
                    <MobileLink
                      key={item.href}
                      href={item.href}
                      onOpenChange={setOpen}
                    >
                      {item.title}
                    </MobileLink>
                  ),
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
