"use client"

import { useState, useEffect } from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { offlineDb } from "@/lib/db/offlineDb"
import { syncOfflineOrders } from "@/lib/sync/syncEngine"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  RefreshCw, 
  Trash2, 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Database
} from "lucide-react"

export default function SyncQueuePage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Reactive IndexedDB query updating automatically as Dexie changes
  const queuedOrders = useLiveQuery(() => offlineDb.pendingOrders.toArray(), [])

  const handleSyncAll = async () => {
    setIsSyncing(true)
    await syncOfflineOrders()
    setIsSyncing(false)
  }

  const handleDeleteOrder = async (localId?: number) => {
    if (!localId) return
    if (confirm(`Are you sure you want to delete local queued order #${localId}?`)) {
      await offlineDb.pendingOrders.delete(localId)
    }
  }

  const handleClearAll = async () => {
    if (confirm("Warning: This will clear all queued orders from local storage. Continue?")) {
      await offlineDb.pendingOrders.clear()
    }
  }

  const pendingCount = queuedOrders?.filter((o) => o.syncStatus === "PENDING").length || 0
  const failedCount = queuedOrders?.filter((o) => o.syncStatus === "FAILED").length || 0

  return (
    <div className="p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offline Sync Queue</h1>
          <p className="text-sm text-gray-500">
            Monitor and flush transactions stored in local IndexedDB during network outages.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={handleSyncAll}
            disabled={isSyncing || !isOnline || pendingCount === 0}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Flushing Queue..." : "Sync All Now"}
          </Button>

          {queuedOrders && queuedOrders.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 border-red-200"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Clear Queue
            </Button>
          )}
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Network State</CardTitle>
            {isOnline ? (
              <Wifi className="h-4 w-4 text-emerald-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-amber-600 animate-pulse" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isOnline ? "Online" : "Offline Mode"}</div>
            <p className="text-xs text-gray-500 mt-1">
              {isOnline ? "Ready to push records to Neon PostgreSQL" : "Local queue active"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Sync</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
            <p className="text-xs text-gray-500 mt-1">Orders waiting for upload</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Failed Retries</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
            <p className="text-xs text-gray-500 mt-1">Orders requiring audit</p>
          </CardContent>
        </Card>
      </div>

      {/* Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Database className="h-5 w-5 text-amber-600" />
            <span>Local Database Transactions ({queuedOrders?.length || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!queuedOrders || queuedOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <p className="font-medium text-gray-700">No pending orders in browser storage</p>
              <p className="text-xs">All offline transactions are fully synchronized with PostgreSQL.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 border-b text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">Local ID</th>
                    <th className="px-4 py-3">Created At</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3">Sync Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {queuedOrders.map((order) => (
                    <tr key={order.localId} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-mono font-bold">#{order.localId}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {order.cart.length} item(s)
                          </span>
                          <span className="text-xs text-gray-400 truncate max-w-[200px]">
                            {order.cart.map((i) => `${i.name} (x${i.quantity})`).join(", ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">
                        Rs. {order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        {order.syncStatus === "PENDING" ? (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                            PENDING
                          </Badge>
                        ) : (
                          <div className="flex flex-col space-y-1">
                            <Badge className="bg-red-100 text-red-800 border-red-200 w-fit">
                              FAILED
                            </Badge>
                            {order.error && (
                              <span
                                className="text-[10px] text-red-600 max-w-[150px] truncate"
                                title={order.error}
                              >
                                {order.error}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteOrder(order.localId)}
                          className="text-red-400 hover:text-red-600 p-1"
                          title="Delete from local queue"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}