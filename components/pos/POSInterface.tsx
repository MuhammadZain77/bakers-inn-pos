"use client"

import { useState, useEffect, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Receipt, Trash2, Wifi, WifiOff } from "lucide-react"
import { processCheckout } from "@/actions/checkout"
import { useRouter } from "next/navigation"
import { ReceiptModal } from "@/components/pos/ReceiptModal"
import { offlineDb } from "@/lib/db/offlineDb"
import { syncOfflineOrders } from "@/lib/sync/syncEngine"

type Product = { id: string; name: string; sellingPrice: any }
type CartItem = Product & { quantity: number }

export function POSInterface({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isPending, startTransition] = useTransition()
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      syncOfflineOrders()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  const subtotal = cart.reduce((sum, item) => sum + Number(item.sellingPrice) * item.quantity, 0)
  const fbrTax = subtotal * 0.18 // 18% standard FBR sales tax
  const total = subtotal + fbrTax

  const handleCheckout = () => {
    startTransition(async () => {
      if (!navigator.onLine) {
        // Offline Flow: Store order in IndexedDB
        await offlineDb.pendingOrders.add({
          cart: cart.map((i) => ({
            id: i.id,
            name: i.name,
            quantity: i.quantity,
            price: Number(i.sellingPrice),
          })),
          totalAmount: total,
          taxAmount: fbrTax,
          createdAt: new Date().toISOString(),
          syncStatus: "PENDING",
        })

        setCart([])
        alert("Internet disconnected! Order saved locally in IndexedDB. It will automatically sync to PostgreSQL when connection restores.")
        return
      }

      // Online Flow: Standard server transaction execution
      const formattedCart = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.sellingPrice),
      }))

      const response = await processCheckout(formattedCart, total, fbrTax)

      if (response.success && response.orderId) {
        setCart([])
        setCompletedOrderId(response.orderId)
        router.refresh()
      } else {
        alert(`Checkout failed: ${response.error}`)
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Network Connection Status Bar */}
      <div
        className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium ${isOnline
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
            : "bg-amber-50 text-amber-800 border border-amber-200"
          }`}
      >
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-emerald-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-amber-600 animate-pulse" />
          )}
          <span>
            {isOnline
              ? "System Online — Syncing directly with PostgreSQL"
              : "Offline Mode Active — Orders will queue locally in IndexedDB"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {/* Printable Receipt Modal */}
        {completedOrderId && (
          <ReceiptModal
            orderId={completedOrderId}
            onClose={() => setCompletedOrderId(null)}
          />
        )}

        {/* Product Catalog Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:border-amber-600 transition-all active:scale-95 shadow-sm"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full space-y-2">
                <span className="font-semibold text-gray-900">{product.name}</span>
                <span className="text-emerald-600 font-bold">
                  Rs. {Number(product.sellingPrice).toFixed(2)}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart & Checkout Panel */}
        <Card className="h-fit sticky top-6 border-t-4 border-t-amber-600 shadow-sm">
          <CardHeader className="pb-4 border-b bg-gray-50/50">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <ShoppingCart className="h-5 w-5 text-amber-600" />
              <span>Current Order</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-3 min-h-[250px] max-h-[400px] overflow-y-auto pr-2">
              {cart.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-12">
                  Tap items to build an order.
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm group"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700">{item.name}</span>
                      <span className="text-xs text-gray-400">
                        Rs. {Number(item.sellingPrice).toFixed(2)} x {item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-gray-900">
                        Rs. {(Number(item.sellingPrice) * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>FBR Tax (18%)</span>
                <span>Rs. {fbrTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-900 pt-3 border-t mt-2">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className={`w-full h-12 text-lg ${!isOnline
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              disabled={cart.length === 0 || isPending}
              onClick={handleCheckout}
            >
              {isPending ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <>
                  <Receipt className="h-5 w-5 mr-2" />
                  {isOnline ? "Process Transaction" : "Save Order Offline"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}