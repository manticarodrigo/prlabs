import { kv } from '@vercel/kv'

import { NativePromptForm } from '@/components/forms/native-prompt'

export default async function NativePromptPage() {
  const prompt = (await kv.get('native-prompt')).toString()

  return (
    <main className="flex justify-center items-center w-full h-full overflow-auto">
      <NativePromptForm prompt={prompt} />
    </main>
  )
}
