import { clerkClient } from '@clerk/nextjs'

export default async function UsersPage() {
  const users = await clerkClient.users.getUserList({ limit: 100 })

  return (
    <main>
      <h1 className="p-2">{`Users (${users.length})`}</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="p-2">
            <h2>
              {user.firstName} {user.lastName}
            </h2>
            <p>{user.emailAddresses[0].emailAddress}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
