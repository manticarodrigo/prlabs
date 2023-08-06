'use client'

import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'

import { JournalistForm } from '@/components/forms/journalist'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useQueryParams } from '@/hooks/use-query-params'
import { useRouter } from '@/hooks/use-router'
import { Author } from '@/lib/drizzle'

interface JournalistLabelProps {
  journalist?: Author
}

function JournalistLabel({ journalist }: JournalistLabelProps) {
  if (!journalist) {
    return <span className="text-muted-foreground">No journalist selected</span>
  }
  return (
    <>
      <Avatar className="mr-2 h-6 w-6">
        <AvatarFallback className="uppercase text-xs">
          {journalist.name?.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      {journalist.name}
    </>
  )
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface JournalistSwitcherProps extends PopoverTriggerProps {
  journalists?: Author[]
}

const CREATE_ID = 'create'

export function JournalistSwitcher({
  journalists = [],
}: JournalistSwitcherProps) {
  const router = useRouter()
  const params = useParams() ?? {}
  const pathname = usePathname() ?? ''
  const [queryParams, setQueryParams] = useQueryParams()

  const [open, setOpen] = React.useState(false)
  const selectedJournalist = journalists.find(
    (it) => it.id === params.journalist,
  )
  const unselectedJournalists = journalists.filter(
    (it) => it.id !== params.journalist,
  )

  const setShowCreateJournalistDialog = (show: boolean) => {
    if (show) {
      setQueryParams({ journalist: CREATE_ID })
    } else {
      setQueryParams({ journalist: '' })
    }
  }

  const handleJournalistSelect = (id: string) => {
    const journalist = (params.journalist as string) ?? ''
    const hasJournalistInPath = journalist && pathname.includes(journalist)
    const route = hasJournalistInPath
      ? pathname.replace(journalist, id)
      : `journalists/${id}`

    router.push(route)
    setOpen(false)
  }

  if (!params.team) {
    return null
  }

  return (
    <Dialog
      open={queryParams.journalist === CREATE_ID}
      onOpenChange={setShowCreateJournalistDialog}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a journalist"
            className="w-[200px] justify-between"
          >
            <JournalistLabel journalist={selectedJournalist} />
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search journalists..." />
              <CommandEmpty>No journalist found.</CommandEmpty>
              {selectedJournalist && (
                <CommandGroup heading="Selected journalist">
                  <CommandItem
                    value={selectedJournalist.id}
                    className="text-sm"
                  >
                    <JournalistLabel journalist={selectedJournalist} />
                    <Check className="ml-auto h-4 w-4" />
                  </CommandItem>
                </CommandGroup>
              )}
              {unselectedJournalists.length > 0 && (
                <CommandGroup heading="Journalists">
                  {unselectedJournalists.map((journalist) => (
                    <CommandItem
                      key={journalist.id}
                      value={journalist.id}
                      className="text-sm"
                      onSelect={handleJournalistSelect}
                    >
                      <JournalistLabel journalist={journalist} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowCreateJournalistDialog(true)
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create journalist
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create journalist</DialogTitle>
          <DialogDescription>
            Add a new journalist to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <JournalistForm onSuccess={handleJournalistSelect} />
      </DialogContent>
    </Dialog>
  )
}
