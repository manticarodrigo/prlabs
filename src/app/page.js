import Image from 'next/image'
import Link from 'next/link'

const btnClass =
  'rounded py-2 px-4 w-full text-center text-white font-bold bg-violet-700 hover:bg-violet-900'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 lg:p-24">
      <h1 className="sr-only">PRLabs</h1>
      <Image src="/logo.svg" width={200} height={200} alt="PR Labs Logo" />
      <p className="mt-2 mb-6 text-center">
        Try our AI-powered tools for Public Relations professionals below:
      </p>
      <div className="flex flex-col space-y-4 w-64">
        <Link href="/brief" className={btnClass}>
          Briefing book generator
        </Link>
        <Link href="/journalist" className={btnClass}>
          Journalist analyzer
        </Link>
      </div>
    </main>
  )
}
