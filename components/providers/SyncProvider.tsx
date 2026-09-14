"use client"

import { useEffect } from "react"
import { syncOfflineOrders } from "@/lib/sync/syncEngine"

export function SyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Run sync immediately on initial load
    syncOfflineOrders()

    // Periodically flush pending orders every 30 seconds if online
    const interval = setInterval(() => {
      if (navigator.onLine) {
        syncOfflineOrders()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return <>{children}</>
}