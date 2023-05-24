import { answerContextualQuery, streamLLMChain } from '@/lib/langchain'
import { getNewsArticles } from '@/lib/newscatcher'

export const runtime = 'edge'

export async function POST(request) {
  const res = await request.formData()
  const entries = Object.fromEntries(res.entries())

  const { interviewer, outlet } = entries

  const query =
    "Please analyze the provided news articles written by interviewer from outlet. Identify and list the top or notable key terms used and any brands mentioned across all the analyzed articles. Additionally, identify recurring topics within the articles by recognizing significant keyword groupings. Based on these keyword groupings, determine a central theme for interviewers's work, as well as several sub-themes and assign a weight to each based on their prevalence in the articles analyzed. Provide direct references to the language/content from the articles to support each theme and sub-theme. Lastly, include a summary at the end of the analysis offering advice on the most effective way to engage with interviewer."

  const articles = await getNewsArticles(interviewer, outlet)

  const texts = articles.map((article) => article.summary || '')

  const metadatas = articles.map((article) => {
    delete article.summary
    return article
  })

  const stream = await streamLLMChain(
    answerContextualQuery({ query, texts, metadatas }),
  )

  return new Response(stream)
}
