import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query'],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()
export const db = prisma

<<<<<<< HEAD
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
=======
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
>>>>>>> d7b14eb (Initial commit: OyaLandlord Backend Migration & Dockerization)
