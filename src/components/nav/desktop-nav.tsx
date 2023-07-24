'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import { links } from './app-nav'

export function DesktopNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex space-x-6">
      <Link href="/" className="text-lg font-bold">
        <Image src="/logo.svg" width={93} height={24} alt="PRLabs logo" />
      </Link>
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
  )
}
