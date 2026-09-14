"use client"

import { useState } from "react"
import { useLiveQuery } from "dexie-react-hooks"
import { offlineDb } from "@/lib/db/offlineDb"
import { syncOfflineOrders } from "@/lib/sync/syncEngine"
import { CloudOff, RefreshCw, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OfflineQueueIndicator() {
  const [isSyncing, setIsSyncing] = useState(false)

  // Live query automatically updates the UI instantly whenever Dexie records change
  const pendingCount = useLiveQuery(
    () => offlineDb.pendingOrders.where("syncStatus").equals("PENDING").count(),
    []
  )

  const handleManualSync = async () => {
    setIsSyncing(true)
    await syncOfflineOrders()
    setIsSyncing(false)
  }

  if (pendingCount === undefined || pendingCount === 0) {
    return (
      <div className="flex items-center space-x-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span className="font-medium hidden sm:inline">All Synced</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs text-amber-900">
      <div className="flex items-center space-x-1.5">
        <CloudOff className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
        <span className="font-bold text-amber-700">{pendingCount}</span>
        <span className="hidden sm:inline font-medium">un-synced</span>
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 text-amber-800 hover:bg-amber-200 hover:text-amber-950 rounded-full"
        onClick={handleManualSync}
        disabled={isSyncing}
        title="Force sync now"
      >
        <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
      </Button>
    </div>
  )
}