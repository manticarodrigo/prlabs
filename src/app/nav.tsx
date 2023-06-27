'use client'

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

function RootHeader({ onToggleMenu }) {
  return (
    <header className="z-20 flex justify-between items-center border-b border-slate-900 p-2">
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Are you sure absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Link href="/" className="text-lg font-bold">
        <Image src="/logo.svg" width={123} height={32} alt="PR Labs Logo" />
      </Link>
      <div className="flex items-center">
        <button
          aria-label="Toggle Menu"
          className="z-10 block lg:hidden"
          onClick={onToggleMenu}
        >
          <Menu className="w-8 h-8" />
        </button>
        <span className="ml-2 w-8 h-8">
          <UserButton afterSignOutUrl="/" />
        </span>
      </div>
    </header>
  )
}

function RootNavMenu({ authors, open, setOpen }) {
  const pathname = usePathname()

  return (
    <nav
      className={`
        absolute lg:static
        w-full lg:w-[250px] lg:h-full
        bg-white shadow-lg lg:shadow-none
        transition-all duration-300 ease-in-out
        ${open ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0

      `}
    >
      <ul className="divide-y divide-slate-900 lg:border-r border-slate-900 h-full">
        {authors.map((author) => {
          const { id, name, outlet } = author

          const slug = `/author/${id}`
          const isActive = pathname === slug

          return (
            <li
              key={id}
              className={`
                flex focus:bg-blue-50 hover:bg-blue-50 transition-colors
                ${isActive ? 'bg-slate-50 font-medium' : ''}
              `}
            >
              <Link
                href={slug}
                onClick={() => setOpen(false)}
                className="p-2 text-sm w-full h-full"
              >
                <div className="text-sm">{name}</div>
                <div className="text-xs">{outlet}</div>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default function RootNav({ authors, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col w-full h-full">
      <RootHeader onToggleMenu={() => setOpen((prev) => !prev)} />
      <div className="flex flex-col lg:flex-row w-full h-full min-h-0">
        <RootNavMenu authors={authors} open={open} setOpen={setOpen} />
        <main className="w-full h-full overflow-auto">{children}</main>
      </div>
    </div>
  )
}
