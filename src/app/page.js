import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 lg:p-24">
      <h1 className="text-2xl font-bold uppercase">PR Labs</h1>
      <p className="my-2">
        Try our AI-powered tools for Public Relations professionals below:
      </p>
      <Link
        href="/brief"
        className="text-lg font-medium uppercase underline text-center"
      >
        Briefing book generator
      </Link>
      <Link
        href="/journalist"
        className="text-lg font-medium uppercase underline text-center"
      >
        Journalist analyzer
      </Link>
    </main>
  )
}
