import { config } from 'dotenv'
config()

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const branches = await prisma.branch.findMany()
  const products = await prisma.product.findMany()

  if (branches.length === 0 || products.length === 0) {
    console.log("No branches or products found to seed inventory.")
    return
  }

  for (const product of products) {
    for (const branch of branches) {
      await prisma.inventory.upsert({
        where: {
          branchId_productId: {
            branchId: branch.id,
            productId: product.id,
          },
        },
        update: {},
        create: {
          branchId: branch.id,
          productId: product.id,
          quantity: Math.floor(Math.random() * 40) + 15, // Random initial stock between 15 and 55
        },
      })
    }
  }
  console.log('Branch inventories seeded successfully!')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(() => prisma.$disconnect())