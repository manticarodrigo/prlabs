'use server'

import { getNewsArticles } from '@/lib/newscatcher'
import { redirect } from 'next/navigation'
import { upsertJournalist } from './model'

export async function postJournalist(data) {
  const entries = Object.fromEntries(data.entries())

  const { interviewer, outlet } = entries

  const articles = await getNewsArticles(interviewer, outlet)
  const journalist = await upsertJournalist(articles)

  redirect(`/journalist/${journalist.id}`)
}
