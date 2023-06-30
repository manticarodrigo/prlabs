import * as React from 'react'

import { cn } from '@/lib/utils'

import { Label } from './label'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }

export function TextareaWithLabel(props: TextareaProps & { label: string }) {
  const { id, name, label } = props
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={id || name}>{label}</Label>
      <Textarea {...props} />
    </div>
  )
}
