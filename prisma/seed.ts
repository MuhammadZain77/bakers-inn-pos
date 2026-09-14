import { config } from 'dotenv'
config() // <-- This explicitly loads your .env file

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// 1. Initialize the standard Postgres connection pool
const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })

// 2. Pass the pool to Prisma's adapter
const adapter = new PrismaPg(pool)

// 3. Initialize Prisma Client with the adapter
const prisma = new PrismaClient({ adapter })

async function main() {
  const mainBranch = await prisma.branch.create({
    data: { name: 'Susan Road', isMain: true, address: 'Susan Road, Faisalabad' },
  })
  
  await prisma.branch.createMany({
    data: [
      { name: 'Gulberg Branch', isMain: false },
      { name: 'Samanabad Branch', isMain: false },
    ],
  })

  const category = await prisma.category.create({
    data: { name: 'General Bakery' },
  })

  const productsData = [
    { name: 'Bread Small', sellingPrice: 100, costPrice: 80 },
    { name: 'Bread Large', sellingPrice: 200, costPrice: 160 },
    { name: 'Multi Grain', sellingPrice: 300, costPrice: 240 },
    { name: 'Drumstick', sellingPrice: 150, costPrice: 102 },
    { name: 'Chicken Bread', sellingPrice: 300, costPrice: 204 },
    { name: 'Pizza', sellingPrice: 250, costPrice: 170 },
    { name: 'VIP Cake', sellingPrice: 1800, costPrice: 1224 },
    { name: 'Biscuits Box', sellingPrice: 300, costPrice: 204 }
  ]

  for (const [index, prod] of productsData.entries()) {
    await prisma.product.create({
      data: {
        sku: `BI-${(index + 1).toString().padStart(4, '0')}`,
        name: prod.name,
        categoryId: category.id,
        sellingPrice: prod.sellingPrice,
        costPrice: prod.costPrice,
      },
    })
  }

  console.log('Database seeded successfully.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})