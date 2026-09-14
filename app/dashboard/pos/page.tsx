import { getProductCatalog } from "@/actions/product"
import { POSInterface } from "@/components/pos/POSInterface"

export default async function POSPage() {
  const products = await getProductCatalog()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Point of Sale</h2>
        <p className="text-sm text-gray-500">Live checkout and receipt generation.</p>
      </div>

      <POSInterface products={products} />
    </div>
  )
}