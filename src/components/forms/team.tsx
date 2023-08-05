import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, PlusCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'

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
import { trpc } from '@/lib/trpc'
import { TeamSchema, TeamSchemaInput } from '@/schema/team'
import { onErrorToast } from '@/util/toast'

interface Props {
  team?: TeamSchemaInput
  onSuccess: (id: string) => void
}

export function TeamForm({ team, onSuccess }: Props) {
  const form = useForm({
    resolver: zodResolver(TeamSchema),
    defaultValues: team,
  })
  const mutation = trpc.team.upsert.useMutation()

  const isLoading = mutation.isLoading || form.formState.isSubmitting

  async function onSubmit(values: TeamSchemaInput) {
    mutation.mutate(values, {
      onSuccess: (res) => {
        onSuccess(res.id)
      },
      onError: onErrorToast,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  required
                  placeholder="Enter team name..."
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
                  required
                  placeholder="Enter description..."
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Relevant business, client, or brand information.
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
                  required
                  placeholder="Enter strategy..."
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Key themes or pillars of your company&apos;s external messaging.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 w-4 h-4" />
          )}
          Create team
        </Button>
      </form>
    </Form>
  )
}
