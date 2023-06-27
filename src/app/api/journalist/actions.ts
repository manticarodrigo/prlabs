'use server'

import { getNewsArticles } from '@/lib/newscatcher'
import { redirect } from 'next/navigation'
import { upsertJournalist } from './model'

export async function postJournalist(formData) {
  const entries = Object.fromEntries(formData.entries())

  const { interviewer, outlet } = entries

  if (!interviewer || !outlet) {
    return {
      error: 'Missing required fields. Please update the form and try again.',
    }
  }

  const articles = await getNewsArticles(interviewer, outlet)

  if (!articles || !articles.length) {
    return {
      error: 'No articles found. Please update the form and try again.',
    }
  }

  const journalist = await upsertJournalist(articles)

  redirect(`/journalist/${journalist.id}`)
}
