import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export type Prompt = {
  id: string
  name: string
  description: string
  prompt: string
}

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

export async function getNotionPrompts(): Promise<Prompt[]> {
  const { results = [] } = await getNotionDb()

  return results.map((result) => {
    let id = ''
    let name = ''
    let description = ''
    let prompt = ''

    if ('properties' in result) {
      const { properties } = result

      if (
        'title' in properties.name &&
        'rich_text' in properties.description &&
        'rich_text' in properties.prompt
      ) {
        id = result.id
        name = properties.name.title[0]?.plain_text
        description = properties.description.rich_text[0]?.plain_text
        prompt = properties.prompt.rich_text.map((text) => text.plain_text).join(' ')
      }
    }

    return {
      id,
      description,
      name,
      prompt,
    }
  })
}
