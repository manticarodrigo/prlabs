import { relations } from 'drizzle-orm'
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
      nameOutletKey: uniqueIndex().on(
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
    published_date: timestamp('published_date', {
      precision: 3,
      mode: 'string',
    }),
    published_date_precision: text('published_date_precision'),
    link: text('link'),
    clean_url: text('clean_url'),
    excerpt: text('excerpt'),
    summary: text('summary'),
    rights: text('rights'),
    rank: integer('rank'),
    topic: text('topic'),
    country: text('country'),
    language: text('language'),
    authors: text('authors'),
    media: text('media'),
    is_opinion: boolean('is_opinion'),
    twitter_account: text('twitter_account'),
    external_score: doublePrecision('external_score'),
    external_id: text('external_id'),
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
      externalIdKey: uniqueIndex().on(
        table.external_id,
      ),
    }
  },
)

export const keyword = pgTable('Keyword', {
  id: varchar('id').primaryKey().notNull(),
  name: varchar('name').notNull().unique(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
})

export const team = pgTable('Team', {
  id: varchar('id').primaryKey().notNull(),
  userId: varchar('userId').notNull(),
  name: varchar('name'),
  description: text('description'),
  strategy: text('strategy'),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', {
    precision: 3,
    mode: 'string',
  }).notNull(),
})

export const teamKeywords = pgTable(
  'TeamKeywords',
  {
    teamId: varchar('teamId').notNull().references(() => team.id),
    keywordId: varchar('keywordId').notNull().references(() => keyword.id),
  },
  (t) => ({
    pk: uniqueIndex().on(t.teamId, t.keywordId),
  }),
)

export const teamRelations = relations(team, ({ many }) => ({
  keywords: many(teamKeywords),
}))

export const keywordRelations = relations(keyword, ({ many }) => ({
  teams: many(teamKeywords),
}))

export const teamKeywordsRelations = relations(teamKeywords, ({ one }) => ({
  team: one(team, {
    fields: [teamKeywords.teamId],
    references: [team.id],
  }),
  keyword: one(keyword, {
    fields: [teamKeywords.keywordId],
    references: [keyword.id],
  }),
}));

export const authorRelations = relations(author, ({ many }) => ({
  articles: many(article),
}))

export const articleRelations = relations(article, ({ one, many }) => ({
  author: one(author, {
    fields: [article.authorId],
    references: [author.id],
  }),
  analyses: many(articleAnalysis),
}))

export const articleAnalysisRelations = relations(
  articleAnalysis,
  ({ one }) => ({
    article: one(article, {
      fields: [articleAnalysis.articleId],
      references: [article.id],
    }),
  }),
)
