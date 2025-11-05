"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Package, Users, BarChart3 } from "lucide-react"
import { clearUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const items = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/admin/products", icon: Package, label: "Produits" },
    { href: "/admin/users", icon: Users, label: "Utilisateurs" },
    { href: "/admin/analytics", icon: BarChart3, label: "Ventes" },
  ]

  const handleLogout = () => {
    clearUser()
    router.push("/admin/login")
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-lg">IT</span>
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">InnovTech</span>
        </Link>
        <p className="text-xs text-sidebar-accent-foreground mt-2">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </Button>
      </div>
    </aside>
  )
}
