import { config } from 'dotenv'
config() // Load .env variables for the Prisma CLI

import { defineConfig } from '@prisma/config'

export default defineConfig({
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'npx ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
})