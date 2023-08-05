import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/components/ui/use-toast'

export function onErrorToast(error = undefined) {
  toast({
    variant: 'destructive',
    title: 'Uh oh! Something went wrong.',
    description: error?.message || 'There was a problem with your request.',
    action: <ToastAction altText="Dismiss"> Dismiss </ToastAction>,
  })
}
