'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

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
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  prompt: z.string().min(100),
})

export function NativePromptForm({ prompt }: { prompt: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch('/api/native-prompt', {
      method: 'POST',
      body: values.prompt,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Native Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter prompt..."
                  className="min-h-[400px]"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                This is the prompt used to analyze a single journalist article.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
