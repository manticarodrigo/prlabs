import { postJournalist } from '@/app/api/journalist/actions'
import { Button } from '@/components/ui/button'
import { InputWithLabel } from '@/components/ui/input'

export default function JournalistCreateForm() {
  return (
    <main className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col justify-center items-center w-full max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold">Add journalist</h1>
        <form
          action={postJournalist}
          className="flex flex-col justify-center space-y-4"
        >
          <InputWithLabel
            name="interviewer"
            label="Which journalist would you like to add? (full name)"
          />
          <InputWithLabel
            name="outlet"
            label="Which website do they write for? (techcrunch.com)"
          />
          <Button>Save journalist</Button>
        </form>
      </div>
    </main>
  )
}
