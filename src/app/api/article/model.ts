
// eslint-disable-next-line simple-import-sort/imports
// import { createId } from '@paralleldrive/cuid2'

import { kv } from "@vercel/kv";
import { createStructuredOutputChainFromZod } from "langchain/chains/openai_functions";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { z } from 'zod';

import { getTeamMetadata } from '@/app/api/team/model';
import { Article, Author, Team, } from '@/lib/drizzle';
import { NewsCatcherArticle } from '@/lib/newscatcher';

export function getNewsArticleMetadata({
  author,
  clean_url,
  link,
  published_date,
  country,
  language,
  authors,
  twitter_account,
  is_opinion,
}: (Article & { author: Author | null }) | NewsCatcherArticle) {
  const isAuthorObject = typeof author === 'object'
  return `
        author: ${isAuthorObject ? author?.name : author}
        outlet: ${isAuthorObject ? author?.outlet : clean_url}
        link: ${link}
        date: ${published_date}
        country: ${country}
        language: ${language}
        authors: ${authors}
        twitter account: ${twitter_account}
        is opinion: ${is_opinion}
  `
}


const zodSchema = z.object({
  themes: z
    .array(
      z.object({
        title: z.string().describe("Title of theme or idea."),
        headline: z.string().describe("Short, one or two sentence headline of theme or idea."),
      })
    )
    .describe("Array of 3 top most relevant themes."),
  score: z.number().min(0).max(100).describe("A score from 0 to 100 for how closely the article aligns with the team context. A low score would mean that the article has some relevance to the team context, but not much. A high score would mean that the article is very relevant to the team context."),
});

export async function processArticles(team: Team, articles: NewsCatcherArticle[]) {
  const teamMetadata = getTeamMetadata(team)

  const llm = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo-16k',
    temperature: 0,
  })

  const prompt = new PromptTemplate({
    inputVariables: ["team", "author", "source", "article"],
    template: `
      You are a public relations professional working for a team:    
      {team}

      Evaluate the relevance of the following article to the team context:
      {article}
    `
  });

  const chain = createStructuredOutputChainFromZod(zodSchema, {
    prompt,
    llm,
  });

  const analyses = await Promise.all(
    articles.map(async (article) => {
      const cacheKey = `article-${article._id}-team-${team.id}`
      const cache = await kv.get(cacheKey) as string | null
      if (cache) {
        return { ...article, analysis: zodSchema.parse(cache) }
      }

      const articleMetadata = getNewsArticleMetadata(article)
      const analysis = await chain.call({
        team: teamMetadata,
        author: article.author || article.authors || article.twitter_account || article.clean_url,
        source: article.clean_url,
        article: articleMetadata + '\n article content:' + (article.summary || article.excerpt),
      })
      const parsed = zodSchema.parse(analysis.output)
      await kv.set(cacheKey, JSON.stringify(parsed))
      return { ...article, analysis: parsed }
    }),
  )

  // await db.insert(schema.articleAnalysis).values(
  //   summaries.map(({ article, summary }) => ({
  //     id: createId(),
  //     articleId: article.id,
  //     content: summary,
  //     updatedAt: new Date().toISOString(),
  //   })),
  // )

  return analyses
}
