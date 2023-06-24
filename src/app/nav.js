'use client'

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu } from 'react-feather'

function RootHeader({ onToggleMenu }) {
  return (
    <header className="z-20 flex justify-between items-center border-b border-violet-900 p-2">
      <Link href="/" className="text-lg font-bold">
        <Image src="/logo.svg" width={150} height={50} alt="PR Labs Logo" />
      </Link>
      <div className="flex items-center">
        <button
          aria-label="Toggle Menu"
          className="z-10 block lg:hidden"
          onClick={onToggleMenu}
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="ml-3">
          <UserButton afterSignOutUrl="/" />
        </span>
      </div>
    </header>
  )
}

function RootNavMenu({ results, open, setOpen }) {
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
        {results.map((result) => {
          const { id, properties } = result

          const title = properties.name?.title[0].plain_text
          const slug = `/${properties.pathname?.rich_text[0]?.plain_text}`
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
                className="flex items-center text-sm w-full h-full"
              >
                <span className="p-4">{title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default function RootNav({ results, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col w-full h-full">
      <RootHeader onToggleMenu={() => setOpen((prev) => !prev)} />
      <div className="flex flex-col lg:flex-row w-full h-full min-h-0">
        <RootNavMenu results={results} open={open} setOpen={setOpen} />
        <main className="flex flex-col items-center p-12 w-full h-full overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
