import { z } from 'zod'

const ResultReferenceSchema = z.object({
  index: z.number().optional(),
  type: z.string(),
  all: z.boolean(),
})

const MetaUrlSchema = z.object({
  scheme: z.string(),
  netloc: z.string(),
  hostname: z.string(),
  favicon: z.string().url(),
  path: z.string(),
})

const ResultSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  age: z.string().optional(),
  is_source_local: z.boolean(),
  is_source_both: z.boolean(),
  description: z.string(),
  family_friendly: z.boolean(),
  meta_url: MetaUrlSchema,
})

const ThumbnailSchema = z.object({
  src: z.string(),
})

const NewsResultSchema = z.object({
  type: z.literal('news_result'),
  title: z.string(),
  url: z.string(),
  description: z.string(),
  age: z.string(),
  meta_url: MetaUrlSchema,
  thumbnail: ThumbnailSchema,
})

const QuerySchema = z.object({
  original: z.string(),
  spellcheck_off: z.boolean(),
  show_strict_warning: z.boolean(),
})

export const NewsResponseSchema = z.object({
  type: z.literal('news'),
  query: QuerySchema,
  results: z.array(NewsResultSchema),
})

export const SuggestResponseSchema = z.object({
  type: z.string(),
  query: z.object({
    original: z.string(),
  }),
  results: z.array(
    z.object({
      query: z.string(),
    }),
  ),
})

export const SearchResponseSchema = z.object({
  type: z.string(),
  query: z
    .object({
      original: z.string(),
      show_strict_warning: z.boolean(),
      is_navigational: z.boolean().optional(),
      is_news_breaking: z.boolean(),
      spellcheck_off: z.boolean(),
      country: z.string(),
      bad_results: z.boolean(),
      should_fallback: z.boolean(),
      postal_code: z.string(),
      city: z.string(),
      header_country: z.string(),
      more_results_available: z.boolean().optional(),
      state: z.string(),
    })
    .optional(),
  mixed: z
    .object({
      type: z.string(),
      main: z.array(ResultReferenceSchema),
      top: z.array(ResultReferenceSchema),
      side: z.array(ResultReferenceSchema),
    })
    .optional(),
  news: z
    .object({
      type: z.string(),
      results: z.array(
        ResultSchema.extend({
          breaking: z.boolean(),
          thumbnail: z
            .object({
              src: z.string().url(),
            })
            .optional(),
        }),
      ),
      mutated_by_goggles: z.boolean(),
    })
    .optional(),
  web: z
    .object({
      type: z.string(),
      results: z.array(
        ResultSchema.extend({
          language: z.string(),
          type: z.literal('search_result'),
          subtype: z.string(),
          extra_snippets: z.array(z.string()).optional(),
        }),
      ),
      family_friendly: z.boolean(),
    })
    .optional(),
})
