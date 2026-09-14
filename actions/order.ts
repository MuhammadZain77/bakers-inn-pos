"use server"

import { prisma } from "@/lib/db/prisma"

export async function getOrderDetails(orderId: string) {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      branch: true,
      user: true,
    },
  })
}