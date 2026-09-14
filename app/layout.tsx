import type { Metadata } from "next"
import "./globals.css"
import { SyncProvider } from "@/components/providers/SyncProvider"

export const metadata: Metadata = {
  title: "Baker's Inn POS",
  description: "Multi-branch POS and inventory management system",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 font-sans antialiased">
        <SyncProvider>
          {children}
        </SyncProvider>
      </body>
    </html>
  )
}