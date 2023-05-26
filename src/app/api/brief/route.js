import { PromptTemplate } from 'langchain/prompts'
import { makeRetrievalQAChain } from '@/lib/langchain'
import { getNewsArticles } from '@/lib/newscatcher'

export const runtime = 'edge'

export async function POST(request) {
  const res = await request.formData()
  const entries = Object.fromEntries(res.entries())
  const { interviewee, interviewer, outlet, prompt } = entries

  const template = PromptTemplate.fromTemplate(
    `
      Please analyze the provided articles and use that context to create a briefing document for the interviewee.

      The interview will be about: {prompt}

      Create a comprehensive briefing document to help {interviewee}, prepare for a media interview with {interviewer}, a reporter at {outlet}.

      Background information on {interviewer}:
      A brief bio, including their expertise, notable achievements, and journalistic style.
      Twitter page or other relevant social media profiles.
      Focus areas, beats, or topics they typically cover, with examples of previous interviews or articles.
      Interview context and focus, highlighting the main objective or angle, and explaining its relevance to the interviewee's company or industry.
      Expanded areas of discussion related to the interview focus, detailing several key topics and subtopics that might be addressed, along with relevant data, statistics, or trends.

      Sample questions and thorough responses for the interviewee, incorporating company-specific information and addressing potential concerns:
      Include possible follow-up questions or probing inquiries from the journalist.
      Suggest ways for the interviewee to steer the conversation back to key messages if necessary.

      Summaries of recent articles including:
      Links to the articles.
      3-4 bullet points summarizing each article's main points, findings, or conclusions.
      Any patterns or trends in the journalist's coverage that might inform the interviewee's preparation.
      Potential hazard areas or sensitive topics to be aware of during the interview, along with suggestions for handling them:
      Include potential controversial questions or topics.
      Offer strategies for diplomatically addressing or deflecting these issues.

      Media interview best practice tips:
      Provide 5 general tips to help the interviewee prepare effectively and perform well during the interview, tailored to the journalist's style and the interview format.
      Include specific examples or anecdotes to illustrate the tips, if possible.

      Any additional relevant information, resources, or tips to help the interviewee prepare effectively, such as:
      Links to recent news stories or industry reports related to the interview focus.
      Insights on the journalist's interviewing style or preferences, if available.

      Please provide the necessary information based on the journalist's articles and by the additional context provided by the user.
      Provide specific details of the interview, ensuring a comprehensive and informative briefing.
    `,
  )

  const question = await template.format({
    interviewee,
    interviewer,
    outlet,
    prompt,
  })

  const articles = await getNewsArticles(interviewer, outlet)
  const chain = await makeRetrievalQAChain(articles)

  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  chain.call(
    {
      question,
      chat_history: [],
    },
    [
      {
        async handleLLMNewToken(token) {
          await writer.ready
          await writer.write(encoder.encode(`${token}`))
        },
        async handleLLMClose() {
          await writer.ready
          await writer.close()
        },
      },
    ],
  )

  return new Response(stream.readable)
}
