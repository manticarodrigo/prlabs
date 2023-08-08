import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useDebounce } from 'use-debounce'

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
import { MultiSelect } from '@/components/ui/multi-select'
import { Textarea } from '@/components/ui/textarea'
import { Team } from '@/lib/drizzle'
import { trpc } from '@/lib/trpc'
import { TeamSchema, TeamSchemaInput } from '@/schema/team'
import { onErrorToast } from '@/util/toast'

interface Props {
  team?: Team
  onSuccess: (id: string) => void
}

export function TeamForm({ team, onSuccess }: Props) {
  const form = useForm<TeamSchemaInput>({
    resolver: zodResolver(TeamSchema),
    defaultValues: team && TeamSchema.parse(team),
  })

  const values = form.watch()
  const [debounced] = useDebounce(values, 500)

  const query = trpc.keyword.search.useQuery(debounced)
  const mutation = trpc.team.upsert.useMutation()

  const isLoading = mutation.isLoading || form.formState.isSubmitting

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          mutation.mutate(values, {
            onSuccess: (res) => {
              onSuccess(res.id)
            },
            onError: onErrorToast,
          })
        })}
        className="space-y-4"
      >
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

        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <MultiSelect
                  isLoading={query.isLoading}
                  options={(query.data ?? []).map((kw) => ({
                    value: kw.id,
                    label: kw.name,
                  }))}
                  selected={(field.value ?? []).map((kw) => ({
                    value: kw.id ?? kw.name,
                    label: kw.name,
                  }))}
                  onChange={(values) => {
                    field.onChange(
                      values.map((v) => ({
                        id: v.value,
                        name: v.label,
                      })),
                    )
                  }}
                />
              </FormControl>
              <FormDescription>
                Main topics or keywords to use for context search.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          ) : (
            <Save className="mr-2 w-4 h-4" />
          )}
          {team?.id ? 'Update' : 'Create'} team
        </Button>
      </form>
    </Form>
  )
}
