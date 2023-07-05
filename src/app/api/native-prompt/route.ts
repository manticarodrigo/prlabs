import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const prompt = await request.text()

  const res = await kv.set('native-prompt', prompt)

  return new NextResponse(res)
}
