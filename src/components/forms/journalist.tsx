import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, PlusCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/components/ui/use-toast'
import { JournalistSchema, JournalistSchemaInput } from '@/schema/journalist'
import { trpc } from '@/util/trpc'

interface Props {
  onSuccess: (id: string) => void
}

export function JournalistForm({ onSuccess }: Props) {
  const form = useForm({ resolver: zodResolver(JournalistSchema) })
  const mutation = trpc.upsertJournalist.useMutation()

  const isLoading = mutation.isLoading || form.formState.isSubmitting

  async function onSubmit(values: JournalistSchemaInput) {
    mutation.mutate(values, {
      onSuccess: (res) => {
        onSuccess(res.id)
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description:
            error.message || 'There was a problem with your request.',
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        })
      },
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
                  placeholder="Enter journalist name..."
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="outlet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Outlet</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  required
                  placeholder="Enter outlet name..."
                  value={field.value || ''}
                />
              </FormControl>
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
          Create journalist
        </Button>
      </form>
    </Form>
  )
}
