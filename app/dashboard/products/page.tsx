import { getProductCatalog } from "@/actions/product"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Tag, DollarSign } from "lucide-react"

export default async function ProductsPage() {
  const products = await getProductCatalog()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Product Catalog</h2>
          <p className="text-sm text-gray-500">Standardized menu items and branch stock overview.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="border-t-4 border-t-amber-600 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900">{product.name}</CardTitle>
              <Package className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-500 gap-1.5">
                  <Tag className="h-4 w-4 text-gray-400" /> Category
                </span>
                <span className="font-medium text-gray-700">{product.category.name}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-500 gap-1.5">
                  <DollarSign className="h-4 w-4 text-gray-400" /> Standard Price
                </span>
                <span className="font-bold text-emerald-600">Rs. {product.sellingPrice.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-1.5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Branch Stock Levels</p>
                <div className="space-y-1">
  {product.inventories.map((inv) => (
    <div key={inv.id} className="flex justify-between text-xs bg-gray-50 px-2.5 py-1.5 rounded">
      <span className="text-gray-600 font-medium">{inv.branch.name}</span>
      <span className={`font-bold ${inv.quantity > 10 ? 'text-gray-800' : 'text-amber-600'}`}>
        {inv.quantity} units
      </span>
    </div>
  ))}
</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}