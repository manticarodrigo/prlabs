import { PromptTemplate } from 'langchain/prompts'
import { streamLLMChain, answerContextualQuery } from '@/lib/langchain'
import { getNewsArticles } from '@/lib/newscatcher'

export const runtime = 'edge'

export async function POST(request) {
  const res = await request.formData()
  const entries = Object.fromEntries(res.entries())
  const { interviewee, interviewer, outlet, prompt } = entries

  const template = PromptTemplate.fromTemplate(
    `
      Prepare a brief for {interviewee} for a potential interview with {interviewer} at {outlet}.
      The context for the interview is: {prompt}.
      The format for the brief is as follows:
      Background on {interviewer}:
      Bio, expertise, achievements, style, social media profiles.
      Areas of coverage, with examples of previous work.
      Possible discussion areas: Key topics, subtopics, relevant data, statistics, trends.
      Potential questions and responses for {interviewee}, addressing concerns.
      Suggestions to return to key messages.
      Summaries of recent articles by {interviewer}, noting patterns or trends.
      Sensitive topics to be aware of, with suggestions for handling them.
      Interview best practice tips, tailored to {interviewer} and the format.
      Additional resources, including recent news stories, reports related to the focus, insights on {interviewer}'s style.
    `,
  )

  const query = await template.format({
    interviewee,
    interviewer,
    outlet,
    prompt,
  })

  const articles = await getNewsArticles(interviewer, outlet)

  const texts = articles.map((article) => article.summary || ' ')

  const metadatas = articles.map((article) => {
    delete article.summary
    return article
  })

  const stream = await streamLLMChain(
    answerContextualQuery({ query, texts, metadatas }),
  )

  return new Response(stream)
}
