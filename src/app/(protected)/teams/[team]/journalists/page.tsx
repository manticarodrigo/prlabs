import { getJournalists } from '@/app/api/journalist/model'
import { JournalistSearch } from '@/components/journalist/search'

export const dynamic = 'force-dynamic'

interface Props {
  params: {
    team: string
  }
}

export default async function JournalistsPage({ params }: Props) {
  const journalists = await getJournalists()

  return (
    <main className="container flex flex-col items-center justify-center py-6 px-4 w-full min-h-full gap-4 sm:gap-6">
      <div className="border shadow rounded-xl overflow-hidden w-full max-w-lg">
        <JournalistSearch team={params.team} authors={journalists} />
      </div>
    </main>
  )
}
