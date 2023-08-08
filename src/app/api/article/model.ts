
// eslint-disable-next-line simple-import-sort/imports
// import { createId } from '@paralleldrive/cuid2'

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
  trends: z
    .array(
      z.object({
        title: z.string().describe("Title for trend or idea"),
        summary: z.string().describe("Short, two-sentence summary of trend or idea"),
      })
    )
    .describe("An array of trends mentioned in the text"),
  score: z.number().min(0).max(100).describe("A score from 0 to 100 for how closely the article aligns with the team context"),
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

    You are evaluating a recent article published by {author} at {source}. Provide 3 trends or ideas mentioned in the article:
    {article}
    `
  });

  const chain = createStructuredOutputChainFromZod(zodSchema, {
    prompt,
    llm,
  });

  const analyses = await Promise.all(
    articles.map(async (article) => {
      const articleMetadata = getNewsArticleMetadata(article)
      const analysis = await chain.call({
        team: teamMetadata,
        author: article.author || article.authors || article.twitter_account || article.clean_url,
        source: article.clean_url,
        article: articleMetadata + '\n article content:' + (article.summary || article.excerpt)?.slice(0, 10000),
      })
      return { ...article, analysis: zodSchema.parse(analysis.output) }
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
