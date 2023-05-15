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
        content: `
          Create a comprehensive briefing document to help [Name of Interviewee], [Title of Interviewee] at [Company], prepare for a media interview with [Name of Journalist], a reporter at [Media Outlet]. Ensure that the document covers the following aspects:
          Prepared by: [Name of Preparer], [Title of Preparer] at [Agency/Company]
          Interview details, including date, time, and format (in-person, virtual, phone, etc.)
          Background information on [Name of Journalist]:
          A brief bio, including their expertise, notable achievements, and journalistic style
          Twitter page or other relevant social media profiles
          Focus areas, beats, or topics they typically cover, with examples of previous interviews or articles
          Interview context and focus, highlighting the main objective or angle, and explaining its relevance to the interviewee's company or industry
          Expanded areas of discussion related to the interview focus, detailing several key topics and subtopics that might be addressed, along with relevant data, statistics, or trends
          Sample questions and thorough responses for the interviewee, incorporating company-specific information and addressing potential concerns:
          Include possible follow-up questions or probing inquiries from the journalist
          Suggest ways for the interviewee to steer the conversation back to key messages if necessary
          Summaries of [number] relevant articles by the journalist, including:
          Links to the articles
          3-4 bullet points summarizing each article's main points, findings, or conclusions
          Any patterns or trends in the journalist's coverage that might inform the interviewee's preparation
          Potential hazard areas or sensitive topics to be aware of during the interview, along with suggestions for handling them:
          Include potential controversial questions or topics
          Offer strategies for diplomatically addressing or deflecting these issues
          Media interview best practice tips:
          Provide 5 general tips to help the interviewee prepare effectively and perform well during the interview, tailored to the journalist's style and the interview format
          Include specific examples or anecdotes to illustrate the tips, if possible
          Any additional relevant information, resources, or tips to help the interviewee prepare effectively, such as:
          Links to recent news stories or industry reports related to the interview focus
          Insights on the journalist's interviewing style or preferences, if available
          Please provide the necessary information based on the context and specific details of the interview, ensuring a comprehensive and informative briefing.
`,
      },
      { role: 'user', content: prompt.substring(0, 2048) },
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
  const { preparer, interviewee, interviewer, outlet, prompt } = entries

  const { posts: news } = await getNewsArticles({
    author: interviewer,
    site: outlet,
  })

  const payload = JSON.stringify({
    preparer,
    interviewee,
    interviewer,
    outlet,
    prompt,
    news,
  })

  const response = await generateResponse(payload)

  return NextResponse.json(response.data.choices[0].message.content)
}
