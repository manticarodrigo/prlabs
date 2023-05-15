import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'

async function generateResponse(prompt) {
  const configuration = new Configuration({
    organization: 'org-kUlPMn8g8FMJFmV6B1KdUGeU',
    apiKey: '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',
  })
  const openai = new OpenAIApi(configuration)
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'The user will provide some information for context:',
      },
      { role: 'user', content: prompt.substring(0, 8192) },
      {
        role: 'system',
        content:
          "Please analyze the provided news articles written by interviewer from outlet. Identify and list the top or notable key terms used and any brands mentioned across all the analyzed articles. Additionally, identify recurring topics within the articles by recognizing significant keyword groupings. Based on these keyword groupings, determine a central theme for interviewers's work, as well as several sub-themes and assign a weight to each based on their prevalence in the articles analyzed. Provide direct references to the language/content from the articles to support each theme and sub-theme. Lastly, include a summary at the end of the analysis offering advice on the most effective way to engage with interviewer.",
      },
    ],
  })

  return response
}

async function getNewsArticles({ author, site, country = 'US' }) {
  const params = new URLSearchParams({
    q: `author:(${author}) site:${site}`,
    token: 'd513bc0b-4f8a-4155-baac-dab532ad12f7',
    format: 'json',
    sort: 'published',
  })
  const endpoint = `https://api.webz.io/filterWebContent?${params.toString()}`
  const response = await fetch(endpoint)
  const json = await response.json()
  return json
}

export async function POST(request) {
  const res = await request.formData()
  const entries = Object.fromEntries(res.entries())
  const { interviewer, outlet } = entries

  const { posts: news } = await getNewsArticles({
    author: interviewer,
    site: outlet,
  })

  const payload = JSON.stringify({
    interviewer,
    outlet,
    news,
  })

  const response = await generateResponse(payload)

  return NextResponse.json(response.data.choices[0].message.content)
}
