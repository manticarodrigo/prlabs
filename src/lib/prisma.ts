const { PrismaClient } =
  process.env.NODE_ENV === 'development'
    ? require('@prisma/client')
    : require('@prisma/client/edge')

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma
