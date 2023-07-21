'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const createCustomerSchema = z.object({
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

type CreateCustomerInput = z.infer<typeof createCustomerSchema>

export const runtime = 'edge'

export default function CustomerCreatePage() {
  const router = useRouter()

  const form = useForm<CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(values: CreateCustomerInput) {
    const res = await fetch('/api/customer', {
      method: 'POST',
      body: JSON.stringify(values),
    })

    const customer = await res.json()

    router.push(`/customer/${customer.id}`)
  }

  return (
    <main className="flex justify-center items-center p-8 w-full min-h-full">
      <div className="flex flex-col justify-center items-center w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-bold">Create customer profile</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter name..."
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter description..."
                      className="min-h-[200px]"
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Please provide the products or services the company
                    provides, their target audience, and any other relevant
                    business / client information.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="strategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strategy</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter strategy..."
                      className="min-h-[200px]"
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Please provide a high-level overview of your strategic
                    communication objectives, indicating the key themes or
                    pillars of your company&apos;s external messaging.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 w-4 h-4" />
              )}
              Add customer
            </Button>
          </form>
        </Form>
      </div>
    </main>
  )
}
