"use server"

import { prisma } from "@/lib/db/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/authOptions"

type CartItem = { id: string; quantity: number; price: number }

export async function processCheckout(cart: CartItem[], totalAmount: number, taxAmount: number) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false, error: "Unauthorized" }

  try {
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!dbUser) return { success: false, error: "User not found" }

    let branchId = dbUser.branchId
    if (!branchId) {
      const fallbackBranch = await prisma.branch.findFirst()
      if (!fallbackBranch) return { success: false, error: "No branch found" }
      branchId = fallbackBranch.id
    }

    // Mock/Live FBR Payload Structure
    const fbrPayload = {
      POSID: 849201,
      USIN: `USIN-${Date.now()}`,
      DateTime: new Date().toISOString(),
      BillAmount: totalAmount - taxAmount,
      TotalQuantity: cart.reduce((acc, item) => acc + item.quantity, 0),
      PCTCode: "11000000",
      TaxAmount: taxAmount,
      TotalAmount: totalAmount,
      InvoiceType: 1
    }

    // Simulate external FBR response hash (or real fetch with 3s AbortController timeout)
    const fbrInvoiceNumber = `FBR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          totalAmount,
          taxAmount,
          branchId,
          userId: dbUser.id,
          items: {
            create: cart.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      })

      for (const item of cart) {
        await tx.inventory.updateMany({
          where: { branchId, productId: item.id },
          data: { quantity: { decrement: item.quantity } }
        })
      }

      return order
    })

    return { success: true, orderId: result.id, fbrInvoiceNumber }
  } catch (error: any) {
    return { success: false, error: error.message || "Checkout failed" }
  }
}