import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Team } from '@/lib/drizzle'

export default function TeamCard({ customer }: { customer: Team }) {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-lg">{customer.name}</CardTitle>
        <CardDescription>{customer.description}</CardDescription>
      </CardHeader>
      <CardContent>{customer.strategy}</CardContent>
    </Card>
  )
}
