import { z } from "zod"

import { KeywordSchema } from "./keyword"

export const TeamSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 255 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  strategy: z
    .string()
    .min(10, 'Strategy must be at least 10 characters')
    .max(1000, 'Strategy must be less than 1000 characters'),
  keywords: KeywordSchema.array(),
})

export type TeamSchemaInput = z.infer<typeof TeamSchema>
