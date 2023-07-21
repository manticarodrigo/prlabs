'use server'

import { auth } from '@clerk/nextjs'
import { createId } from '@paralleldrive/cuid2'
import { NextRequest, NextResponse } from 'next/server'

import { db, schema } from '@/lib/drizzle'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'You must be logged in to create a customer.',
    }
  }

  const { name, description, strategy } = await request.json()

  const [customer] = await db
    .insert(schema.customer)
    .values({
      id: createId(),
      userId,
      name,
      description,
      strategy,
      updatedAt: new Date().toISOString(),
    })
    .returning({ id: schema.customer.id })

  return NextResponse.json(customer)
}
