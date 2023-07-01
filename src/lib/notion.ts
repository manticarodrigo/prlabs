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

export async function getNotionPrompts() {
  const { results } = await getNotionDb()

  return results.map((result) => {
    if ('properties' in result) {
      const { id, properties } = result
      const { name, prompt, pathname } = properties

      if ('title' in name && 'rich_text' in prompt && 'rich_text' in pathname) {
        return {
          id,
          key: pathname.rich_text[0]?.plain_text,
          name: name.title[0]?.plain_text,
          prompt: prompt.rich_text[0]?.plain_text,
        }
      }
    }
  })
}
