import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

export const prismaMigrations = pgTable('_prisma_migrations', {
  id: varchar('id', { length: 36 }).primaryKey().notNull(),
  checksum: varchar('checksum', { length: 64 }).notNull(),
  finishedAt: timestamp('finished_at', { withTimezone: true, mode: 'string' }),
  migrationName: varchar('migration_name', { length: 255 }).notNull(),
  logs: text('logs'),
  rolledBackAt: timestamp('rolled_back_at', {
    withTimezone: true,
    mode: 'string',
  }),
  startedAt: timestamp('started_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  appliedStepsCount: integer('applied_steps_count').notNull(),
})

export const articleAnalysis = pgTable('ArticleAnalysis', {
  id: text('id').primaryKey().notNull(),
  content: text('content').notNull(),
  articleId: text('articleId')
    .notNull()
    .references(() => article.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' }).notNull(),
})

export const author = pgTable(
  'Author',
  {
    id: text('id').primaryKey().notNull(),
    name: text('name'),
    outlet: text('outlet'),
  },
  (table) => {
    return {
      nameOutletKey: uniqueIndex('Author_name_outlet_key').on(
        table.name,
        table.outlet,
      ),
    }
  },
)

export const article = pgTable(
  'Article',
  {
    id: text('id').primaryKey().notNull(),
    title: text('title'),
    publishedDate: timestamp('published_date', {
      precision: 3,
      mode: 'string',
    }),
    publishedDatePrecision: text('published_date_precision'),
    link: text('link'),
    cleanUrl: text('clean_url'),
    excerpt: text('excerpt'),
    summary: text('summary'),
    rights: text('rights'),
    rank: integer('rank'),
    topic: text('topic'),
    country: text('country'),
    language: text('language'),
    authors: text('authors'),
    media: text('media'),
    isOpinion: boolean('is_opinion'),
    twitterAccount: text('twitter_account'),
    externalScore: doublePrecision('external_score'),
    externalId: text('external_id'),
    authorId: text('authorId').references(() => author.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
    createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    }).notNull(),
  },
  (table) => {
    return {
      externalIdKey: uniqueIndex('Article_external_id_key').on(
        table.externalId,
      ),
    }
  },
)
