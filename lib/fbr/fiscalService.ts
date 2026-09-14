export interface FBRItem {
  ItemCode: string
  ItemName: string
  Quantity: number
  PCTCode: string
  TaxRate: number
  SaleValue: number
  TotalAmount: number
  TaxCharged: number
}

export interface FBRPayload {
  POSID: number
  USIN: string
  DateTime: string
  TotalQuantity: number
  BillAmount: number
  TotalTaxCharged: number
  TotalAmount: number
  PaymentMode: number
  Items: FBRItem[]
}

export function buildFBRPayload(
  cart: Array<{ id: string; name: string; quantity: number; price: number }>,
  totalAmount: number,
  taxAmount: number
): FBRPayload {
  const billAmount = totalAmount - taxAmount

  return {
    POSID: Number(process.env.FBR_POS_ID || 849201),
    USIN: `BI-${Date.now()}`,
    DateTime: new Date().toISOString(),
    TotalQuantity: cart.reduce((acc, item) => acc + item.quantity, 0),
    BillAmount: Math.round(billAmount * 100) / 100,
    TotalTaxCharged: Math.round(taxAmount * 100) / 100,
    TotalAmount: Math.round(totalAmount * 100) / 100,
    PaymentMode: 1, // 1 = Cash
    Items: cart.map((item) => {
      const saleValue = item.price * item.quantity
      const itemTax = saleValue * 0.18
      return {
        ItemCode: item.id.slice(-6).toUpperCase(),
        ItemName: item.name,
        Quantity: item.quantity,
        PCTCode: "11000000",
        TaxRate: 18.0,
        SaleValue: Math.round(saleValue * 100) / 100,
        TotalAmount: Math.round((saleValue + itemTax) * 100) / 100,
        TaxCharged: Math.round(itemTax * 100) / 100,
      }
    }),
  }
}