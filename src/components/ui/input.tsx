import * as React from 'react'

import { cn } from '@/lib/utils'

import { Label } from './label'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }

export function InputWithLabel(props: InputProps & { label: string }) {
  const { id, name, label } = props
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={id || name}>{label}</Label>
      <Input {...props} />
    </div>
  )
}
