import { config } from 'dotenv'
config()

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bakersinn.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@bakersinn.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })
  console.log('Super Admin user created successfully:', admin.email)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
}).finally(() => prisma.$disconnect())