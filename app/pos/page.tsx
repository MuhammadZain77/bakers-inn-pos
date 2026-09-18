'use client'

import React, { useState, useMemo } from 'react'
import {
  ShoppingBag,
  Package,
  Receipt,
  BarChart3,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  Wifi,
  WifiOff,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  User,
  X,
  Store,
  ArrowRight
} from 'lucide-react'

const INITIAL_BRANCHES = [
  { id: 'susan-road', name: 'Susan Road (Main)', address: '86 Susan Rd, Kohinoor City, Faisalabad', phone: '+92 41 8712345' },
  { id: 'gulberg', name: 'Gulberg (Express)', address: 'Main Boulevard, Gulberg, Faisalabad', phone: '+92 41 5389012' },
  { id: 'samanabad', name: 'Samanabad (Fulfillment)', address: 'Main Market, Samanabad, Faisalabad', phone: '+92 41 2678901' },
]

const INITIAL_CATEGORIES = [
  'All Items',
  'Breads & Buns',
  'Cakes & Pastries',
  'Savory & Snacks',
  'Sweets',
  'Beverages'
]

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    sku: 'BI-BRD-001',
    name: 'Fresh Milk Bread',
    category: 'Breads & Buns',
    costPrice: 160,
    price: 220,
    icon: '🍞',
    minStock: 15,
    stock: { 'susan-road': 42, 'gulberg': 18, 'samanabad': 25 }
  },
  {
    id: 'prod-2',
    sku: 'BI-CAK-002',
    name: 'Chocolate Mousse Cake 2lbs',
    category: 'Cakes & Pastries',
    costPrice: 1250,
    price: 1850,
    icon: '🎂',
    minStock: 5,
    stock: { 'susan-road': 12, 'gulberg': 4, 'samanabad': 8 }
  },
  {
    id: 'prod-3',
    sku: 'BI-SNK-003',
    name: 'Chicken Patties (Special)',
    category: 'Savory & Snacks',
    costPrice: 75,
    price: 120,
    icon: '🥐',
    minStock: 30,
    stock: { 'susan-road': 85, 'gulberg': 32, 'samanabad': 40 }
  },
  {
    id: 'prod-4',
    sku: 'BI-CAK-004',
    name: 'Almond Croissant',
    category: 'Cakes & Pastries',
    costPrice: 180,
    price: 280,
    icon: '🥐',
    minStock: 10,
    stock: { 'susan-road': 24, 'gulberg': 9, 'samanabad': 15 }
  },
  {
    id: 'prod-5',
    sku: 'BI-CAK-005',
    name: 'Traditional Fruit Cake',
    category: 'Cakes & Pastries',
    costPrice: 290,
    price: 450,
    icon: '🍰',
    minStock: 8,
    stock: { 'susan-road': 19, 'gulberg': 6, 'samanabad': 11 }
  },
  {
    id: 'prod-6',
    sku: 'BI-SNK-006',
    name: 'Supreme Pizza Slice',
    category: 'Savory & Snacks',
    costPrice: 150,
    price: 250,
    icon: '🍕',
    minStock: 20,
    stock: { 'susan-road': 35, 'gulberg': 14, 'samanabad': 22 }
  },
  {
    id: 'prod-7',
    sku: 'BI-SWT-007',
    name: 'Gulab Jamun Premium 1kg',
    category: 'Sweets',
    costPrice: 750,
    price: 1100,
    icon: '🍬',
    minStock: 10,
    stock: { 'susan-road': 16, 'gulberg': 7, 'samanabad': 14 }
  },
  {
    id: 'prod-8',
    sku: 'BI-BEV-008',
    name: 'Hot Cappuccino (Regular)',
    category: 'Beverages',
    costPrice: 190,
    price: 380,
    icon: '☕',
    minStock: 50,
    stock: { 'susan-road': 120, 'gulberg': 60, 'samanabad': 90 }
  },
]

const INITIAL_INVOICES = [
  {
    id: 'INV-2026-9041',
    fbrRef: 'FBR-POS-998234-9041',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    branchId: 'susan-road',
    branchName: 'Susan Road (Main)',
    cashier: 'Super Admin',
    orderType: 'Takeaway',
    items: [
      { name: 'Fresh Milk Bread', qty: 2, price: 220 },
      { name: 'Chicken Patties (Special)', qty: 4, price: 120 }
    ],
    subtotal: 920,
    tax: 165.6,
    discount: 0,
    total: 1085.6,
    paymentMethod: 'Cash',
    syncStatus: 'synced'
  }
]

export default function POSPage() {
  const [activeTab, setActiveTab] = useState('pos')
  const [selectedBranchId, setSelectedBranchId] = useState('susan-road')
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [invoices, setInvoices] = useState(INITIAL_INVOICES)
  
  // Offline Engine State
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: string } | null>(null)

  // Cart State
  const [cart, setCart] = useState<Array<{ product: typeof INITIAL_PRODUCTS[0]; quantity: number }>>([])
  const [orderType, setOrderType] = useState('Takeaway')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [cashTendered, setCashTendered] = useState('')

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Items')

  // Receipt Modal State
  const [receiptModalInvoice, setReceiptModalInvoice] = useState<typeof INITIAL_INVOICES[0] | null>(null)

  const currentBranch = useMemo(() => {
    return INITIAL_BRANCHES.find(b => b.id === selectedBranchId) || INITIAL_BRANCHES[0]
  }, [selectedBranchId])

  const showToast = (text: string, type = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 4000)
  }

  const toggleOfflineMode = () => {
    if (isOfflineMode) {
      setIsOfflineMode(false)
      const queuedCount = invoices.filter(inv => inv.syncStatus === 'queued').length
      if (queuedCount > 0) {
        setIsSyncing(true)
        setTimeout(() => {
          setInvoices(prev =>
            prev.map(inv => (inv.syncStatus === 'queued' ? { ...inv, syncStatus: 'synced' } : inv))
          )
          setIsSyncing(false)
          showToast(`Successfully synced ${queuedCount} offline invoice(s) with FBR!`, 'success')
        }, 1500)
      } else {
        showToast('System is now ONLINE. FBR connection restored.', 'info')
      }
    } else {
      setIsOfflineMode(true)
      showToast('OFFLINE Mode activated. Local sales will queue for FBR sync.', 'warning')
    }
  }

  const addToCart = (product: typeof INITIAL_PRODUCTS[0]) => {
    const currentStock = product.stock[selectedBranchId as keyof typeof product.stock] || 0
    const existingIndex = cart.findIndex(item => item.product.id === product.id)
    const currentQtyInCart = existingIndex > -1 ? cart[existingIndex].quantity : 0

    if (currentQtyInCart + 1 > currentStock) {
      showToast(`Cannot add more. Max stock available at ${currentBranch.name}: ${currentStock}`, 'warning')
      return
    }

    if (existingIndex > -1) {
      const updated = [...cart]
      updated[existingIndex].quantity += 1
      setCart(updated)
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const updateCartQuantity = (productId: string, delta: number) => {
    const existingIndex = cart.findIndex(item => item.product.id === productId)
    if (existingIndex === -1) return

    const item = cart[existingIndex]
    const currentStock = item.product.stock[selectedBranchId as keyof typeof item.product.stock] || 0
    const newQty = item.quantity + delta

    if (newQty > currentStock) {
      showToast(`Stock limit reached for ${item.product.name}`, 'warning')
      return
    }

    if (newQty <= 0) {
      setCart(cart.filter(i => i.product.id !== productId))
    } else {
      const updated = [...cart]
      updated[existingIndex].quantity = newQty
      setCart(updated)
    }
  }

  const cartSubtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart])
  const discountAmount = useMemo(() => (cartSubtotal * discountPercent) / 100, [cartSubtotal, discountPercent])
  const fbrTax = useMemo(() => (cartSubtotal - discountAmount) * 0.18, [cartSubtotal, discountAmount])
  const grandTotal = useMemo(() => cartSubtotal - discountAmount + fbrTax, [cartSubtotal, discountAmount, fbrTax])

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Cart is empty. Please add items to checkout.', 'warning')
      return
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const newInvoice = {
      id: `INV-2026-${randomSuffix}`,
      fbrRef: `FBR-POS-998234-${randomSuffix}`,
      timestamp: new Date().toISOString(),
      branchId: selectedBranchId,
      branchName: currentBranch.name,
      cashier: 'Super Admin',
      orderType,
      items: cart.map(item => ({
        name: item.product.name,
        qty: item.quantity,
        price: item.product.price
      })),
      subtotal: cartSubtotal,
      tax: fbrTax,
      discount: discountAmount,
      total: grandTotal,
      paymentMethod,
      syncStatus: isOfflineMode ? 'queued' : 'synced'
    }

    setInvoices([newInvoice, ...invoices])
    setReceiptModalInvoice(newInvoice)
    setCart([])
    setCashTendered('')
    setDiscountPercent(0)
    showToast(isOfflineMode ? 'Sale queued offline!' : 'Sale completed and verified with FBR!', isOfflineMode ? 'warning' : 'success')
  }

  const offlineQueuedCount = useMemo(() => invoices.filter(inv => inv.syncStatus === 'queued').length, [invoices])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col antialiased">
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-semibold ${
          toastMessage.type === 'warning' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
        }`}>
          {toastMessage.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 text-white border-b border-amber-600/30 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white font-black text-xl">
                🍞
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-white">Baker's Inn POS</h1>
                <p className="text-xs text-slate-400">Faislabad Multi-Branch & FBR Retail Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="bg-transparent text-slate-100 focus:outline-none cursor-pointer"
                >
                  {INITIAL_BRANCHES.map(b => (
                    <option key={b.id} value={b.id} className="bg-slate-900 text-slate-100">{b.name}</option>
                  ))}
                </select>
              </div>

              <div onClick={toggleOfflineMode} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer bg-slate-800 border-slate-700">
                {isOfflineMode ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
                <span>Queue: {offlineQueuedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Catalog */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search bakery items by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {INITIAL_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                      selectedCategory === cat ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {products
                .filter(p => selectedCategory === 'All Items' || p.category === selectedCategory)
                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(product => {
                  const currentBranchStock = product.stock[selectedBranchId as keyof typeof product.stock] || 0
                  const isOutOfStock = currentBranchStock <= 0

                  return (
                    <div
                      key={product.id}
                      onClick={() => !isOutOfStock && addToCart(product)}
                      className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col justify-between transition cursor-pointer ${
                        isOutOfStock ? 'opacity-60 bg-slate-50 border-slate-200' : 'border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">{product.sku}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                          {isOutOfStock ? 'Out of Stock' : `${currentBranchStock} left`}
                        </span>
                      </div>
                      <div className="my-2 flex items-center justify-center h-16 text-3xl">{product.icon}</div>
                      <h3 className="font-bold text-slate-800 text-sm">{product.name}</h3>
                      <div className="mt-3 pt-3 border-t flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-sm">Rs. {product.price}</span>
                        <button disabled={isOutOfStock} className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Checkout Cart */}
          <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-lg p-5 space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-extrabold text-slate-900 text-base">Current Order</h2>
              {cart.length > 0 && (
                <button onClick={() => setCart([])} className="text-xs text-red-500 flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto space-y-3">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <ShoppingBag className="w-10 h-10 mx-auto text-amber-600 opacity-40 mb-2" />
                  <p className="text-xs font-medium">Your cart is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between p-2.5 bg-slate-50 border rounded-xl">
                    <div>
                      <h4 className="text-xs font-bold">{item.product.name}</h4>
                      <span className="text-[11px] text-slate-500">Rs. {item.product.price} × {item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white border rounded-lg p-0.5">
                      <button onClick={() => updateCartQuantity(item.product.id, -1)} className="w-6 h-6 flex items-center justify-center">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.product.id, 1)} className="w-6 h-6 flex items-center justify-center">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-3 border-t space-y-2 text-xs">
                <div className="flex justify-between"><span>Subtotal:</span><span>Rs. {cartSubtotal.toFixed(0)}</span></div>
                <div className="flex justify-between"><span>FBR GST (18%):</span><span>Rs. {fbrTax.toFixed(0)}</span></div>
                <div className="flex justify-between text-base font-bold text-slate-900 border-t pt-2">
                  <span>Total:</span><span>Rs. {grandTotal.toFixed(0)}</span>
                </div>
                <button onClick={handleCheckout} className="w-full py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition">
                  Complete Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Receipt Thermal Modal */}
      {receiptModalInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="font-bold text-sm">FBR Thermal Receipt</span>
              <button onClick={() => setReceiptModalInvoice(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 text-slate-900 font-mono text-xs space-y-4 bg-amber-50/20 max-h-[75vh] overflow-y-auto">
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
                <h2 className="font-black text-base uppercase tracking-tight text-amber-900">Baker's Inn POS</h2>
                <p className="text-[11px] text-slate-600 font-sans font-bold">{receiptModalInvoice.branchName}</p>
                <p className="text-[10px] text-slate-500 font-sans">
                  {INITIAL_BRANCHES.find(b => b.id === receiptModalInvoice.branchId)?.address}
                </p>
                <p className="text-[10px] text-slate-500 font-sans">FBR Reg No: NTR/FBR-POS-998234</p>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between"><span>Invoice:</span><strong>{receiptModalInvoice.id}</strong></div>
                <div className="flex justify-between"><span>FBR Ref:</span><span className="font-bold">{receiptModalInvoice.fbrRef}</span></div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t flex gap-2">
              <button onClick={() => window.print()} className="flex-1 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}