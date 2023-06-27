import PrismaEdge from '@prisma/client/edge'

let { PrismaClient } = PrismaEdge

if (process.env.VERCEL_ENV === 'development') {
  PrismaClient = require('@prisma/client').PrismaClient
}

const prisma = (global.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })) as PrismaEdge.PrismaClient

if (process.env.VERCEL_ENV === 'development') {
  global.prisma = prisma
}

export default prisma

export type { Article, Author } from '@prisma/client/edge'
