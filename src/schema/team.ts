import { z } from "zod"

export const CreateClientSchema = z.object({
  name: z
    .string()
    .min(4, 'Name must be at least 4 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z
    .string()
    .min(100, 'Description must be at least 100 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  strategy: z
    .string()
    .min(100, 'Strategy must be at least 100 characters')
    .max(1000, 'Strategy must be less than 1000 characters'),
})

export type CreateClientInput = z.infer<typeof CreateClientSchema>
