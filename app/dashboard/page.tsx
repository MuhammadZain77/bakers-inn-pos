import { prisma } from "@/lib/db/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/authOptions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Package, Layers, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  // Fetch live counts for summary widgets
  const branchCount = await prisma.branch.count()
  const productCount = await prisma.product.count()
  const categoryCount = await prisma.category.count()
  const userCount = await prisma.user.count()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome back, {session?.user?.name || "Admin"}!
        </h2>
        <p className="text-sm text-gray-500">
          Here is a real-time overview of operations across Baker's Inn locations.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Branches</CardTitle>
            <Building2 className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{branchCount}</div>
            <p className="text-xs text-gray-500 mt-1">Susan Road, Gulberg, Samanabad</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
            <Package className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
            <p className="text-xs text-gray-500 mt-1">Standardized menu items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Categories</CardTitle>
            <Layers className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryCount}</div>
            <p className="text-xs text-gray-500 mt-1">Bakery classifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">System Users</CardTitle>
            <Users className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
            <p className="text-xs text-gray-500 mt-1">Authorized personnel</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:border-amber-600 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">Branch Network Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Inspect the parent-child relationship and status of all Baker's Inn locations in Faisalabad.
            </p>
            <Link 
              href="/dashboard/branches" 
              className={`${buttonVariants({ variant: "outline" })} flex items-center space-x-2 w-fit`}
            >
              <span>Manage Branches</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-amber-600 transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">POS & Inventory Operations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Manage product pricing, stock levels, and real-time checkout sequences.
            </p>
            <Link 
              href="/pos" 
              className={`${buttonVariants({ variant: "default" })} flex items-center space-x-2 w-fit bg-amber-600 hover:bg-amber-700 text-white`}
            >
              <span>Launch POS Core Module</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}