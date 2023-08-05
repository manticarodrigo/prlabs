'use client'

import { Menu } from 'lucide-react'
import { Route } from 'next'
import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useRouter } from '@/hooks/use-router'
import { cn } from '@/lib/utils'

type LinkConfig = {
  title: string
  href: Route
  matches: string
}

export const links: LinkConfig[] = [
  {
    title: 'Teams',
    href: '/teams',
    matches: '/teams',
  },
  {
    title: 'Privacy',
    href: '/privacy',
    matches: '/privacy-policy',
  },
  {
    title: 'Account',
    href: '/account',
    matches: '/account',
  },
]

interface Props {
  children?: JSX.Element
}

export function AppNav({ children }: Props) {
  const pathname = usePathname() ?? ''
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <div className="hidden md:flex items-center space-x-6">
        <Link href="/" className="text-lg font-bold">
          <Image src="/logo.svg" width={93} height={24} alt="PRLabs logo" />
        </Link>
        {children}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={`${link.title}-${link.href}-${link.matches}`}
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
        <div className="flex items-center md:hidden space-x-4">
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          {children}
        </div>
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

interface MobileLinkProps<R> extends LinkProps<R> {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink<R extends string>({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps<R>) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        if (typeof href === 'string') {
          router.push(href)
        }
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
