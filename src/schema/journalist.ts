import { z } from "zod"

export const JournalistSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 255 characters'),
  outlet: z
    .string()
    .min(2, 'Outlet must be at least 2 characters')
    .max(100, 'Outlet must be less than 255 characters'),
})

export type JournalistSchemaInput = z.infer<typeof JournalistSchema>
