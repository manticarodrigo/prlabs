import { currentUser, SignInButton } from '@clerk/nextjs'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { getTeams } from '@/app/api/team/model'
import Discord from '@/components/icons/discord'
import { AppNav } from '@/components/nav/app-nav'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/ui/page-header'
import { Separator } from '@/components/ui/separator'
import { UserMenu } from '@/components/user/user-menu'
import { cn } from '@/lib/utils'

export default async function HomePage() {
  const user = await currentUser()
  const teams = await getTeams(user.id)
  return (
    <>
      <header className="border-b">
        <div className="lg:container px-2">
          <div className="flex justify-between items-center p-2">
            <AppNav teams={teams} />
            {user ? (
              <UserMenu
                user={{
                  firstName: user.firstName,
                  lastName: user.lastName,
                  emailAddress: user.emailAddresses[0].emailAddress,
                  profileImageUrl: user.profileImageUrl,
                }}
              />
            ) : (
              <SignInButton>
                <Button className="bg-violet-700">
                  Go to app
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>
      <main className="w-full h-full min-h-0 overflow-auto">
        <div className="relative lg:container w-full h-full min-h-0">
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
              <PageHeaderHeading>Build your media relations.</PageHeaderHeading>
              <PageHeaderDescription>
                Carefully crafted research workflows that pair realtime news
                analysis with generative AI interactions.
              </PageHeaderDescription>
              <div className="flex w-full items-center space-x-4 pb-8 pt-4 md:pb-10">
                <Link
                  href="/journalist/search"
                  className={cn(buttonVariants())}
                >
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
              <div className="overflow-hidden rounded-lg border bg-background shadow"></div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
