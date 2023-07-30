import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import DashboardPage from '@/app/dashboard/page'
import Discord from '@/components/icons/discord'
import { buttonVariants } from '@/components/ui/button'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/ui/page-header'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export default function IndexPage() {
  return (
    <div className="relative">
      <PageHeader className="pb-8">
        <Link
          href="/journalist/search"
          className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium"
        >
          🎉 <Separator className="mx-2 h-4" orientation="vertical" />{' '}
          Journalist Search, a new media exploration tool.
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
        <PageHeaderHeading>Accelerate your media relations.</PageHeaderHeading>
        <PageHeaderDescription>
          Carefully crafted workflows that pair realtime news analysis with
          generative AI interactions.
        </PageHeaderDescription>
        <div className="flex w-full items-center space-x-4 pb-8 pt-4 md:pb-10">
          <Link href="/journalist/search" className={cn(buttonVariants())}>
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
      <section className="">
        <div className="overflow-hidden rounded-lg border bg-background shadow">
          <DashboardPage />
        </div>
      </section>
    </div>
  )
}
