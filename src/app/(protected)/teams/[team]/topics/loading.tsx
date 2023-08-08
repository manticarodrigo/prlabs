import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="container flex flex-col py-6 px-4 w-full min-h-full gap-4 sm:gap-6 overflow-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">
          <Skeleton className="h-4 w-[250px]" />
        </h1>
        <ul className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i}>
              <Badge variant="secondary">
                <div className="h-5 w-[50px]" />
              </Badge>
            </li>
          ))}
        </ul>
      </div>
      <h2 className="text-lg font-bold tracking-tight">
        <Skeleton className="h-4 w-[250px]" />
      </h2>
      <ul className="flex flex-wrap gap-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <li key={i}>
            <Badge variant="outline" className="w-[150px]">
              <div className="h-6 w-[50px]" />
            </Badge>
          </li>
        ))}
      </ul>
      <h2 className="text-lg font-bold tracking-tight">
        <Skeleton className="h-4 w-[250px]" />
      </h2>
      <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i}>
            <Card className="flex flex-col justify-between h-full h-[300]">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-4 w-[250px]" />
                </CardTitle>
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[150px]" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-[150px]" />
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </main>
  )
}
