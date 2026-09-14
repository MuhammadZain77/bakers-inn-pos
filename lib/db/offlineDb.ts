import Dexie, { Table } from 'dexie'

export interface OfflineOrder {
  localId?: number
  cart: Array<{ id: string; name: string; quantity: number; price: number }>
  totalAmount: number
  taxAmount: number
  createdAt: string
  syncStatus: 'PENDING' | 'FAILED'
  error?: string
}

export class POSOfflineDatabase extends Dexie {
  pendingOrders!: Table<OfflineOrder>

  constructor() {
    super('BakersInnOfflineDB')
    this.version(1).stores({
      pendingOrders: '++localId, syncStatus, createdAt'
    })
  }
}

export const offlineDb = new POSOfflineDatabase()