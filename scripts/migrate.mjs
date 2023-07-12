import { sql } from '@vercel/postgres'
import * as dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/vercel-postgres'
import { migrate } from 'drizzle-orm/vercel-postgres/migrator'

dotenv.config({ path: '.env.local' })

const db = drizzle(sql)

await migrate(db, { migrationsFolder: 'drizzle' })

process.exit(0)
