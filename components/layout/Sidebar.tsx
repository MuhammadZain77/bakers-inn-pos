// components/layout/Sidebar.tsx
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  RefreshCw 
} from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "POS Terminal", href: "/dashboard/pos", icon: ShoppingCart },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Sync Queue", href: "/dashboard/sync-queue", icon: RefreshCw }, // Added
  { name: "Users", href: "/dashboard/users", icon: Users },
]