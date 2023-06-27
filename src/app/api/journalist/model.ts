import prisma from '@/lib/prisma'

function mostCommonString(strings: string[]): string | null {
  if (!strings.length) return null // Return null if array is empty

  let stringFrequency = new Map<string, number>()
  let maxCount = 0
  let mostCommon = ''

  for (let str of strings) {
    let currentCount = (stringFrequency.get(str) || 0) + 1
    stringFrequency.set(str, currentCount)

    if (currentCount > maxCount) {
      maxCount = currentCount
      mostCommon = str
    }
  }

  return mostCommon
}

export function upsertJournalist(articles) {
  const names: string[] = articles.map(({ author }) => author)
  const outlets: string[] = articles.map(({ clean_url }) => clean_url)
  const name = mostCommonString(names)
  const outlet = mostCommonString(outlets)

  const articlePayload = {
    connectOrCreate: articles.map(
      ({ _id, _score, published_date, author, ...rest }) => ({
        where: {
          external_id: _id,
        },
        create: {
          ...rest,
          external_id: _id,
          external_score: _score,
          published_date: new Date(published_date),
        },
      }),
    ),
  }

  return prisma.author.upsert({
    where: {
      name_outlet: {
        name,
        outlet,
      },
    },
    create: {
      name,
      outlet,
      articles: articlePayload,
    },
    update: {
      articles: articlePayload,
    },
  })
}
