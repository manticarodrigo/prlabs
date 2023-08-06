import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import Discord from '@/components/icons/discord'
import { TeamList } from '@/components/team/list'
import { buttonVariants } from '@/components/ui/button'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/ui/page-header'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const brands = [
  ['Apple', 'Think different.'],
  ['Google', 'Organizing the world’s information.'],
  ['Facebook', 'Connecting the world.'],
  ['Amazon', 'Delivering smiles.'],
  [
    'Microsoft',
    'Empowering every person and every organization on the planet to achieve more.',
  ],
  ['Netflix', 'Entertainment, anywhere, anytime.'],
  ['Tesla', 'Accelerating the world’s transition to sustainable energy.'],
  [
    'Twitter',
    'Giving everyone the power to create and share ideas and information instantly, without barriers.',
  ],
  ['Uber', 'Igniting opportunity by setting the world in motion.'],
  ['Airbnb', 'Belong anywhere.'],
]

const timestamp = new Date().toISOString()

const teams = brands.map(([name, description], i) => ({
  id: `${i}`,
  userId: `${i}`,
  name,
  description,
  strategy: '',
  updatedAt: timestamp,
  createdAt: timestamp,
}))

export default function HomePage() {
  return (
    <main className="w-full h-full min-h-0 overflow-auto">
      <div className="relative lg:container w-full h-full min-h-0">
        <div className="relative">
          <PageHeader className="pb-8">
            <Link
              href="/teams"
              className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
            >
              🎉 <Separator className="mx-2 h-4" orientation="vertical" />{' '}
              Journalist Search, a new media exploration tool.
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            <PageHeaderHeading>Build your media relations.</PageHeaderHeading>
            <PageHeaderDescription>
              Carefully crafted research workflows that pair realtime news
              analysis with generative AI interactions.
            </PageHeaderDescription>
            <div className="flex w-full items-center space-x-4 pb-8 pt-4 md:pb-10">
              <Link href="/teams" className={cn(buttonVariants())}>
                Get Started
              </Link>
              <Link
                target="_blank"
                rel="noreferrer"
                href="https://discord.gg/bcD3xkm9aa"
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                <Discord className="mr-2 h-4 w-4" />
                Discord
              </Link>
            </div>
          </PageHeader>
          <section className="flex flex-col justify-center rounded-lg border p-6 bg-background shadow gap-2 pointer-events-none gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back friend!
              </h1>
              <p className="text-muted-foreground">
                Select a team to get started.
              </p>
            </div>
            <TeamList teams={teams} />
          </section>
        </div>
      </div>
    </main>
  )
}
