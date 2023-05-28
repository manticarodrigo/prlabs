import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export const getNotionDb = async () => {
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
