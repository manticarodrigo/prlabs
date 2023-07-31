import { z } from "zod"

export const TeamSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 255 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must be less than 255 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  strategy: z
    .string()
    .min(10, 'Strategy must be at least 10 characters')
    .max(1000, 'Strategy must be less than 1000 characters'),
})

export type TeamSchemaInput = z.infer<typeof TeamSchema>
