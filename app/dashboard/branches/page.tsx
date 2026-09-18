import Link from 'next/link'

export default function BranchesPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branch Management</h1>
          <p className="text-muted-foreground mt-1">
            Overview and status of all Baker's Inn locations in Faisalabad.
          </p>
        </div>
        <Link 
          href="/dashboard" 
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mt-6">
        <div className="p-5 border rounded-xl bg-card shadow-sm">
          <h3 className="font-semibold text-lg">Susan Road Branch</h3>
          <p className="text-sm text-gray-500 mt-1">Main Retail & Bakery Operations</p>
          <span className="inline-block mt-3 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Active</span>
        </div>
        <div className="p-5 border rounded-xl bg-card shadow-sm">
          <h3 className="font-semibold text-lg">Gulberg Branch</h3>
          <p className="text-sm text-gray-500 mt-1">Express POS Counter</p>
          <span className="inline-block mt-3 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Active</span>
        </div>
        <div className="p-5 border rounded-xl bg-card shadow-sm">
          <h3 className="font-semibold text-lg">Samanabad Branch</h3>
          <p className="text-sm text-gray-500 mt-1">Order Fulfillment Center</p>
          <span className="inline-block mt-3 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Active</span>
        </div>
      </div>
    </div>
  )
}