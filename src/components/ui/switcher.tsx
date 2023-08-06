import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface SwitcherProps {
  labels: {
    button: string
    placeholder: string
    empty: string
    selected: string
    heading: string
    create: string
  }
  value?: string | undefined
  options: { label: string; value: string }[]
  renderOption?: (option?: { label: string; value: string }) => React.ReactNode
  onSelect: (value: string) => void
  onCreate: () => void
}

export function Switcher({
  labels,
  value,
  options,
  renderOption = (option) => option?.label,
  onSelect,
  onCreate,
}: SwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const selectedOption = options.find((it) => it.value === value)
  const unselectedOptions = options.filter((it) => it.value !== value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={labels.button}
          className="w-[120px] sm:w-[200px] justify-between"
        >
          {renderOption(selectedOption)}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder={labels.placeholder} />
            <CommandEmpty>{labels.empty}</CommandEmpty>
            {selectedOption && (
              <CommandGroup heading={labels.selected}>
                <CommandItem value={selectedOption.value} className="text-sm">
                  {renderOption(selectedOption)}
                  <Check className="ml-auto h-4 w-4" />
                </CommandItem>
              </CommandGroup>
            )}
            {unselectedOptions.length > 0 && (
              <CommandGroup heading={labels.heading}>
                {unselectedOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    className="text-sm"
                    onSelect={(v) => {
                      setOpen(false)
                      onSelect(v)
                    }}
                  >
                    {renderOption(option)}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  onCreate()
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                {labels.create}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
