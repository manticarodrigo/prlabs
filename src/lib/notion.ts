import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export async function getNotionDb() {
  const db = await notion.databases.query({
    database_id: '204d481c3793493ba350638812677657',
    filter: {
      property: 'name',
      title: {
        is_not_empty: true,
      },
    },
  })

  return db
}

export async function getNotionPrompt(key: string) {
  const { results } = await getNotionDb()

  const result = results.find((result) => {
    if ('properties' in result) {
      const property = result.properties.pathname
      if ('rich_text' in property) {
        return property.rich_text[0]?.plain_text === key
      }
    }
  })

  if ('properties' in result) {
    const prompt = result.properties.prompt
    if ('rich_text' in prompt) {
      return prompt.rich_text[0]?.plain_text
    }
  }
}
