import { z } from "zod"

export const KeywordSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(20, 'Name must be less than 20 characters'),
})

export type KeywordSchemaInput = z.infer<typeof KeywordSchema>
