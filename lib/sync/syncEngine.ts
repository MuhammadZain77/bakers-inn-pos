import { offlineDb } from '@/lib/db/offlineDb'
import { processCheckout } from '@/actions/checkout'

export async function syncOfflineOrders() {
  if (!navigator.onLine) return { synced: 0, pending: await offlineDb.pendingOrders.count() }

  const pending = await offlineDb.pendingOrders
    .where('syncStatus')
    .equals('PENDING')
    .toArray()

  let syncedCount = 0

  for (const order of pending) {
    try {
      const res = await processCheckout(order.cart, order.totalAmount, order.taxAmount)
      
      if (res.success) {
        await offlineDb.pendingOrders.delete(order.localId!)
        syncedCount++
      } else {
        await offlineDb.pendingOrders.update(order.localId!, { 
          syncStatus: 'FAILED', 
          error: res.error 
        })
      }
    } catch (err: any) {
      console.error(`Failed syncing local order #${order.localId}:`, err)
    }
  }

  return { synced: syncedCount, remaining: await offlineDb.pendingOrders.count() }
}