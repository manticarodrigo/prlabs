import { createStructuredOutputChainFromZod } from 'langchain/chains/openai_functions'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { PromptTemplate } from 'langchain/prompts'
import { z } from 'zod'

import { TeamSchema } from '@/schema/team'

import { createRouter, protectedProcedure } from '../trpc'

const zodSchema = z.object({
  keywords: z.array(z.string().describe('Short 3-20 character keyword')).describe('Array of 10 keywords for search.'),
})

export const keywordRouter = createRouter({
  search: protectedProcedure.input(TeamSchema).query(async ({ input }) => {
    if (!input.description.length || !input.strategy.length) {
      return []
    }
    const llm = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.5,
    })
    const prompt = new PromptTemplate({
      inputVariables: ['team'],
      template: `
        You are a public relations professional working for a team:    
        {team}
        Provide a list of 10 unique keywords to use for news search.
        They should be high-level enough to get a wide variety of results, but specific enough to be relevant to the team. For example, "healthcare" is too broad, but "healthcare for the elderly" is specific enough.
        Do not mention the team name in the keywords.
      `,
    })

    const chain = createStructuredOutputChainFromZod(zodSchema, {
      prompt,
      llm,
    })

    const result = await chain.call({
      team: JSON.stringify(input),
    })

    const parsed = result.output as z.infer<typeof zodSchema>

    return parsed.keywords.map((str, i) => ({
      id: `temp-${Date.now()}-${i}`,
      name: str,
    }))
  }),
})
