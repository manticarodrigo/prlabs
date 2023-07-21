import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Customer } from '@/lib/drizzle'

export default function CustomerCard({ customer }: { customer: Customer }) {
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
