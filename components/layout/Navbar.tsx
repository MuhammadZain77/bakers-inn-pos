import { OfflineQueueIndicator } from "@/components/layout/OfflineQueueIndicator"

export function Navbar() {
  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <div className="font-bold text-lg text-slate-800">Baker's Inn POS</div>
      
      {/* Real-time Offline Queue Status Badge */}
      <div className="flex items-center space-x-4">
        <OfflineQueueIndicator />
        {/* User profile / Logout dropdown */}
      </div>
    </header>
  )
}