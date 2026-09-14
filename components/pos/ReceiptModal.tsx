"use client"

import { useEffect, useState } from "react"
import { getOrderDetails } from "@/actions/order"
import { Printer, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ReceiptModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    getOrderDetails(orderId).then(setOrder)
  }, [orderId])

  if (!order) return null

  const fbrInvoiceNo = `FBR-${order.id.slice(-8).toUpperCase()}`
  const qrDataString = `FBR-POS|${fbrInvoiceNo}|${order.totalAmount}|${order.taxAmount}|${new Date(order.createdAt).toISOString()}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(qrDataString)}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 print:p-0 print:bg-white print:absolute print:inset-0">
      <div 
        id="printable-receipt-container" 
        className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 space-y-4 print:p-0 print:shadow-none print:w-full print:m-0"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2 print:hidden">
          <span className="font-bold text-gray-700">FBR Digital Receipt</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Layout */}
        <div id="printable-receipt" className="text-center space-y-3 font-mono text-sm print:text-black">
          <div>
            <h2 className="text-xl font-bold tracking-wider">BAKER'S INN</h2>
            <p className="text-xs text-gray-500 print:text-black">{order.branch?.name || "Susan Road Branch"}</p>
            <p className="text-xs text-gray-500 print:text-black">{order.branch?.address || "Faisalabad, Pakistan"}</p>
          </div>

          <div className="border-t border-b border-dashed py-2 text-left text-xs space-y-1">
            <p><span className="font-semibold">Invoice #:</span> {fbrInvoiceNo}</p>
            <p><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
            <p><span className="font-semibold">Cashier:</span> {order.user?.name || order.user?.email || "Cashier"}</p>
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex justify-between font-bold border-b pb-1 text-xs">
              <span>Item</span>
              <span>Qty x Price</span>
              <span>Total</span>
            </div>
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between text-xs">
                <span className="truncate max-w-[120px]">{item.product.name}</span>
                <span>{item.quantity} x {Number(item.price).toFixed(0)}</span>
                <span>{(item.quantity * Number(item.price)).toFixed(0)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed pt-2 text-xs space-y-1 text-right">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs. {(Number(order.totalAmount) - Number(order.taxAmount)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>FBR Tax (18%):</span>
              <span>Rs. {Number(order.taxAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm border-t pt-1">
              <span>Grand Total:</span>
              <span>Rs. {Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>

          {/* FBR QR Code Verification Section */}
          <div className="flex flex-col items-center pt-3 border-t border-dashed space-y-1">
            <img 
              src={qrCodeUrl} 
              alt="FBR Verification QR Code" 
              className="w-24 h-24 object-contain"
            />
            <p className="text-[10px] text-gray-500 print:text-black font-semibold">FBR POS REGISTRATION: 849201</p>
            <p className="text-[10px] text-gray-400 print:text-black">Scan QR to verify invoice authenticity</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 print:hidden flex gap-2">
          <Button className="w-full bg-slate-900 hover:bg-slate-800" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" /> Print Thermal Receipt
          </Button>
        </div>
      </div>
    </div>
  )
}