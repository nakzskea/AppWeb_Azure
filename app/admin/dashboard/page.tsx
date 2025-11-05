"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getStoredUser } from "@/lib/auth"
import { mockProducts, mockUsers, mockOrders } from "@/lib/mock-data"
import { Package, Users, TrendingUp, ShoppingCart } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = getStoredUser()
    if (!storedUser || storedUser.role !== "admin") {
      router.push("/admin/login")
      return
    }
    setUser(storedUser)
  }, [router])

  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = mockOrders.length
  const activeUsers = mockUsers.filter((u) => u.status === "active").length

  if (!user) return null

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
            <p className="text-muted-foreground mt-1">Bienvenue, {user.name}</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">{totalOrders} commandes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produits</CardTitle>
                <Package className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{mockProducts.length}</div>
                <p className="text-xs text-muted-foreground mt-1">En stock</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{mockUsers.length}</div>
                <p className="text-xs text-muted-foreground mt-1">{activeUsers} actifs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                <ShoppingCart className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">Total depuis le début</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Produits récents</CardTitle>
                <CardDescription>Les 3 derniers produits ajoutés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockProducts.slice(0, 3).map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center pb-3 border-b border-border last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-foreground text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">${product.price}</p>
                      </div>
                      <span className="text-xs bg-secondary text-foreground px-2 py-1 rounded">
                        {product.stock} en stock
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commandes récentes</CardTitle>
                <CardDescription>Les 3 dernières commandes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockOrders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center pb-3 border-b border-border last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-foreground text-sm">{order.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.date).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-primary">${order.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
