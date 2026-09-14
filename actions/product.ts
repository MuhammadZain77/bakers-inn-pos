"use server"

import { prisma } from "@/lib/db/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/authOptions"

export async function getProductCatalog() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Unauthorized")

  // Fetch products with their categories and branch inventories
  return await prisma.product.findMany({
    include: {
      category: true,
      inventories: {
        include: {
          branch: true,
        },
      },
    },
    orderBy: { name: "asc" },
  })
}