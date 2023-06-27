import prisma from '@/lib/prisma'

export default async function JournalistLayout({ params, children }) {
  const { id } = params

  const author = await prisma.author.findUnique({
    where: { id },
  })

  const { name, outlet } = author

  return (
    <div className="p-12">
      <div className="pb-4">
        <h1>{name}</h1>
        <h2>{outlet}</h2>
      </div>
      {children}
    </div>
  )
}
