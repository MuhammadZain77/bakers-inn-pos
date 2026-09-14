import { prisma } from "@/lib/db/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, DollarSign, Calendar } from "lucide-react"

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      branch: true,
      user: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0)
  const totalTax = orders.reduce((sum, o) => sum + Number(o.taxAmount), 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Sales & Order History</h2>
        <p className="text-sm text-gray-500">Real-time audit log of completed checkout transactions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue logged</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Rs. {totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">FBR Tax Collected (18%)</CardTitle>
            <Calendar className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">Rs. {totalTax.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Branch</th>
                <th className="px-6 py-3">Items Count</th>
                <th className="px-6 py-3">FBR Tax</th>
                <th className="px-6 py-3">Total Amount</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono font-medium text-gray-900">FBR-{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4">{order.branch.name}</td>
                  <td className="px-6 py-4">{order.items.reduce((sum, i) => sum + i.quantity, 0)} items</td>
                  <td className="px-6 py-4 text-amber-600">Rs. {Number(order.taxAmount).toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">Rs. {Number(order.totalAmount).toFixed(2)}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}